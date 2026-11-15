# 🎓 Student Risk Predictor — Academic Early-Warning & Intervention Platform

An end-to-end Machine Learning web application designed to detect student academic vulnerabilities early and generate actionable, personalized intervention strategies. Built with an asynchronous **FastAPI** backend and an interactive, modern **frontend dashboard** (HTML5 / CSS3 / Vanilla JS).

---

## 👥 Project Team

1. **Abhijeet Patil**
2. **Sneha Patel**
3. **Adyasha Khuntia**
4. **Prasad Dahore**

---

## 🎯 Project Overview

Traditional academic assessments identify student struggles *after* exams are failed or courses are repeated. 

The **Student Risk Predictor** serves as a **predictive early-warning system**:
* Evaluates **17 academic, lifestyle, socioeconomic, and campus environment indicators** (such as attendance, study hours, sleep habits, peer circle influence, and tutoring).
* Uses an $L_1$-regularized **Logistic Regression Pipeline** trained on 6,607 student records.
* Delivers an **instant probability of academic risk**, highlights key protective vs. risk factors, and provides tailored intervention recommendations for educators and counselors.

---

## ✨ Key Features

* **⚡ Real-Time Live Diagnostics**: Moving any slider or clicking a toggle recalculates the student's risk probability in real time.
* **🎛️ Interactive Sliders with Color-Coded Fills**: Real-time visual progress bars showing current study hours, attendance rates, sleep duration, and exam history.
* **📊 Rectangular Risk HUD & Spectrum Bar**: Clear risk percentage display with an animated spectrum bar ($0\text{–}40\%$ Safe, $40\text{–}70\%$ Borderline, $70\%+$ Critical).
* **👥 Preset Student Archetypes**: Single-click buttons to load standardized student profiles (High Risk, Borderline, Honor Roll, or Reset).
* **🛡️ Protective Factors vs. Risk Drivers**: Breaks down exactly which indicators are shielding the student and which are increasing risk.
* **📋 Actionable Intervention Plan**: Generates targeted recommendations (e.g. structured daily study blocks, mandatory attendance tracking, peer tutoring).
* **💡 "What-If" Auto-Optimization**: Demonstrates with one click how an at-risk profile can be adjusted into the safe zone.
* **📋 Copy Diagnostic Brief**: Easily export and copy a structured report for counselor records.
* **🌓 Light / Dark Theme Support**: High-contrast, clean UI with session-persisted theme switching.

---

## 📖 How to Use the Website

1. **Load a Preset Profile or Enter Custom Data**:
   * Click on any archetype benchmark card (**Alex Miller** for High Risk, **Jordan Taylor** for Borderline, or **Maya Kapoor** for Safe) to instantly populate realistic sample data.
   * Or adjust the individual controls manually on the left panel.

2. **Adjust Academic & Behavioral Indicators**:
   * **Academic Habits**: Set *Weekly Study Hours*, *Classroom Attendance (%)*, *Prior Exam Scores*, and *Tutoring Sessions*.
   * **Lifestyle & Health**: Set *Daily Sleep Duration*, *Physical Exercise*, and *Extracurricular Participation*.
   * **Family & Environment**: Select *Parental Involvement*, *Family Income Tier*, *Parent Education*, and *Distance from Campus*.
   * **Campus & Psychological Factors**: Choose *Peer Circle Influence*, *Student Motivation*, *Instruction Quality*, and *Resource Access*.

3. **Read the Live Diagnostic Report (Right Column)**:
   * **Risk Score & Verdict**: Check the probability percentage and risk classification:
     * 🟢 **Low Risk / On Track** ($< 40\%$) — High likelihood of academic success.
     * 🟡 **Moderate / Borderline** ($40\% - 70\%$) — Needs proactive monitoring.
     * 🔴 **Critical Risk** ($\ge 70\%$) — Requires immediate intervention.
   * **Core Benchmarks**: View comparative meters for attendance, study hours, previous scores, and sleep against optimal targets.
   * **Strengths & Vulnerabilities**: Review protective factors helping the student vs. risk contributors requiring attention.
   * **Prescribed Interventions**: Follow the generated step-by-step action plan tailored to the student's needs.

4. **Simulate Improvements & Export**:
   * Click **💡 Auto-Optimize to Low Risk** to see what changes are needed to transition an at-risk student into the safe zone.
   * Click **📋 Copy Diagnostic Brief** to copy a formatted summary directly to your clipboard for advising notes.

---

## 🚀 How to Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/abhijeetptl357-coder/Student-Risk-Predictor.git
cd "Student-Risk-Predictor"
```

### 2. Set Up Virtual Environment & Install Dependencies
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate      # On Windows use: venv\Scripts\activate

# Install required packages
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Start the Application Server
```bash
uvicorn backend.main:app --reload --port 8000
```

### 4. Open in Your Browser
Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in any modern web browser.

---

## 📁 Project Structure

```text
Student-Risk-Predictor/
├── requirements.txt                    # Root Python dependencies
├── README.md                           # Project documentation
├── StudentPerformanceFactors.csv       # Training & validation dataset (6,607 records)
├── student_risk_logreg_model.joblib    # Serialized scikit-learn ML pipeline
├── notebook.ipynb                      # Exploratory Data Analysis & model training
│
├── backend/
│   ├── app.py                          # FastAPI application & ML prediction routes
│   ├── main.py                         # Server entrypoint
│   └── requirements.txt                # Backend dependencies
│
└── frontend/
    ├── index.html                      # Semantic UI dashboard
    ├── css/
    │   └── style.css                   # Modern design system & responsive styling
    └── js/
        └── app.js                      # Live prediction logic, sliders & preset engine
```

---

## 🧠 Machine Learning Model Summary

* **Model Type:** Scikit-Learn Pipeline combining `ColumnTransformer` preprocessing with an $L_1$-penalized `LogisticRegression` classifier (`liblinear` solver).
* **Dataset:** 6,607 student records with 17 academic and environmental features.
* **Top Protective Indicators:** High Attendance, Study Hours, Parental Involvement, Resource Access.
* **Top Risk Indicators:** Negative Peer Influence, Learning Disabilities without accommodation, Commute Distance.

---

## 📄 License
This project is open-source and distributed under the **MIT License**.
