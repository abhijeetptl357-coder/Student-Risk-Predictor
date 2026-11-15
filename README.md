# 🎓 Student Risk Predictor

**An academic early-warning dashboard that predicts whether a student is likely to need academic support, explains why, and suggests what to do about it.**

### 🌐 Live Demo: **https://student-risk-predictor-hirt.onrender.com/**

> No installation needed. Just open the link above and start using the app.
> The app is hosted on Render's free tier, so if nobody has used it recently the **first load can take up to about a minute** while the server wakes up. After that it responds instantly.

---

## 📌 The Project in 60 Seconds

| | |
|---|---|
| **Problem** | Schools usually discover that a student is struggling *after* a failed exam. By then it is late to help. |
| **Idea** | Use habits and background factors that are known *early* (attendance, study hours, sleep, parental support, peer environment, etc.) to flag at-risk students *before* exam results arrive. |
| **Solution** | A machine-learning model (Logistic Regression) wrapped in a FastAPI service and a single-page dashboard. An advisor enters a student's 18 indicators and instantly gets a **risk percentage**, a **risk tier**, the **factors helping or hurting** the student, and a **tailored action plan**. |
| **Definition of "at risk"** | A student is labelled **"Needs Support"** if their final exam score is **below 65 / 100**. |
| **Model result** | On a held-out test set of 1,322 students: **98.6 % accuracy, 99.3 % recall, 94.4 % precision, ROC-AUC 0.998.** |
| **Tech stack** | Python · scikit-learn · FastAPI · Pandas · HTML / CSS / vanilla JavaScript · Render |

---

## 🧭 Table of Contents

