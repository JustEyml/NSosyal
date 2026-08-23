const LEETSPEAK_MAP = {
  '0':'o', '1':'i', '3':'e', '4':'a', '5':'s', '7':'t', '8':'b', '9':'g',
  '@':'a', '$':'s', '!':'i', '+':'t'
};

// Kaynak: ooguz/turkce-kufur-karaliste (CC-BY-SA 4.0, github.com/ooguz/turkce-kufur-karaliste)
// 692 kelime/ifade - orijinal listeden asiri genel/tartismali birkac terim
// (orn. dini kelimeler) yanlis pozitif riski nedeniyle cikarilmistir.
const KEYWORD_LIST = ["amk", "aq", "ağzına sıçayım", "amarım", "ambiti", "am biti", "amcığı", "amcığın", "amcığını", "amcığınızı", "amcık", "amcık hoşafı", "amcıklama", "amcıklandı", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "amık", "amına", "amınako", "amına koy", "amına koyarım", "amına koyayım", "amınakoyim", "amına koyyim", "amına s", "amına sikem", "amına sokam", "amın feryadı", "amını", "amını s", "amın oglu", "amınoğlu", "amın oğlu", "amısına", "amısını", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyayım", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amkafa", "amk çocuğu", "amlarnzn", "amlı", "ammak", "ammna", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amsız", "amsiz", "amsz", "amteri", "amugaa", "amuğa", "amuna", "anaaann", "anal", "analarn", "anam", "anamla", "anan", "anana", "anandan", "ananı", "ananı", "ananın", "ananın am", "ananın amı", "ananın dölü", "ananınki", "ananısikerim", "ananı sikerim", "ananısikeyim", "ananı sikeyim", "ananızın", "ananızın am", "anani", "ananin", "ananisikerim", "anani sikerim", "ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anasını", "anasının am", "anası orospu", "anasi", "anasinin", "anay", "anayin", "anneni", "annenin", "annesiz", "anuna", "a.q.", "atkafası", "atmık", "attırdığım", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azdım", "azdır", "azdırıcı", "babaannesi kaşar", "babanı", "babanın", "babani", "babası pezevenk", "bacağına sıçayım", "bacına", "bacını", "bacının", "bacini", "bacn", "bacndan", "bacy", "bastard", "basur", "bızır", "bitch", "biting", "boka", "bokbok", "bokça", "bokhu", "bokkkumu", "boklar", "boktan", "boku", "bokubokuna", "bokum", "bombok", "boner", "bosalmak", "boşalmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cikar", "dalaksız", "dallama", "daltassak", "dalyarak", "dalyarrak", "dassagi", "diktim", "dildo", "dingil", "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domaldı", "domaldın", "domalık", "domalıyor", "domalmak", "domalmış", "domalsın", "domalt", "domaltarak", "domaltıp", "domaltır", "domaltırım", "domaltip", "domaltmak", "dölü", "dönek", "düdük", "eben", "ebeni", "ebenin", "ebeninki", "ecdadını", "ecdadini", "fahise", "fahişe", "feriştah", "ferre", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "geber", "geberik", "gebermek", "gebermiş", "gebertir", "gerızekalı", "giberim", "giberler", "gibis", "gibiş", "gibmek", "gibtiler", "goddamn", "godoş", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "göt deliği", "götelek", "göt herif", "götlalesi", "götlek", "götoğlanı", "göt oğlanı", "götoş", "götten", "götü", "götün", "götüne", "götünekoyim", "götüne koyim", "götünü", "götveren", "göt veren", "göt verir", "gtelek", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz", "hayvan herif", "hoşafı", "hsktr", "huur", "ıbnelık", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "imansz", "ipne", "iserim", "işerim", "itoğlu it", "kafam girsin", "kahpe", "kahpenin", "kahpenin feryadı", "kaka", "kaltak", "kancık", "kancik", "kappe", "karhane", "kaşar", "kavat", "kavatn", "kaypak", "kayyum", "kerane", "kerhane", "kerhanelerde", "kevase", "kevaşe", "kevvase", "koca göt", "koduğmun", "koduğmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyayım", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym", "laciye boyadım", "lavuk", "liboş", "madafaka", "malafat", "malak", "mcik", "meme", "memelerini", "mezveleli", "minaamcık", "mincikliyim", "monakkoluyum", "motherfucker", "mudik", "ocuu", "ocuun", "o. çocuğu", "oğlan", "oğlancı", "oğlu it", "orosbucocuu", "orospu", "orospucocugu", "orospu cocugu", "orospu çoc", "orospuçocuğu", "orospu çocuğu", "orospu çocuğudur", "orospu çocukları", "orospudur", "orospular", "orospunun", "orospunun evladı", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspuçocuğu", "oruspu çocuğu", "osbir", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum", "otuzbir", "öşex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evladı", "pezevenk", "pezo", "pici", "picler", "piçin oğlu", "piç kurusu", "piçler", "pipi", "pipiş", "pisliktir", "porno", "pussy", "puşt", "puşttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "salaak", "saxo", "sekis", "serefsiz", "sevgi koyarım", "sevişelim", "sexs", "sıçarım", "sıçtığım", "sıecem", "sicarsin", "sikdi", "sikdiğim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmiş", "sikilsin", "sikim", "sikimde", "sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "sikiş", "sikişen", "sikişme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "siktiğim", "siktiğimin", "siktiğiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin", "siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm", "skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokarım", "sokarim", "sokarm", "sokarmkoduumun", "sokayım", "sokaym", "sokiim", "soktuğumunun", "sokuk", "sokum", "sokuş", "sokuyum", "soxum", "sulaleni", "sülaleni", "sülalenizi", "sürtük", "şerefsiz", "şıllık", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "taşak", "taşşak", "tipini s.k", "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "totoş", "vajina", "vajinanı", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalarım", "yalarun", "yaraaam", "yarak", "yaraksız", "yaraktr", "yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraamı", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarrağ", "yarrağım", "yarrağımı", "yarraimin", "yarrak", "yarram", "yarramin", "yarraminbaşı", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yavş", "yavşak", "yavşaktır", "yavuşak", "yılışık", "yilisik", "yogurtlayam", "yoğurtlayam", "yrrak", "zıkkımım", "zibidi", "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini"];

function normalize(text){
  let t = text.toLocaleLowerCase('tr');
  t = t.split('').map(ch => LEETSPEAK_MAP[ch] || ch).join('');
  t = t.replace(/[i̇]/g,'i');
  t = t.replace(/[^a-zçğıöşü0-9\s]/g,'');
  t = t.replace(/(.)\1{2,}/g,'$1$1');
  t = t.replace(/\s+/g,' ').trim();
  return t;
}

function hitsKeywordList(text){
  const norm = normalize(text);
  const words = norm.split(' ').filter(Boolean);

  const merged = [];
  let buffer = '';

  for (const w of words) {
    if (w.length === 1) {
      buffer += w;
    } else {
      if (buffer) {
        merged.push(buffer);
        buffer = '';
      }
      merged.push(w);
    }
  }

  if (buffer) merged.push(buffer);

  const allWords = [...words, ...merged];

  return KEYWORD_LIST.some(entry => {
    const entryNorm = normalize(entry);
    const isPhrase = entryNorm.includes(' ');

    if (isPhrase) {
      return norm.includes(entryNorm);
    }

    const entrySquashed = entryNorm.replace(/\s/g,'');
    return allWords.some(
      w => w === entrySquashed || w.startsWith(entrySquashed)
    );
  });
}

const presets = {
  "0": "Bu konudaki fikrine katılmıyorum ama güzel bir yazı olmuş, teşekkürler.",
  "1": "Bu konuda tamamen yanılıyorsun, üstelik senin gibi bir şeyi anlamayan biriyle tartışmak zaman kaybı.",
  "2": "Bu fotoğrafta bu kadar kilo almış birini görmek gerçekten çok kötü olmuş, hiç böyle paylaşmamalıydın.",
  "3": "Bu yazıyı yazan amk salak mısın sen ya siktir git buradan.",
  "4": "Bu mağazadaki o çalışan resmen bir şey işini bile beceremiyor, öyle bir yetersiz ki insan hayrete düşüyor."
};

document.querySelectorAll('.preset-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    input.value = presets[btn.dataset.p];
    updateCount();
    input.focus();
  });
});

