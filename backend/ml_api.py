# -*- coding: utf-8 -*-
"""
ml_api.py
----------
Egitilmis TF-IDF + Lojistik Regresyon modelini bir HTTP API olarak sunar.
Node/Express sunucusu (server.js) bu API'ye istek atip tier + olasilik alir.

Calistirma:
    pip install flask flask-cors scikit-learn --break-system-packages
    python ml_api.py
"""

import re
import pickle
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR.parent / "model"

with open(MODEL_DIR / "toxicity_model.pkl", "rb") as f:
    model = pickle.load(f)

with open(MODEL_DIR / "tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

def clean(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@user", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)
    text = re.sub(r"[^a-zçğıöşü0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "text alani gerekli"}), 400

    cleaned = clean(text)
    vec = vectorizer.transform([cleaned])
    tier = int(model.predict(vec)[0])
    proba = model.predict_proba(vec)[0]
    proba_dict = {int(k): round(float(v), 4) for k, v in zip(model.classes_, proba)}

    return jsonify({
        "ml_tier": tier,               # 0=hicbiri, 1=saldirgan, 2=nefret
        "ml_probabilities": proba_dict,
        "ml_confidence": round(float(max(proba)), 4)
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("ML API calisiyor: http://localhost:5000")
    app.run(port=5000, debug=False)
