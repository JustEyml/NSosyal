"""
NSosyal Moderasyon - Tier 1/2 Siniflandirici Egitimi (v4 - Uc Kaynak Birlesimi)
-----------------------------------------------------------------------------------
Veri: imayda-1 (998) + imayda-2 (10.166) + Toygar/OffensEval (40.993) = 52.157 satir
Tamami gercek veri - sentetik veri KULLANILMADI (v3'teki sentetik deney basarisiz oldu).
"""

import re
import json
import pickle
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR.parent / "data" / "processed" / "combined_dataset.csv"

df = pd.read_csv(DATA_FILE)

def clean(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@user", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)
    text = re.sub(r"[^a-zçğıöşü0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

df["clean_text"] = df["Tweet"].apply(clean)

X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"], df["label"],
    test_size=0.2, random_state=42, stratify=df["label"]
)

print(f"Egitim: {len(X_train)}  Test: {len(X_test)}")

vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2), min_df=3)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=1000, class_weight="balanced", C=5)
model.fit(X_train_vec, y_train)

y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)
report = classification_report(
    y_test, y_pred,
    target_names=["hiçbiri (0)", "saldırgan (1)", "nefret (2)"],
    output_dict=True
)
cm = confusion_matrix(y_test, y_pred).tolist()

print(f"\nTest dogruluk (accuracy): {acc:.3f}\n")
print(classification_report(y_test, y_pred, target_names=["hiçbiri (0)", "saldırgan (1)", "nefret (2)"]))
print("Karisiklik matrisi:")
print(cm)

with open(BASE_DIR / "toxicity_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open(BASE_DIR / "tfidf_vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

metrics_summary = {
    "accuracy": acc,
    "classification_report": report,
    "confusion_matrix": cm,
    "train_size": len(X_train),
    "test_size": len(X_test),
    "label_distribution": df["label"].value_counts().to_dict(),
    "sources": ["imayda-1 (998)", "imayda-2 (10.166)", "Toygar/OffensEval (40.993)"]
}
with open(BASE_DIR / "metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics_summary, f, ensure_ascii=False, indent=2)

def predict_tier(text):
    cleaned = clean(text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0]
    return int(pred), {int(k): round(float(v), 3) for k, v in zip(model.classes_, proba)}

test_sentences = [
    "bu videoyu çok beğendim emeğine sağlık",
    "sen tam bir aptalsın böyle yorum yapılmaz",
    "bu adam gerçekten çok yetenekli bir sanatçı",
    "senin gibi biriyle konuşmak bile bana yakışmıyor",
    "bu fotoğrafta böyle görünmen gerçekten çok kötü olmuş",
    "o çalışan işini gerçekten hiç beceremiyor",
]
print("\n--- Hizli deneme ---")
for s in test_sentences:
    tier, proba = predict_tier(s)
    print(f"'{s}' -> tier {tier}, olasiliklar: {proba}")
