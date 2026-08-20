"""
Uc veri setini birlestirme (v4):
- dataset.xlsx (imayda-1: 1000, etnik/politik nefret, 3 sinif)
- dataset2.xlsx (imayda-2: 10.224, etnik/politik nefret, 3 sinif)
- train.csv (Toygar/OffensEval kokenli: 42.398, genel saldirganlik, IKILI etiket)

Toygar veri setinde 'nefret' ile 'saldirgan' ayrimi yok - sadece
'offensive (1)' / 'not offensive (0)'. Bu yuzden label=1 olanlari
bizim 'saldirgan' (1) sinifimiza esliyoruz - "nefret" (2) sinifina DEGIL,
cunku bu veri seti hedefli kimlik nefreti ile genel saldirganligi ayirt etmiyor
ve etnik/politik nefret zaten diger iki veri setinde bol miktarda var.
Boylece tam da eksigimiz olan 'saldirgan' sinifini buyutmus oluyoruz.
"""

import pandas as pd
import openpyxl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR.parent / "data" / "raw"
PROCESSED_DIR = BASE_DIR.parent / "data" / "processed"

label_map = {"hiçbiri": 0, "saldırgan": 1, "nefret": 2}

all_rows = []

# --- imayda-1 ---
df1 = pd.read_excel(RAW_DIR / "dataset.xlsx", sheet_name="1000 Tweet")
df1 = df1[["Tweet", "Etiket"]].dropna()
df1["source"] = "imayda1"
all_rows.append(df1)

# --- imayda-2 ---
wb = openpyxl.load_workbook(RAW_DIR / "dataset2.xlsx", read_only=True)
keyword_sheets = [s for s in wb.sheetnames if s != "TOPLAM"]
for sheet in keyword_sheets:
    try:
        df2 = pd.read_excel(RAW_DIR / "dataset2.xlsx", sheet_name=sheet, header=1)
        if "Tweet" not in df2.columns or "Etiket" not in df2.columns:
            continue
        sub = df2[["Tweet", "Etiket"]].dropna()
        sub["source"] = f"imayda2_{sheet}"
        all_rows.append(sub)
    except Exception:
        pass

# --- Toygar/OffensEval (ikili -> hem 'saldirgan' hem 'hicbiri' icin kullanilir) ---
df3 = pd.read_csv(RAW_DIR / "train.csv")
df3 = df3[["text", "label"]].dropna()
df3 = df3.rename(columns={"text": "Tweet"})
df3["Etiket"] = df3["label"].map({1: "saldırgan", 0: "hiçbiri"})
df3["source"] = "toygar_offenseval"
all_rows.append(df3[["Tweet", "Etiket", "source"]])
# --- Yeni nefret veri seti ---
df4 = pd.read_csv(RAW_DIR / "hate_speech_curated_identity.csv")

df4 = df4[["tweet", "label"]].dropna()
df4 = df4.rename(columns={"tweet": "Tweet"})

df4["Etiket"] = "nefret"
df4["source"] = "hate_speech_selected_6000"

all_rows.append(df4[["Tweet", "Etiket", "source"]])
combined = pd.concat(all_rows, ignore_index=True)
combined["label"] = combined["Etiket"].map(label_map)
combined = combined.dropna(subset=["label"])
combined["label"] = combined["label"].astype(int)

before = len(combined)
combined = combined.drop_duplicates(subset=["Tweet"])
after = len(combined)
print(f"Tekillestirme: {before} -> {after} satir")

print("\nKaynak bazinda dagilim:")
print(combined["source"].apply(lambda s: s.split("_")[0]).value_counts())

print("\nToplam etiket dagilimi:")
print(combined["label"].value_counts())
print(f"  0=hiçbiri, 1=saldırgan, 2=nefret")

combined.to_csv(
    PROCESSED_DIR / "combined_dataset.csv",
    index=False
)
