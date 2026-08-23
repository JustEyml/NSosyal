const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
});

const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, '..', 'frontend')
  )
);

// Gemini API key
const API_KEY = process.env.GEMINI_API_KEY;

// ============================================================
// GUVEN ESIGI (CONFIDENCE THRESHOLD)
// ============================================================
// ML modelinin tahmini bu degerin USTUNDEYSE -> ML karar verir, Gemini sadece
// gerekce + rewrite yazar (tier'i degistirmez).
// ML modelinin tahmini bu degerin ALTINDAYSA -> belirsiz demektir, Gemini
// hem tier'i hem gerekce/rewrite'i kendisi belirler (eskisi gibi tam karar).
const CONFIDENCE_THRESHOLD = 0.85;

// Moderation prompt - TAM KARAR (ML belirsiz kaldiginda kullanilir)
const FULL_DECISION_PROMPT = `Sen NSosyal platformu için bir Türkçe içerik moderasyon sınıflandırıcısısın.

Sana bir Türkçe yorum verilecek.

Yorumu aşağıdaki sınıflandırma sistemine göre değerlendir:

TIER 0 — HİÇBİRİ / NORMAL
- Zararlı veya saldırgan içerik yoktur.
- Normal fikir ayrılığı, eleştiri veya olumsuz görüş bu sınıfa girer.
- Bir fikri, ürünü, projeyi veya performansı eleştirmek tek başına saldırganlık değildir.

Örnek:
"Bu fikre katılmıyorum."
"Bu sunumu başarılı bulmadım."

TIER 1 — SALDIRGAN / OFFENSIVE
- Bir kişiye yönelik hakaret, küçümseme, aşağılama veya saldırgan dil vardır.
- Kişinin zekası, yeteneği, görünüşü veya kişisel özellikleri hedef alınabilir.
- Ancak saldırı bir gruba veya korunan kimliğe yönelik nefret söylemi değildir.

Örnek:
"Sen hiçbir şeyden anlamıyorsun."
"Bu işi yapabilecek kapasitede değilsin."
"Kendini zeki sanıyorsun ama değilsin."

TIER 2 — NEFRET SÖYLEMİ / HATE SPEECH
- Bir kişi veya grup; ırk, etnik köken, milliyet, din, cinsiyet veya benzeri kimlik/grup özellikleri üzerinden hedef alınmaktadır.
- İçerik bu gruba karşı aşağılama, düşmanlık, nefret veya ayrımcı ifade içermektedir.
- Sadece kişisel hakaret olması Tier 2 için yeterli değildir.

ÖNEMLİ:
Tier 1 ile Tier 2'yi karıştırma.
Bir kişiye yönelik sıradan hakaret veya aşağılama = Tier 1.
Bir gruba/kimliğe yönelik nefret veya ayrımcı saldırı = Tier 2.

Görevin:
1) Yorumu Tier 0, Tier 1 veya Tier 2 olarak sınıflandır.
2) Kısa ve tarafsız bir Türkçe gerekçe yaz.
3) Tier 1 veya Tier 2 ise aynı temel fikri koruyan fakat saldırgan/nefret içeriğini kaldıran yapıcı bir yeniden yazım öner.
4) Tier 0 ise rewrite alanında orijinal metni koru.

SADECE aşağıdaki JSON formatında cevap ver.
Markdown kullanma.
Başka hiçbir şey yazma.

{"tier":0,"reason":"...","rewrite":"..."}`;
// Moderation prompt - SADECE REWRITE (ML zaten yuksek guvenle karar verdiginde kullanilir)
function buildRewriteOnlyPrompt(fixedTier) {

  const tierDescription =
    fixedTier === 0
      ? 'normal / zararsız içerik'
      : fixedTier === 1
      ? 'kişiye yönelik saldırgan veya aşağılayıcı içerik'
      : 'bir grup veya kimliğe yönelik nefret söylemi';

  return `Sen NSosyal platformu için bir içerik moderasyon asistanısın.

Bu yorumun sınıflandırması sistem tarafından ZATEN belirlenmiştir.

Kesin karar:
Tier ${fixedTier} — ${tierDescription}

Bu kararı DEĞİŞTİRME.

Görevin:
1) Karara uygun, kısa ve tarafsız bir Türkçe gerekçe yaz.
2) Tier 1 veya Tier 2 ise yorumun temel fikrini koruyarak saldırgan veya nefret içeren kısmı kaldıran yapıcı bir alternatif yaz.
3) Tier 0 ise rewrite alanında orijinal metni koru.

SADECE aşağıdaki JSON formatında cevap ver.
"tier" alanına tam olarak ${fixedTier} yaz.
Markdown kullanma.
Başka hiçbir şey yazma.

{"tier":${fixedTier},"reason":"...","rewrite":"..."}`;
}