const input = document.getElementById('input');
const charCount = document.getElementById('charCount');
const postBtn = document.getElementById('postBtn');
const gaugeFill = document.getElementById('gaugeFill');
const gaugeLabel = document.getElementById('gaugeLabel');
const loadingLine = document.getElementById('loadingLine');
const verdict = document.getElementById('verdict');
const vBadge = document.getElementById('vBadge');
const vTitle = document.getElementById('vTitle');
const vReason = document.getElementById('vReason');
const rewriteWrap = document.getElementById('rewriteWrap');
const rewriteText = document.getElementById('rewriteText');
const vActions = document.getElementById('vActions');
const feed = document.getElementById('feed');

const participantIdInput = document.getElementById('participantIdInput');
const startParticipantBtn = document.getElementById('startParticipantBtn');
const endParticipantBtn = document.getElementById('endParticipantBtn');
const participantStart = document.getElementById('participantStart');
const participantActive = document.getElementById('participantActive');
const currentParticipant = document.getElementById('currentParticipant');

function updateParticipantUI(){
  const participantId = sessionStorage.getItem('participant_id');

  if(participantId){
    participantStart.style.display = 'none';
    participantActive.style.display = 'flex';
    currentParticipant.textContent = participantId;
  } else {
    participantStart.style.display = 'flex';
    participantActive.style.display = 'none';
    currentParticipant.textContent = '';
  }
}

