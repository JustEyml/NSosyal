# NSosyal — Preventive AI Moderation System

NSosyal is a Turkish-language social media moderation prototype designed to intervene **before harmful content is published**.

Instead of relying only on post-publication deletion or binary allow/block decisions, NSosyal combines machine learning, contextual AI, rule-based detection, and tier-specific user interventions to encourage safer and more constructive communication.

The system does not only ask:

> “Is this content harmful?”

It also asks:

> “What intervention should be shown to the user before publication?”

---

## Problem

Traditional social media moderation often operates after harmful content has already been published and exposed to other users.

This creates several limitations:

- harmful content may already have reached users before removal;
- binary moderation can ignore differences in severity;
- users often receive little explanation about why content was flagged;
- deletion alone does not help users reformulate what they intended to say;
- context-dependent harmful language may be difficult to identify using keyword rules or statistical models alone.

NSosyal addresses this problem through **preventive, tier-based moderation**.

---

## Solution

NSosyal evaluates a comment before publication and assigns an appropriate moderation intervention.

The prototype combines:

- Turkish-language machine-learning classification;
- TF-IDF text representation;
- Logistic Regression;
- contextual AI analysis;
- rule-based explicit-expression detection;
- confidence-aware moderation logic;
- constructive rewrite generation;
- tier-specific UI/UX interventions;
- behavioral interaction logging;
- SQLite-based persistence.

The objective is not simply to classify harmful content, but to influence the publication decision at the moment when intervention can still prevent harm.

---

## Moderation Tiers

NSosyal uses four user-facing intervention levels.

| Tier | Meaning | User Experience |
|---|---|---|
| **Tier 0** | Safe / normal content | Comment proceeds without moderation friction |
| **Tier 1** | Offensive or potentially harmful language | A softer alternative is suggested while user agency is preserved |
| **Tier 2** | Higher-risk harmful content | Explicit confirmation is introduced before publication and a safer rewrite is offered |
| **Tier 3** | Explicit prohibited expression | Original publication is blocked and an alternative formulation may be suggested |

This structure allows moderation friction to increase according to the detected level of risk.

---

## Hybrid Moderation Architecture

NSosyal does not depend on a single moderation mechanism.

The current prototype combines three complementary layers:

### 1. Rule-Based Detection

Explicit prohibited expressions are detected through a normalized keyword-matching layer.

The normalization process also considers common attempts to bypass moderation, including character substitutions and simple obfuscation.

Content triggering this layer is assigned to **Tier 3**.

### 2. Machine-Learning Classification

Content not handled directly by the explicit-expression layer is evaluated by a Turkish-language ML classifier using:

- **TF-IDF**
- **Logistic Regression**

The ML component produces:

- predicted class;
- class probabilities;
- confidence score.

The ML taxonomy contains:

- **0 — Safe / None**
- **1 — Offensive**
- **2 — Hate / Group-targeted harmful content**

### 3. Contextual AI Layer

A contextual AI layer complements the classical classifier in cases where lexical or statistical patterns alone may not capture the meaning, target, or intent of a statement.

This is particularly useful for:

- implicit hostility;
- personal attacks;
- contextual insults;
- group-directed harmful statements;
- ambiguous language.

The final moderation decision is therefore produced through a **hybrid decision architecture** rather than relying exclusively on one model.

---

## System Flow

```text
User Comment
     │
     ▼
Frontend
HTML + CSS + JavaScript
     │
     ▼
Node.js / Express Backend
     │
     ├────► Rule-Based Explicit Expression Check
     │
     ├────► Python ML API
     │         │
     │         └── TF-IDF + Logistic Regression
     │
     └────► Contextual AI Layer
               │
               ▼
        Final Moderation Tier
               │
               ▼
      Tier-Specific Intervention
               │
        ┌──────┼────────┐
        ▼      ▼        ▼
     Rewrite  Original  Abandon/Edit
        │
        ▼
SQLite Behavioral Logging
```

---

## Technology Stack

### Machine Learning

- Python
- scikit-learn
- TF-IDF
- Logistic Regression
- Flask
- Flask-CORS

### Backend

- Node.js
- Express.js
- REST API communication
- better-sqlite3

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### AI / Contextual Moderation

- External contextual AI API
- Structured JSON moderation responses
- Constructive rewrite generation

### Database

- SQLite

### Version Control

- Git
- GitHub

---

## Frontend Architecture

The frontend follows a separation-of-concerns structure.

```text
frontend/
├── index.html
├── style.css
└── app.js
```

- `index.html` defines the interface structure.
- `style.css` manages presentation, responsive styling, tier colors, intervention panels, and visual hierarchy.
- `app.js` handles user interaction, moderation requests, participant sessions, tier-based actions, behavioral logging, and feed updates.

This structure keeps interface structure, presentation, and interaction logic independently maintainable.

---

## Repository Structure

```text
NSosyal/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── ml_api.py
│   └── nsosyal.db
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── model/
│   ├── toxicity_model.pkl
│   └── tfidf_vectorizer.pkl
│
├── data/
│   └── processed dataset resources
│
├── .env.example
├── .gitignore
├── package.json
├── requirements.txt
└── README.md
```

> Note: The exact contents of ignored local/runtime files may differ between development environments.

---

## Dataset and Model Development

The machine-learning dataset was constructed from multiple Turkish offensive-language and moderation resources, including processed combinations of:

- imayda-1;
- imayda-2;
- OffensEval-related Turkish data.

The combined development dataset contained approximately **52,000 labeled samples**.

The preparation pipeline included:

```text
Raw Datasets
     ↓
Dataset Consolidation
     ↓
Label Harmonization
     ↓
Text Cleaning
     ↓
Train / Test Preparation
     ↓
TF-IDF Vectorization
     ↓
Logistic Regression
     ↓
Model Evaluation
```