1. [The Problem and Our Approach](#-the-problem-and-our-approach)
2. [How the App Works (End to End)](#-how-the-app-works-end-to-end)
3. [Using the Live App](#-using-the-live-app)
4. [Features](#-features)
5. [The 18 Input Features](#-the-18-input-features)
6. [The Machine-Learning Model](#-the-machine-learning-model)
7. [API Reference](#-api-reference)
8. [How the Dashboard Generates Insights](#-how-the-dashboard-generates-insights)
9. [Tech Stack and Architecture](#-tech-stack-and-architecture)
10. [Project Structure](#-project-structure)
11. [Running Locally (Optional)](#-running-locally-optional)
12. [Deployment](#-deployment)
13. [Limitations and Responsible Use](#-limitations-and-responsible-use)
14. [Future Improvements](#-future-improvements)
15. [Team](#-team) · [License](#-license)

---

## 🎯 The Problem and Our Approach

Most academic support systems are **reactive**: help arrives after a student has already failed a test or dropped a course. Yet the warning signs (poor attendance, low study time, little parental involvement, negative peer influence, no access to resources) are visible weeks earlier.

The **Student Risk Predictor** moves that timeline earlier:

1. **Collect** 18 behavioural, academic and socioeconomic indicators about a student.
2. **Predict** the probability that the student will score below 65 on the exam.
3. **Explain** which factors protect the student and which ones put them at risk.
4. **Act**: generate concrete, practical next steps for an advisor, teacher or counsellor.

It is intended as a **decision-support tool for educators**, not an automatic decision maker (see [Limitations and Responsible Use](#-limitations-and-responsible-use)).

---

## 🔄 How the App Works (End to End)

```
 ┌───────────────────────┐    JSON (18 fields)    ┌──────────────────────────────┐
 │  Dashboard (browser)  │ ─────────────────────► │  FastAPI  POST /api/predict  │
 │  sliders, dropdowns,  │                        │  1. validate input (Pydantic)│
 │  toggles              │                        │  2. build a 1-row DataFrame  │
 │                       │ ◄───────────────────── │  3. run saved sklearn        │
 │  gauge, tier, factors,│  probability + tier    │     pipeline (preprocess +   │
 │  action plan          │                        │     Logistic Regression)     │
 └───────────────────────┘                        └──────────────────────────────┘
```

1. The user changes any control on the dashboard.
2. After a short 220 ms debounce, the browser sends all 18 values to `POST /api/predict`.
3. The backend validates every value (allowed ranges and categories), feeds it to the saved model pipeline, and returns the **probability of needing support**, a **yes/no prediction**, and a **risk tier**.
4. The browser animates the gauge, colours the risk tier, and generates the strengths, risk drivers and action plan from the student's inputs.

Because the whole preprocessing step (imputation, scaling, encoding) is **inside the saved pipeline**, the API accepts raw human-readable values such as `"Medium"` or `"Yes"`. No manual encoding is needed.

---

## 🖥️ Using the Live App

Open **https://student-risk-predictor-hirt.onrender.com/**

1. **Pick a starting point (optional).** Use one of the sample student cards at the top:
   * **Alex Miller**: a high-risk profile
   * **Jordan Taylor**: a borderline profile
   * **Maya Kapoor**: a strong, low-risk profile
   * **Baseline Default**: resets everything to an average student
2. **Adjust the student's indicators**, grouped into four panels:
   * **Academic Habits & Past Achievement**: weekly study hours, attendance %, previous exam score, tutoring sessions
   * **Lifestyle, Recovery & Health**: daily sleep, weekly physical activity, extracurricular activities, learning disability
   * **Family & Socioeconomic Support**: parental involvement, parental education, family income, distance from home
   * **Campus Climate & Psychological Context**: peer influence, motivation, teacher quality, access to resources, internet access, school type
3. **Read the result panel** (updates live while the *live prediction* toggle is on):

   | Risk score | Tier | Meaning |
   |---|---|---|
   | **Below 40 %** | 🟢 Low Risk, On Track | Strong indicators of academic stability |
   | **40 % to 70 %** | 🟡 Moderate / Borderline | Needs periodic check-ins and targeted support |
   | **70 % and above** | 🔴 Critical Risk | Needs immediate counselling and intervention |

4. **Review the explanation:** the four benchmark bars (attendance, study time, previous score, sleep), the *protective factors* vs *risk drivers*, and the *recommended actions*.
5. **Try a what-if.** Click **Auto-Optimize to Low Risk** to see how better habits change the score, or click **Copy Diagnostic Brief** to copy a plain-text summary into your advising notes.
6. Use the 🌓 button to switch between light and dark mode (your choice is remembered in the browser).

---

## ✨ Features

* **⚡ Real-time risk diagnostics.** Moving any control recalculates the risk without a page reload.
* **🎛️ Interactive controls.** Sliders with colour-coded status tags (for example attendance is tagged *Critical / Normal / Optimal*).
* **📊 Risk gauge and spectrum bar.** An animated radial gauge and a Safe / Borderline / Critical spectrum.
* **👥 One-click sample students.** Test the three archetypes instantly.
* **🛡️ Factor breakdown.** Protective factors and risk drivers side by side.
* **📋 Tailored intervention plan.** Up to four action items matched to the student's weak points (attendance check-ins, guided study blocks, peer tutoring, parent briefings, internet access support, learning-accommodation review and more).
* **💡 Auto-optimise simulator.** Applies a set of healthier habits and shows the new score.
* **📝 Diagnostic brief export.** Copies a formatted text summary to the clipboard.
* **🌓 Light / dark theme** with persistence.
* **🩺 Health endpoint and interactive API docs** for developers (`/api/health`, `/docs`).

---

## 🧾 The 18 Input Features

The model uses **18 features**. The dataset has 20 columns; `Exam_Score` is removed because it is the source of the target (leakage) and `Gender` is deliberately excluded as a protected attribute.

**Numeric (6)**

| Feature | Allowed range | Description |
|---|---|---|
| `Hours_Studied` | 1 – 44 | Study hours per week |
| `Attendance` | 60 – 100 | Class attendance (%) |
| `Sleep_Hours` | 4 – 10 | Average sleep per night |
| `Previous_Scores` | 50 – 100 | Score in previous exams |
| `Tutoring_Sessions` | 0 – 8 | Tutoring sessions per week |
| `Physical_Activity` | 0 – 6 | Physical activity hours per week |

**Ordinal categories (7)**: encoded in their natural order

| Feature | Values (low → high) |
|---|---|
| `Parental_Involvement` | Low, Medium, High |
| `Access_to_Resources` | Low, Medium, High |
| `Motivation_Level` | Low, Medium, High |
| `Family_Income` | Low, Medium, High |
| `Teacher_Quality` | Low, Medium, High |
| `Parental_Education_Level` | High School, College, Postgraduate |
| `Distance_from_Home` | Near, Moderate, Far |

**Nominal categories (5)**: one-hot encoded

| Feature | Values |
|---|---|
| `Extracurricular_Activities` | Yes, No |
| `Internet_Access` | Yes, No |
| `School_Type` | Public, Private |
| `Peer_Influence` | Positive, Neutral, Negative |
| `Learning_Disabilities` | Yes, No |

---

## 🧠 The Machine-Learning Model

The full workflow is documented step by step in [`notebook.ipynb`](notebook.ipynb).

### Data
* **Source file:** `StudentPerformanceFactors.csv`, 6,607 student records and 20 columns.
* **Data quality:** no duplicate rows. Missing values only in `Teacher_Quality` (78), `Parental_Education_Level` (90) and `Distance_from_Home` (67), filled during preprocessing. One impossible `Exam_Score` of 101 was capped at 100.
* **Target:** `Needs_Support = 1` if `Exam_Score < 65`, else `0`.
* **Class balance:** about **78 % OK vs 22 % Needs Support**. The data is imbalanced, so recall and F1 were tracked instead of accuracy alone.

### Pipeline
A single scikit-learn `Pipeline` is trained, saved as `student_risk_logreg_model.joblib`, and loaded by the API:

1. **Numeric columns:** median imputation → standard scaling
2. **Ordinal columns:** most-frequent imputation → ordinal encoding (Low < Medium < High, etc.)
3. **Nominal columns:** most-frequent imputation → one-hot encoding
4. **Classifier:** Logistic Regression with `class_weight="balanced"`

### Training and tuning
* **Split:** 80 / 20 stratified train / test (5,285 train, 1,322 test) with `random_state=42`
* **Baseline comparison:** a depth-4 Decision Tree reached only **82.1 %** accuracy versus **97.9 %** for untuned Logistic Regression, so Logistic Regression was chosen.
* **Tuning:** 5-fold stratified cross-validation with grid search over `C`, penalty (L1 / L2) and solver (liblinear / saga), optimised for **F1**.
* **Best settings:** `C = 100`, `penalty = "l1"`, `solver = "liblinear"` (best CV F1 = **0.9545**)

### Test-set results (1,322 unseen students)

| Metric | Score |
|---|---|
| Accuracy | **98.6 %** |
| Precision (Needs Support) | **94.4 %** |
| Recall (Needs Support) | **99.3 %** |
| F1 | **96.8 %** |
| ROC-AUC | **0.998** |

**Confusion matrix**

|  | Predicted OK | Predicted Needs Support |
|---|---|---|
| **Actually OK** | 1,014 | 17 |
| **Actually Needs Support** | 2 | 289 |

Only **2 of 291** students who truly needed support were missed. This matters most for an early-warning tool, since a missed student is worse than a false alarm.

### Why Logistic Regression?
* **High recall:** it catches almost every student who needs help.
* **Fits the data:** attendance and study hours relate to performance in a roughly linear way, which a linear model captures well.
* **Probabilistic output:** it gives a risk percentage that can be ranked and thresholded, not just a yes/no.
* **Interpretable:** coefficients show the direction and size of each factor's effect.
* **Fast and light:** easy to deploy on a free server.

### What drives the prediction
Reading the trained model's coefficients (all numeric features standardised):

* **Strongest protective factors (lower risk):** higher **attendance**, more **weekly study hours**, high **parental involvement**, good **access to resources**, having **internet access**, higher previous scores, and tutoring sessions.
* **Strongest risk drivers (higher risk):** **negative peer influence**, the presence of a **learning disability**, and a **long distance from home**.
* **Little to no effect:** sleep hours and school type (physical activity has only a small effect).

---

## 🔌 API Reference

The same server hosts the dashboard and the API. Interactive Swagger docs are available at **`/docs`** on the live site.

### `GET /api/health`
Checks that the server is up and the model loaded.
```json
{ "status": "ok", "model_loaded": true }
```

### `POST /api/predict`
Returns the risk for one student. All 18 fields are required; invalid values are rejected with HTTP 422.

**Example request**
```bash
curl -X POST https://student-risk-predictor-hirt.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Hours_Studied": 20,
    "Attendance": 80,
    "Sleep_Hours": 7,
    "Previous_Scores": 75,
    "Tutoring_Sessions": 1,
    "Physical_Activity": 3,
    "Parental_Involvement": "Medium",
    "Access_to_Resources": "Medium",
    "Motivation_Level": "Medium",
    "Family_Income": "Medium",
    "Teacher_Quality": "Medium",
    "Parental_Education_Level": "College",
    "Distance_from_Home": "Moderate",
    "Extracurricular_Activities": "Yes",
    "Internet_Access": "Yes",
    "School_Type": "Public",
    "Peer_Influence": "Neutral",
    "Learning_Disabilities": "No"
  }'
```

**Response**
```json
{
  "prediction": 0,
  "probability": 0.0,
  "label": "OK",
  "risk_level": "Low Risk"
}
```

| Field | Meaning |
|---|---|
| `prediction` | `1` = needs support, `0` = OK |
| `probability` | Model's probability (0 – 1) that the student needs support |
| `label` | `"Needs Support"` or `"OK"` |
| `risk_level` | `"Low Risk"` (< 0.4), `"Medium Risk"` (0.4 – 0.7) or `"High Risk"` (≥ 0.7) |

**Errors:** `422` for invalid or missing fields · `503` if the model file could not be loaded · `500` for an unexpected prediction failure.

---

## 💡 How the Dashboard Generates Insights

It is important to know which parts come from the **ML model** and which come from **simple rules** in the browser:

| Output | Source |
|---|---|
| Risk percentage, gauge, risk tier | **ML model** (`/api/predict`) |
| Protective factors, risk drivers, action plan | **Rule-based logic** in `frontend/js/app.js`, applied to the entered values |
| Auto-Optimize simulation | Sets attendance 92 %, study 28 hrs, tutoring 2, sleep 8 hrs, motivation High and peer influence Positive, then **re-runs the model** |

Examples of the rules: attendance ≥ 88 % is a strength and below 75 % is a risk; fewer than 14 study hours triggers a guided-study-block recommendation; negative peer influence triggers a peer-team recommendation; no internet access triggers a hotspot / device-loan suggestion; a learning disability triggers a check on accommodation plans.

---

## 🏗️ Tech Stack and Architecture

| Layer | Technology |
|---|---|
| Machine learning | scikit-learn (Pipeline, ColumnTransformer, LogisticRegression), Pandas, NumPy, joblib |
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| Frontend | HTML5, CSS3 (theme variables, responsive layout), vanilla JavaScript (no framework, canvas confetti) |
| Hosting | Render (free web service) |

**Design choice:** one deployable service. FastAPI serves both the API (`/api/*`) and the static frontend (`/`, `/css`, `/js`), so the browser calls the API on the same origin and no separate frontend hosting is needed.

---

## 📁 Project Structure

```text
Student-Risk-Predictor/
├── README.md                          # Project documentation (this file)
├── LICENSE                            # MIT License
├── render.yaml                        # Render deployment configuration
├── requirements.txt                   # Python dependencies (used by Render and local setup)
├── .gitignore
├── StudentPerformanceFactors.csv      # Dataset (6,607 records)
├── student_risk_logreg_model.joblib   # Trained scikit-learn pipeline
├── notebook.ipynb                     # EDA, model training, tuning and evaluation
│
├── backend/
│   ├── app.py                         # FastAPI app, input validation, /api routes, static serving
│   ├── main.py                        # Entry point alias (backend.main:app)
│   └── requirements.txt               # Backend packages
│
└── frontend/
    ├── index.html                     # Dashboard layout
    ├── css/style.css                  # Styling, light / dark themes
    └── js/app.js                      # Live scoring, presets, insights, simulator, export
```

---

## 🚀 Running Locally (Optional)

You only need this if you want to modify the code. To simply *use* the project, open the [live demo](https://student-risk-predictor-hirt.onrender.com/).

**Requirements:** Python 3.11 (the version used on Render) and `pip`.

```bash
# 1. Clone
git clone https://github.com/abhijeetptl357-coder/Student-Risk-Predictor.git
cd Student-Risk-Predictor

# 2. Create a virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Start the server
uvicorn backend.main:app --reload --port 8000
```

Open **http://127.0.0.1:8000** for the dashboard, or **http://127.0.0.1:8000/docs** for the API docs.

**To retrain the model:** open `notebook.ipynb`, keep `StudentPerformanceFactors.csv` in the same folder, and run all cells. The last cell overwrites `student_risk_logreg_model.joblib`.

> ⚠️ **scikit-learn version matters.** The `.joblib` model was saved with scikit-learn **1.6.x or earlier**, which is why `requirements.txt` pins `scikit-learn<=1.6.1`. With a newer version the model may fail to load (the dashboard will show a connection alert and `/api/health` will report `"model_loaded": false`). Either keep the pinned version or retrain and re-save the model with your version.

---

## ☁️ Deployment

The project is deployed on **Render** using [`render.yaml`](render.yaml):

* **Build:** `pip install --upgrade pip && pip install -r requirements.txt`
* **Start:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
* **Runtime:** Python 3.11.8, free plan

Pushing to the connected GitHub branch redeploys the app. On the free plan the service sleeps after a period of inactivity, which causes the slow first load mentioned at the top.

---

## ⚠️ Limitations and Responsible Use

Please read these before relying on any output:

* **It is a decision-support aid, not a verdict.** Predictions should start a conversation with a student, never replace an educator's judgement or be used for punitive or admission decisions.
* **Very high scores come from the dataset.** The 98.6 % accuracy reflects a clean, fairly regular dataset where exam score follows attendance and study hours closely. Real school data is noisier, so performance on real students would likely be lower and the model should be re-validated and retrained on local data before real use.
* **The risk percentages are sharp.** Because of the weak regularisation (`C = 100`) and `class_weight="balanced"`, probabilities tend to sit near 0 % or 100 %. Treat them as a ranking and a strong signal, not as a calibrated real-world chance.
* **"At risk" is defined by one cut-off** (exam score below 65). A different definition of success would give a different model.
* **Correlation is not causation.** A factor linked to lower scores in the data is not necessarily the *cause* of them.
* **Sensitive factors.** Family income, parental education, learning disabilities and distance from home are included because they help prediction, but they describe a student's circumstances, not their ability. Use them to direct *support*, never to label or limit a student. `Gender` was intentionally left out of the model.
* **Rule-based advice.** The action plan comes from fixed rules, not from the model, and should be adapted by a professional.
* **Privacy.** The live demo is for experimentation; do not enter real, identifiable student data into it. Inputs are sent to the server only to compute the prediction and the app does not store them.

---

## 🔭 Future Improvements

* Add a feature-contribution view (for example SHAP or per-feature coefficients) so each prediction shows exactly which inputs moved the score
* Calibrate the probabilities (for example with Platt scaling or isotonic regression)
* Upload a CSV to score a whole class and export a ranked list
* Compare against other models (Random Forest, Gradient Boosting) on noisier data
* Add automated tests for the API and a CI check for model loading
* Multi-language support

---

## 👥 Team

* **Abhijeet Patil**
* **Sneha Patel**
* **Adyasha Khuntia**
* **Prasad Dahore**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