startParticipantBtn.addEventListener('click', ()=>{
  const participantId = participantIdInput.value.trim().toUpperCase();

  if(!participantId){
    alert('Lütfen Participant ID girin (ör. P01).');
    return;
  }

  sessionStorage.setItem('participant_id', participantId);
  participantIdInput.value = '';
  updateParticipantUI();
});

endParticipantBtn.addEventListener('click', ()=>{
  sessionStorage.removeItem('participant_id');
  resetAll();
  updateParticipantUI();
});

updateParticipantUI();

let currentLogId = null;

function updateCount(){
  charCount.textContent = input.value.length + ' / 400';
}

input.addEventListener('input', updateCount);

function resetGauge(){
  gaugeFill.style.width = '0%';
  gaugeFill.style.background = 'var(--safe)';
  gaugeLabel.textContent = 'risk göstergesi';
}

function setGauge(tier){
  const map = {
    0:{w:'8%',c:'var(--safe)',l:'güvenli'},
    1:{w:'40%',c:'var(--caution)',l:'sınırda'},
    2:{w:'72%',c:'var(--friction)',l:'yüksek risk'},
    3:{w:'100%',c:'var(--block)',l:'engellendi'}
  };

  const m = map[tier];

  gaugeFill.style.width = m.w;
  gaugeFill.style.background = m.c;
  gaugeLabel.textContent = m.l;
}

function clearVerdict(){
  verdict.className = 'verdict';
  vActions.innerHTML = '';
  rewriteWrap.style.display = 'none';
  document.getElementById('mlInfoLine').textContent = '';
}

function showMlInfo(result){
  const el = document.getElementById('mlInfoLine');

  if (result.ml_tier === null || result.ml_tier === undefined) {
    el.textContent = '';
    return;
  }

  const isimler = {
    0:'temiz',
    1:'saldırgan',
    2:'nefret'
  };

  const kimKarar =
    result.decided_by === 'ml'
      ? 'ML modeli karar verdi'
      : 'LLM karar verdi (ML LLM ile desteklendi)';

  el.textContent =
    `ML tahmini: ${isimler[result.ml_tier]} (%${(result.ml_confidence*100).toFixed(1)} güven) — ${kimKarar}`;
}

function addToFeed(text, tier){
  const empty = feed.querySelector('.empty-feed');

  if(empty) empty.remove();

  const tierNames = {
    0:'Tier 0',
    1:'Tier 1',
    2:'Tier 2'
  };

  const el = document.createElement('div');

  el.className = 'post';

  el.innerHTML = `
    <div class="post-meta">
      <span class="post-tier t${tier}">${tierNames[tier]}</span>
      <span class="post-when">şimdi</span>
    </div>
    <div class="post-text"></div>
  `;

  el.querySelector('.post-text').textContent = text;

  feed.prepend(el);
}

const SYSTEM_PROMPT = `Sen NSosyal platformu için bir içerik moderasyon sınıflandırıcısısın. Sana bir Türkçe yorum verilecek. Görevin:
1) Yorumun taciz, kişiye yönelik saldırı, beden/görünüm üzerinden aşağılama veya hedefli hakaret içerip içermediğini değerlendirmek.
2) Bunu üç seviyeden birine atamak:
   - tier 0: sorun yok, doğrudan paylaşılabilir.
   - tier 1: sınırda/gergin dil var ama açık taciz değil (yumuşak öneri gösterilecek, kullanıcı yine de paylaşabilir).
   - tier 2: açık taciz/hedefli saldırı/aşağılama var ama küfür kelime listesi tetiklenmedi (kullanıcıya "emin misin" onayı sorulacak).
3) Kısa, tarafsız bir gerekçe yaz (tek cümle, Türkçe).
4) Aynı fikri/eleştiriyi koruyan ama saldırgan/aşağılayıcı kısmı çıkaran bir yeniden yazım öner (tier 0 ise rewrite'ı orijinal metinle aynı bırak).

SADECE şu JSON formatında yanıt ver, başka hiçbir şey yazma, markdown kod bloğu kullanma:
{"tier": 0, "reason": "...", "rewrite": "..."}`;

