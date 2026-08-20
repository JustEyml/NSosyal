# NSosyal Moderasyon Projesi — Klasör Kılavuzu

## Dosyalar ve ne işe yaradıkları

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Demo arayüzü (tarayıcıda çift tıklayıp açın). Tier 3 (küfür) tespiti yerelde çalışır. Tier 0-2 (LLM tabanlı) için AI_CONFIG bölümüne kendi API anahtarınızı eklemeniz gerekir. |
| `dataset.xlsx` | imayda-1 veri seti (1000 tweet, ham kaynak) |
| `dataset2.xlsx` | imayda-2 veri seti (10.224 tweet, ham kaynak) |
| `train.csv` | Toygar/OffensEval veri seti (42.398 satır, ham kaynak) |
| `merge_datasets_v4.py` | Üç veri setini birleştirip `combined_dataset_v4.csv`'yi üretir |
| `combined_dataset_v4.csv` | Zaten birleştirilmiş, hazır veri (52.157 satır) |
| `train_classifier_v4.py` | TF-IDF + Lojistik Regresyon modelini eğitir, sonuçları yazdırır |
| `toxicity_model_v4.pkl` | Eğitilmiş model (zaten eğitilmiş halde, tekrar eğitmenize gerek yok) |
| `tfidf_vectorizer_v4.pkl` | Eğitilmiş TF-IDF vektörleştirici |
| `metrics_v4.json` | v4 modelinin doğruluk/precision/recall sonuçları |

## index.html içinde kendi API'nizi bağlama

1. Dosyayı VS Code'da açın, `AI_CONFIG` yorumunu arayın (Ctrl+F ile "AI_CONFIG" yazın)
2. `callModel` fonksiyonuna gidin
3. "SEÇENEK 1: Google Gemini" bloğu varsayılan olarak aktif — `API_KEY` satırındaki
   `"BURAYA_KENDI_API_ANAHTARINIZI_YAPISTIRIN"` yazısını kendi anahtarınızla değiştirin
4. Gemini anahtarı almak için: https://aistudio.google.com/apikey (ücretsiz)
5. Başka bir servis kullanmak isterseniz (OpenRouter, Groq gibi), dosyadaki
   "SEÇENEK 2" bloğunu aktif hale getirip Seçenek 1'i yorum satırı yapın —
   dosyanın içinde bunun nasıl yapılacağı adım adım yazıyor

## Python scriptlerini çalıştırma (VS Code terminalinde)

```
python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\activate
pip install pandas scikit-learn openpyxl
python train_classifier_v4.py   # modeli sıfırdan eğitir, sonuçları gösterir
```

## Önemli not

`index.html`'i tarayıcıda doğrudan çift tıklayarak açabilirsiniz — internet
bağlantısı sadece API çağrıları (Tier 0-2 sınıflandırma) için gerekli.
Tier 3 (küfür listesi) tamamen yerel çalışır, internet gerektirmez.