// Moderation prompt - TIER 3 (kufur listesi zaten tetiklendi, kesin rewrite gerekiyor)
// Guven esigi mantigina hic girmez - her zaman GERCEK bir alternatif uretir,
// "orijinaliyle ayni birak" gibi bir kacis yolu YOKTUR.
function buildTier3RewritePrompt() {
  return `Sen NSosyal platformu için bir içerik moderasyon asistanısın. Sana gelen yorum, küfür/ağır hakaret içerdiği için sistem tarafından ZATEN OTOMATİK OLARAK ENGELLENMİŞTİR (tier 3).

Senin tek görevin:
1) Kısa, tarafsız bir gerekçe yazmak (tek cümle, Türkçe) - neden engellendiğini açıkla.
2) Bu yorumun ANLAMINI/ELEŞTİRİSİNİ koruyarak, küfür ve hakaret İÇERMEYEN, tamamen normal bir yeniden yazım önermek. Bu rewrite KESİNLİKLE orijinal metinle aynı OLMAMALI ve hiçbir küfür/hakaret kelimesi İÇERMEMELİ.

SADECE aşağıdaki JSON formatında cevap ver, "tier" alanına 3 yaz.
Markdown kullanma. Başka hiçbir şey yazma.

{"tier":3,"reason":"...","rewrite":"..."}`;
}


// ============================================================
// MODERATION API
// ============================================================

app.post('/api/moderate', async (req, res) => {
  try {
    const { text, isTier3, participant_id  } = req.body;

    // 1. Text kontrolü
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Gecersiz istek: "text" alani gerekli'
      });
    }

    // 2. API key kontrolü
    if (!API_KEY) {
      console.error('GEMINI_API_KEY bulunamadi.');

      return res.status(500).json({
        error: 'GEMINI_API_KEY bulunamadi. .env dosyasini kontrol edin.'
      });
    }

    console.log('Moderasyon istegi geldi.');
    console.log('Yorum:', text);


    // ============================================================
    // ML API (TF-IDF + Lojistik Regresyon on-tahmini)
    // ============================================================

    let mlResult = null;

    try {
      const mlResponse = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!mlResponse.ok) {
        throw new Error('ML API HTTP ' + mlResponse.status);
      }

      mlResult = await mlResponse.json();

      console.log(
        `ML tahmini: tier=${mlResult.ml_tier} guven=%${(mlResult.ml_confidence * 100).toFixed(1)}`
      );

    } catch (mlError) {
      // ML API'ye ulasilamazsa sistemi tamamen durdurmuyoruz,
      // Gemini'yi tam karar modunda (eski davranis) calistiriyoruz
      console.error('ML API HATASI (Gemini tam karar verecek):', mlError.message);
    }


    // ============================================================
    // YONLENDIRME KARARI: ML mi karar verecek, Gemini mi, yoksa Tier3 rewrite mi?
    // ============================================================

    let promptToUse;
    let mlIsConfident = false;

    if (isTier3) {
      // Kufur listesi zaten tetiklendi (client-side) - guven esigi mantigina hic girme,
      // her zaman garantili, gercek bir rewrite uret.
      console.log('-> TIER 3 (kufur listesi tetiklendi), garantili rewrite uretiliyor.');
      promptToUse = buildTier3RewritePrompt();
    } else {
      // ASIMETRIK ESIK: ML'in "temiz" (tier 0) demesi ile "sorunlu" (tier 1/2)
      // demesi ayni riski tasimiyor. Yanlislikla bir seyi engellemek zararsizken,
      // yanlislikla bir tacizi "temiz" diye gecirmek daha ciddi bir hata. Bu yuzden
      // ML sadece "burada sorun var" derken ve eminse dogrudan ona guveniyoruz;
      // ML "temiz" derse -ne kadar emin olursa olsun- LLM'e her zaman sorup
      // ikinci bir goz attiriyoruz.
      mlIsConfident = mlResult
        && mlResult.ml_tier !== 0
        && mlResult.ml_confidence >= CONFIDENCE_THRESHOLD;

      if (mlIsConfident) {
        console.log(`-> ML YETERINCE EMIN VE "SORUNLU" DEDI (>=%${CONFIDENCE_THRESHOLD * 100}), Gemini sadece rewrite yazacak.`);
        promptToUse = buildRewriteOnlyPrompt(mlResult.ml_tier);
      } else {
        console.log('-> ML "temiz" dedi veya belirsiz/erisilemedi, Gemini tam karari kendisi verecek (ikinci kontrol).');
        promptToUse = FULL_DECISION_PROMPT;
      }
    }

    const mlInfoText = mlResult
      ? `\n\nKlasik ML modelinin (TF-IDF+Lojistik Regresyon) tahmini: tier ${mlResult.ml_tier} ` +
        `(olasiliklar: temiz=%${(mlResult.ml_probabilities[0] * 100).toFixed(1)}, ` +
        `saldirgan=%${(mlResult.ml_probabilities[1] * 100).toFixed(1)}, ` +
        `nefret=%${(mlResult.ml_probabilities[2] * 100).toFixed(1)})`
      : '';


    // ============================================================
    // GEMINI API
    // ============================================================

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptToUse + '\n\nYorum: ' + text + mlInfoText
                }
              ]
            }
          ]
        })
      }
    );


    // Gemini cevabini oku
    const data = await response.json();

    console.log('Gemini HTTP status:', response.status);
    console.log(
      'Gemini response:',
      JSON.stringify(data, null, 2)
    );


    // ============================================================
    // GEMINI API ERROR
    // ============================================================

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        'Gemini API bilinmeyen bir hata verdi';

      console.error('Gemini API HATASI:', errorMessage);

      return res.status(500).json({
        error: errorMessage
      });
    }


    // ============================================================
    // RESPONSE CONTROL
    // ============================================================

    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      console.error(
        'Gemini bos veya beklenmeyen cevap verdi:',
        JSON.stringify(data, null, 2)
      );

      return res.status(500).json({
        error: 'Gemini bos veya beklenmeyen cevap dondu'
      });
    }


    console.log('Gemini raw response:', raw);


    // ============================================================
    // JSON TEMIZLEME
    // ============================================================

    const clean = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();


    // ============================================================
    // JSON PARSE
    // ============================================================

    let result;

    try {
      result = JSON.parse(clean);
    } catch (jsonError) {

      console.error(
        'Gemini JSON parse hatasi:',
        jsonError.message
      );

      console.error(
        'Gelen cevap:',
        clean
      );

      return res.status(500).json({
        error: 'Gemini gecersiz JSON cevabi dondu'
      });
    }


    // ============================================================
    // RESULT VALIDATION
    // ============================================================

    if (
      typeof result.tier !== 'number' ||
      typeof result.reason !== 'string' ||
      typeof result.rewrite !== 'string'
    ) {
      console.error(
        'Gemini response formati hatali:',
        result
      );

      return res.status(500).json({
        error: 'Gemini beklenen formatta cevap vermedi'
      });
    }

    // Guvenlik agi: ML'in emin oldugu durumda tier'i yine de ML'in dedigine
    // sabitliyoruz (Gemini talimati yanlislikla degistirse bile)
    if (mlIsConfident) {
      result.tier = mlResult.ml_tier;
    }

    // Guvenlik agi 2: Gemini bazen guvenlik filtresine takilip bos rewrite donebiliyor.
    // Bos/whitespace-only rewrite asla kabul edilmez, yedek bir metinle degistirilir.
    if (!result.rewrite || !result.rewrite.trim()) {
      console.warn('UYARI: Gemini bos rewrite dondu, yedek metin kullaniliyor.');
      result.rewrite = 'Bu konudaki eleştirimi daha yapıcı bir dille ifade etmek isterim.';
    }


    // ============================================================
    // SUCCESS
    // ============================================================

    console.log('Moderasyon sonucu:', result);