async function callModel(text, isTier3){
  const response = await fetch("http://localhost:3000/api/moderate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      isTier3: !!isTier3,
      participant_id: sessionStorage.getItem('participant_id')
    })
  });

  if (!response.ok) {
    throw new Error(
      "Sunucudan hata döndü: " + response.status
    );
  }

  return await response.json();
}

async function logUserAction(action, publishedText = null) {
  if (!currentLogId) return;

  try {
    await fetch(
      "http://localhost:3000/api/moderation-action",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          log_id: currentLogId,
          action: action,
          published_text: publishedText
        })
      }
    );
  } catch (e) {
    console.error(
      "Action log kaydedilemedi:",
      e
    );
  }
}

function renderVerdict(
  tier,
  reason,
  rewrite,
  originalText,
  opts
){
  opts = opts || {};

  clearVerdict();

  verdict.classList.add('show');

  if(tier === 3){

    verdict.classList.add('t3');

    vBadge.textContent = 'Tier 3 · Engellendi';

    vTitle.textContent =
      'Bu yorum otomatik olarak engellendi';

    vReason.textContent = reason;

    rewriteWrap.style.display =
      rewrite ? 'block' : 'none';

    if(rewrite){
      rewriteText.textContent = rewrite;
    }

    if (rewrite) {
      const useBtn =
        document.createElement('button');

      useBtn.className =
        'btn btn-primary';

      useBtn.textContent =
        'Öneriyi kullan ve paylaş';

      useBtn.onclick = async () => {
        await logUserAction(
          'rewrite_used',
          rewrite
        );

        addToFeed(rewrite, 0);

        resetAll();
      };

      vActions.appendChild(useBtn);
    }

    const abandonBtn =
      document.createElement('button');

    abandonBtn.className =
      'btn btn-ghost';

    abandonBtn.textContent =
      'Vazgeç';

    abandonBtn.onclick = async () => {
      await logUserAction(
        'abandoned',
        null
      );

      resetAll();
    };

    const editBtn =
      document.createElement('button');

    editBtn.className =
      'btn btn-ghost';

    editBtn.textContent =
      'Düzenlemeye devam et';

    editBtn.onclick = async () => {
      await logUserAction(
        'edit_selected'
      );

      clearVerdict();
      resetGauge();
    };

    vActions.appendChild(abandonBtn);
    vActions.appendChild(editBtn);
  }

  else if(tier === 2){

    verdict.classList.add('t2');

    vBadge.textContent =
      'Tier 2 · Onay gerekli';

    vTitle.textContent =
      'Bu yorum hedefli bir saldırı gibi görünüyor';

    vReason.textContent = reason;

    rewriteWrap.style.display = 'block';

    rewriteText.textContent = rewrite;

    const useBtn =
      document.createElement('button');

    useBtn.className =
      'btn btn-primary';

    useBtn.textContent =
      'Öneriyi kullan ve paylaş';

    useBtn.onclick = async () => {
      await logUserAction(
        'rewrite_used',
        rewrite
      );

      addToFeed(rewrite, 0);

      resetAll();
    };


    const anywayBtn =
      document.createElement('button');

    anywayBtn.className =
      'btn btn-danger-ghost';

    anywayBtn.textContent =
      'Evet, yine de paylaş';

    anywayBtn.onclick = async () => {
      await logUserAction(
        'original_posted',
        originalText
      );

      addToFeed(originalText, 2);

      resetAll();
    };


    const abandonBtn =
      document.createElement('button');

    abandonBtn.className =
      'btn btn-ghost';

    abandonBtn.textContent =
      'Vazgeç';

    abandonBtn.onclick = async () => {
      await logUserAction(
        'abandoned',
        null
      );

      resetAll();
    };


    const editBtn =
      document.createElement('button');

    editBtn.className =
      'btn btn-ghost';

    editBtn.textContent =
      'Düzenle';

    editBtn.onclick = async () => {
      await logUserAction(
        'edit_selected'
      );

      clearVerdict();
      resetGauge();
    };


    vActions.appendChild(useBtn);
    vActions.appendChild(anywayBtn);
    vActions.appendChild(abandonBtn);
    vActions.appendChild(editBtn);
  }

  else if(tier === 1){

    verdict.classList.add('t1');

    vBadge.textContent =
      'Tier 1 · Öneri';

    vTitle.textContent =
      'Dilini yumuşatmak ister misin?';

    vReason.textContent = reason;

    rewriteWrap.style.display =
      'block';

    rewriteText.textContent =
      rewrite;


    const useBtn =
      document.createElement('button');

    useBtn.className =
      'btn btn-primary';

    useBtn.textContent =
      'Öneriyi kullan ve paylaş';

    useBtn.onclick = async () => {
      await logUserAction(
        'rewrite_used',
        rewrite
      );

      addToFeed(rewrite, 0);

      resetAll();
    };


    const anywayBtn =
      document.createElement('button');

    anywayBtn.className =
      'btn btn-ghost';

    anywayBtn.textContent =
      'Orijinaliyle paylaş';

    anywayBtn.onclick = async () => {
      await logUserAction(
        'original_posted',
        originalText
      );

      addToFeed(originalText, 1);

      resetAll();
    };


    const abandonBtn =
      document.createElement('button');

    abandonBtn.className =
      'btn btn-ghost';

    abandonBtn.textContent =
      'Vazgeç';

    abandonBtn.onclick = async () => {
      await logUserAction(
        'abandoned',
        null
      );

      resetAll();
    };


    const editBtn =
      document.createElement('button');

    editBtn.className =
      'btn btn-ghost';

    editBtn.textContent =
      'Düzenle';

    editBtn.onclick = async () => {
      await logUserAction(
        'edit_selected'
      );

      clearVerdict();
      resetGauge();
    };


    vActions.appendChild(useBtn);
    vActions.appendChild(anywayBtn);
    vActions.appendChild(abandonBtn);
    vActions.appendChild(editBtn);
  }
}

