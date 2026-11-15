# 🎓 Student Risk Predictor

An academic early-warning and intervention platform built to identify student vulnerabilities before they result in failing grades or course withdrawals. Powered by a FastAPI backend and a responsive frontend dashboard, the application translates 17 behavioral, academic, and socioeconomic indicators into immediate risk assessments and practical advising recommendations.

---

## 🎯 Overview

Most academic support systems react only after a student falls behind on exams. The **Student Risk Predictor** shifts that timeline earlier by evaluating patterns across attendance, weekly study habits, sleep consistency, peer environment, and campus resource access. 

Using an L1-regularized Logistic Regression pipeline trained on 6,607 student records, the platform estimates the probability of academic risk in real time and outlines concrete steps educators and counselors can take to help.

---

## ✨ Key Features

* **⚡ Real-Time Risk Diagnostics:** Adjusting any slider, dropdown, or toggle immediately recalculates the student's risk probability without requiring a page reload.
* **🎛️ Interactive Metric Controls:** Visual progress sliders track study hours, classroom attendance, sleep duration, and prior exam performance against benchmark targets.
* **📊 Risk Spectrum & Classification:** Displays an exact risk percentage alongside an animated status bar categorized into Safe (0–40%), Borderline (40–70%), and Critical (70%+) zones.
* **👥 Sample Student Profiles:** One-click presets let you test standardized profiles (High Risk, Borderline, and Honor Roll) or reset inputs to baseline values.
* **🛡️ Factor Breakdown:** Separates positive protective factors from negative risk drivers so advisors can see exactly what is influencing the score.
* **📋 Tailored Intervention Plans:** Generates practical action items based on the student's specific weak points, such as structured study blocks, attendance check-ins, or peer tutoring.
* **💡 Auto-Optimization Simulation:** Shows with a single click which habit adjustments would bring an at-risk profile back into the safe zone.
* **📋 Diagnostic Brief Export:** Formats the current assessment and recommendations so you can copy them directly into advising notes.
* **🌓 Theme Toggle:** Supports both light and dark modes with session persistence.

---

## 📖 How to Use

1. **Choose a Starting Point:** Select one of the preset student cards (**Alex Miller** for High Risk, **Jordan Taylor** for Borderline, or **Maya Kapoor** for Safe) to populate sample metrics, or enter custom values manually on the left panel.
2. **Configure Student Indicators:**
   * **Academic Habits:** Adjust weekly study hours, class attendance percentage, previous exam scores, and tutoring sessions.
   * **Lifestyle & Health:** Set daily sleep duration, physical activity frequency, and extracurricular involvement.
   * **Family & Environment:** Specify parental involvement, family income tier, parent education level, and commute distance.
   * **Campus & Support Factors:** Select peer circle influence, motivation level, teaching quality, and access to learning resources.
3. **Review the Diagnostic Report:**
   * **Risk Score:** Check the overall percentage and risk tier on the right panel:
     * 🟢 **Low Risk (< 40%):** Strong indicators of ongoing academic stability.
     * 🟡 **Moderate / Borderline (40% to 70%):** Warrants periodic check-ins and targeted support.
     * 🔴 **Critical Risk (≥ 70%):** Requires immediate academic counseling and intervention.
   * **Core Benchmarks:** Compare the student's attendance, study time, prior scores, and sleep against recommended baselines.
   * **Protective vs. Risk Drivers:** Review which habits are supporting the student and which areas need attention.
   * **Recommended Actions:** Follow the generated intervention steps tailored to the profile.
4. **Simulate & Export:** Click **Auto-Optimize to Low Risk** to test how behavioral changes improve the score, or click **Copy Diagnostic Brief** to save a text summary to your clipboard.

---

## 🚀 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/abhijeetptl357-coder/Student-Risk-Predictor.git
cd Student-Risk-Predictor
```

### 2. Set Up a Virtual Environment & Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate      # On Windows use: venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Start the Backend Server
```bash
uvicorn backend.main:app --reload --port 8000
```

### 4. Launch the Application
Open your browser and navigate to [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## 📁 Project Structure

```text
Student-Risk-Predictor/
├── requirements.txt                   # Python dependencies
├── README.md                          # Project documentation
├── StudentPerformanceFactors.csv      # Dataset used for training and validation (6,607 records)
├── student_risk_logreg_model.joblib   # Trained scikit-learn classification pipeline
├── notebook.ipynb                     # Exploratory data analysis and model training notebook
│
├── backend/
│   ├── app.py                         # FastAPI routes and prediction endpoints
│   ├── main.py                        # Application server entry point
│   └── requirements.txt               # Backend-specific packages
│
└── frontend/
    ├── index.html                     # Dashboard layout and structure
    ├── css/
    │   └── style.css                  # Responsive styling and theme variables
    └── js/
        └── app.js                     # Interactive controls, live scoring, and preset logic
```

---

## 🧠 Model Summary

* **Architecture:** Scikit-Learn Pipeline pairing a `ColumnTransformer` preprocessor with an L1-penalized `LogisticRegression` classifier (`liblinear` solver).
* **Training Data:** 6,607 student records spanning 17 academic, personal, and environmental features.
* **Primary Protective Factors:** Consistent class attendance, higher weekly study hours, active parental involvement, and reliable access to educational resources.
* **Primary Risk Drivers:** Negative peer influence, unaccommodated learning disabilities, and long daily commute distances.

---

## 👥 Project Team

* **Abhijeet Patil**
* **Sneha Patel**
* **Adyasha Khuntia**
* **Prasad Dahore**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