The model was evaluated using classification metrics including:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix

The selected model achieved approximately **82% overall accuracy** during internal evaluation.

---

## Why Hybrid Moderation?

Prototype testing demonstrated that statistical confidence alone does not always guarantee correct contextual interpretation.

For example, some context-dependent or group-directed harmful statements may appear lexically safe to a lightweight classifier while still carrying harmful meaning.

For this reason, NSosyal treats classical ML as an important moderation signal while complementing it with contextual analysis.

This architecture aims to combine:

**ML speed + deterministic safety checks + contextual understanding**

---

## User-Centered Intervention Design

NSosyal is designed around **progressive intervention**.

Instead of presenting every user with the same warning, the interface increases moderation friction according to the assigned tier.

The intervention experience may provide:

- a risk indication;
- a short explanation;
- a safer rewrite;
- the option to use the rewrite;
- the option to edit;
- the option to abandon publication;
- where permitted, the option to continue with the original text.

This preserves user agency wherever possible while introducing additional reflection before potentially harmful content becomes public.

---

## Behavioral Prototype Evaluation

NSosyal was also evaluated at the interaction level.

After removing development/debug and incomplete records, **35 valid prototype interactions** were analyzed.

Of these:

- **28 interactions triggered a moderation intervention**
- **9** resulted in acceptance of a safer rewrite
- **9** resulted in publication abandonment
- **10** resulted in publication of the original formulation

Therefore:

```text
Behavioral Intervention Result
= (Rewrite Accepted + Publication Abandoned)
  / Intervention-Triggering Interactions

= (9 + 9) / 28

= 64.3%
```

In **64.3% of intervention-triggering interactions**, the original harmful formulation was not published.

These findings represent **exploratory prototype-level behavioral evidence** and should not be interpreted as population-level conclusions.

Future evaluation will include larger and more diverse participant groups.

---

## Behavioral Logging

Moderation events are stored in SQLite.

Recorded information can include:

- original text;
- suggested rewrite;
- ML prediction;
- ML confidence;
- final moderation tier;
- decision source;
- user action;
- published text;
- timestamp;
- anonymous participant identifier.

Example behavioral outcomes include:

```text
rewrite_used
original_posted
direct_posted
edit_selected
abandoned
```

This allows NSosyal to evaluate not only what the moderation system predicts, but also **how users respond to the intervention**.

---

## Running the Project

### 1. Clone the Repository

```bash
git clone https://github.com/JustEyml/NSosyal.git
cd NSosyal
```

---

### 2. Install Node.js Dependencies

```bash
npm install
```

---

### 3. Install Python Dependencies

Create a virtual environment if preferred:

```bash
python -m venv venv
```

Windows:

```bash
.\venv\Scripts\activate
```

macOS / Linux:

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create your local `.env` file using `.env.example` as reference.

```text
.env.example → .env
```

API credentials must remain in the local `.env` file and **must not be committed to GitHub**.

---

### 5. Start the ML API

From the repository root:

```bash
python backend/ml_api.py
```

The ML API should start locally on:

```text
http://localhost:5000
```

A health endpoint is available at:

```text
GET /health
```

---

### 6. Start the Node.js Backend

Open another terminal and run:

```bash
node backend/server.js
```

The application server should start on:

```text
http://localhost:3000
```

---

### 7. Open the Prototype

Open the frontend through the project server according to the configured Express static-file setup.

The browser interface communicates with the Node.js backend, which coordinates the ML API, contextual moderation layer, database, and final moderation response.

---

## API Communication

The frontend sends moderation requests to:

```text
POST /api/moderate
```

The Node.js backend communicates with the Python ML service:

```text
POST http://localhost:5000/predict
```

User decisions following an intervention are recorded through the backend action endpoint.

This separation allows the ML service, backend application, frontend, and persistent storage layers to operate as independent components.

---

## Responsible AI Considerations

NSosyal is designed as an assistive and preventive moderation system rather than an unquestionable automated authority.

Important limitations remain:

- ML predictions may contain false positives or false negatives.
- Contextual AI output may vary.
- Language evolves over time.
- Harmful expressions may be implicit or culturally dependent.
- Rule-based lists require maintenance.
- User behavior may change after repeated exposure to interventions.
- Prototype-scale behavioral results require larger-scale validation.

For these reasons, the system uses multiple signals and is designed for continuous evaluation and improvement.

---

## Future Development

Planned development areas include:

- larger and more diverse Turkish moderation datasets;
- improved hate-speech detection;
- expanded contextual evaluation;
- multilingual moderation;
- larger-scale usability testing;
- accessibility evaluation;
- false-positive analysis;
- intervention-fatigue measurement;
- model monitoring;
- scalable database infrastructure;
- production deployment;
- integration with larger social-media environments.

---

## Project Status

**Current Stage:** Working Prototype

The current system demonstrates:

- functioning ML inference;
- hybrid moderation logic;
- rule-based explicit-expression detection;
- Node.js/Python service integration;
- tier-specific interventions;
- constructive rewrite generation;
- behavioral event logging;
- SQLite persistence;
- modular frontend architecture;
- prototype behavioral evaluation.

---

## Repository

**GitHub:** https://github.com/JustEyml/NSosyal

---

## Dataset / External Resource Attribution

The project uses or derives data/resources from Turkish-language moderation datasets and publicly available research resources.

The explicit-expression detection component also incorporates a modified Turkish prohibited-expression list based on the publicly available `ooguz/turkce-kufur-karaliste` resource under its applicable license terms.

Dataset and external-resource licenses should be respected when redistributing derived resources.

---

## NSosyal

**From reactive content removal to preventive, context-aware intervention.**