function resetAll(){
  input.value = '';

  updateCount();

  clearVerdict();

  resetGauge();

  currentLogId = null;

  postBtn.disabled = false;

  postBtn.textContent = 'Paylaş';

  loadingLine.style.display = 'none';
}


postBtn.addEventListener('click', async ()=>{

  const participantId =
    sessionStorage.getItem('participant_id');

  if(!participantId){
    alert(
      'Önce Participant ID girerek testi başlatın.'
    );

    participantIdInput.focus();

    return;
  }


  const text = input.value.trim();

  if(!text) return;


  clearVerdict();

  postBtn.disabled = true;

  postBtn.textContent = '…';


  // Tier 3 check — local, instant
  if(hitsKeywordList(text)){

    setGauge(3);

    postBtn.disabled = false;

    postBtn.textContent = 'Paylaş';

    loadingLine.style.display = 'block';

    loadingLine.textContent =
      'engellendi — alternatif ifade öneriliyor…';

    try{

      const result =
        await callModel(text, true);

      currentLogId =
        result.log_id;

      loadingLine.style.display =
        'none';

      renderVerdict(
        3,
        'Bu yorum, platformda otomatik olarak engellenen kelime/ifade listesindeki bir terim içeriyor.',
        result.rewrite,
        text
      );

    }catch(e){

      loadingLine.style.display =
        'none';

      renderVerdict(
        3,
        'Bu yorum, platformda otomatik olarak engellenen kelime/ifade listesindeki bir terim içeriyor.',
        null,
        text
      );
    }

    return;
  }


  // Tier 0–2 — model call
  loadingLine.style.display = 'block';

  loadingLine.textContent =
    'model değerlendiriyor…';


  try{

    const result =
      await callModel(text);

    currentLogId =
      result.log_id;

    loadingLine.style.display =
      'none';

    setGauge(result.tier);

    postBtn.disabled = false;

    postBtn.textContent =
      'Paylaş';


    if(result.tier === 0){

      await logUserAction(
        'direct_posted',
        text
      );

      addToFeed(
        text,
        0
      );

      resetAll();

    } else {

      renderVerdict(
        result.tier,
        result.reason,
        result.rewrite,
        text
      );

      showMlInfo(result);
    }

  }catch(e){

    loadingLine.style.display =
      'none';

    postBtn.disabled =
      false;

    postBtn.textContent =
      'Paylaş';

    loadingLine.style.display =
      'block';

    loadingLine.textContent =
      'model çağrısı başarısız oldu, tekrar dene.';

    setTimeout(()=>{
      loadingLine.style.display =
        'none';
    },2500);
  }
});