const decidedBy = mlIsConfident ? 'ml' : 'llm';

const insert = db.prepare(`
  INSERT INTO moderation_logs (
    participant_id,
    original_text,
    suggested_rewrite,
    ml_tier,
    ml_confidence,
    final_tier,
    decided_by
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const dbResult = insert.run(
  participant_id || null,
  text,
  result.rewrite,
  mlResult?.ml_tier ?? null,
  mlResult?.ml_confidence ?? null,
  result.tier,
  decidedBy
);

return res.json({
  ...result,
  log_id: dbResult.lastInsertRowid,
  ml_tier: mlResult?.ml_tier ?? null,
  ml_confidence: mlResult?.ml_confidence ?? null,
  ml_probabilities: mlResult?.ml_probabilities ?? null,
  decided_by: decidedBy
});

  } catch (err) {

    console.error(
      'SERVER / MODERASYON HATASI:',
      err
    );

    return res.status(500).json({
      error: err.message || 'Model cagrisi basarisiz oldu'
    });
  }
});


// ============================================================
// SERVER
// ============================================================

const PORT = 3000;
app.post('/api/moderation-action', (req, res) => {
  try {
    const {
      log_id,
      action,
      published_text
    } = req.body;

    if (!log_id || !action) {
      return res.status(400).json({
        error: 'log_id ve action gerekli'
      });
    }

    const update = db.prepare(`
      UPDATE moderation_logs
      SET
        user_action = ?,
        published_text = ?
      WHERE id = ?
    `);

    const result = update.run(
      action,
      published_text || null,
      log_id
    );

    return res.json({
      success: true,
      updated: result.changes
    });

  } catch (err) {
    console.error('Database action error:', err);

    return res.status(500).json({
      error: err.message
    });
  }
});
app.listen(PORT, () => {
  console.log('');
  console.log('======================================');
  console.log(`Sunucu calisiyor: http://localhost:${PORT}`);
  console.log(`Guven esigi: %${CONFIDENCE_THRESHOLD * 100}`);
  console.log('======================================');
  console.log('');
});