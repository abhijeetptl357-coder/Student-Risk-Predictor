/* ========================================================
   Student Risk Predictor — Modern Interactive Application Logic
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ── DOM References ──
    const form = document.getElementById("predictionForm");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnSpinner = document.getElementById("btnSpinner");
    const liveToggle = document.getElementById("livePredictToggle");
    const themeToggle = document.getElementById("themeToggle");
    const systemStatus = document.getElementById("systemStatus");
    const statusLabel = document.getElementById("statusLabel");
    const errorCard = document.getElementById("errorCard");
    const errorText = document.getElementById("errorText");
    const toast = document.getElementById("toastNotification");
    const toastMsg = document.getElementById("toastMsg");
    const toastIcon = document.getElementById("toastIcon");

    // Gauge & Result Display
    const gaugeArc = document.getElementById("gaugeArc");
    const radialContainer = document.querySelector(".radial-gauge-container");
    const probaNumber = document.getElementById("probaNumber");
    const riskEmoji = document.getElementById("riskEmoji");
    const riskTierPill = document.getElementById("riskTierPill");
    const riskHeadline = document.getElementById("riskHeadline");
    const riskNarrative = document.getElementById("riskNarrative");
    const analyticsModeText = document.getElementById("analyticsModeText");

    // Breakdown Bars
    const barMetricAtt = document.getElementById("barMetricAtt");
    const barFillAtt = document.getElementById("barFillAtt");
    const barMetricStudy = document.getElementById("barMetricStudy");
    const barFillStudy = document.getElementById("barFillStudy");
    const barMetricScore = document.getElementById("barMetricScore");
    const barFillScore = document.getElementById("barFillScore");
    const barMetricSleep = document.getElementById("barMetricSleep");
    const barFillSleep = document.getElementById("barFillSleep");

    // Factors & Action Plan
    const strengthsList = document.getElementById("strengthsList");
    const risksList = document.getElementById("risksList");
    const actionPlanContainer = document.getElementById("actionPlanContainer");
    const actionCountBadge = document.getElementById("actionCountBadge");

    // Tools
    const btnSimulate = document.getElementById("btnSimulateIntervention");
    const btnExport = document.getElementById("btnExportReport");

    // Circumference for r=82 SVG Circle
    const CIRCUMFERENCE = 2 * Math.PI * 82; // ≈ 515.22
    gaugeArc.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    gaugeArc.style.strokeDashoffset = CIRCUMFERENCE;

    // Numerical Sliders definitions & metadata
    const SLIDERS = [
        {
            id: "Hours_Studied",
            min: 1,
            max: 44,
            unit: "hrs",
            getTag: (v) => (v < 12 ? ["Low", "danger"] : v < 25 ? ["Moderate", "warning"] : ["Intense", "safe"]),
        },
        {
            id: "Attendance",
            min: 60,
            max: 100,
            unit: "%",
            getTag: (v) => (v < 75 ? ["Critical", "danger"] : v < 85 ? ["Normal", "warning"] : ["Optimal", "safe"]),
        },
        {
            id: "Previous_Scores",
            min: 50,
            max: 100,
            unit: "",
            getTag: (v) => (v < 65 ? ["Struggling", "danger"] : v < 80 ? ["Proficient", "warning"] : ["High Mark", "safe"]),
        },
        {
            id: "Tutoring_Sessions",
            min: 0,
            max: 8,
            unit: "sess",
            getTag: (v) => (v === 0 ? ["None", "neutral"] : v <= 2 ? ["Standard", "safe"] : ["Intensive", "safe"]),
        },
        {
            id: "Sleep_Hours",
            min: 4,
            max: 10,
            unit: "hrs",
            getTag: (v) => (v < 6 ? ["Deprived", "danger"] : v <= 8 ? ["Healthy", "safe"] : ["Excessive", "warning"]),
        },
        {
            id: "Physical_Activity",
            min: 0,
            max: 6,
            unit: "hrs/wk",
            getTag: (v) => (v === 0 ? ["Sedentary", "danger"] : v <= 3 ? ["Active", "safe"] : ["High", "safe"]),
        },
    ];

    // Dropdowns
    const DROPDOWNS = [
        "Parental_Involvement",
        "Family_Income",
        "Parental_Education_Level",
        "Motivation_Level",
        "Distance_from_Home",
        "Teacher_Quality",
        "Peer_Influence",
        "Access_to_Resources",
    ];

    // Toggle Groups
    const toggleGroups = document.querySelectorAll(".toggle-group");

    // State Variables
    let currentProbability = 0;
    let isEvaluating = false;
    let debounceTimer = null;
    let confettiActive = false;

    // ── 1. Theme Switcher (Light / Dark) ──
    const savedTheme = localStorage.getItem("srp_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("srp_theme", next);
        showToast(`Switched to ${next} theme`, "🌓");
    });

    // ── 2. Sliders Setup & Styling ──
    function updateSliderVisual(sliderId, value) {
        const slider = document.getElementById(sliderId);
        const valElem = document.getElementById(`${sliderId}_val`);
        const tagElem = document.getElementById(`${sliderId}_tag`);
        const def = SLIDERS.find((s) => s.id === sliderId);

        if (slider && valElem) {
            valElem.textContent = value;
            if (def && tagElem) {
                const [tagText, statusClass] = def.getTag(Number(value));
                tagElem.textContent = tagText;
                tagElem.className = `val-tag ${statusClass}`;
            }

            // Calculate percentage fill for CSS gradient track
            const pct = ((value - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border-strong) ${pct}%, var(--border-strong) 100%)`;
        }
    }

    SLIDERS.forEach((def) => {
        const slider = document.getElementById(def.id);
        if (slider) {
            updateSliderVisual(def.id, slider.value);
            slider.addEventListener("input", (e) => {
                updateSliderVisual(def.id, e.target.value);
                triggerLiveEvaluate();
            });
        }
    });

    // ── 3. Segmented Button Controls (Toggles) ──
    toggleGroups.forEach((group) => {
        const buttons = group.querySelectorAll(".seg-btn");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                buttons.forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                triggerLiveEvaluate();
            });
        });
    });

    // Dropdowns trigger live eval
    DROPDOWNS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", triggerLiveEvaluate);
        }
    });

    // ── 4. Archetype Presets ──
    const PRESETS = {
        atRisk: {
            Hours_Studied: 10,
            Attendance: 65,
            Sleep_Hours: 5,
            Previous_Scores: 55,
            Tutoring_Sessions: 0,
            Physical_Activity: 1,
            Parental_Involvement: "Low",
            Family_Income: "Low",
            Parental_Education_Level: "High School",
            Motivation_Level: "Low",
            Distance_from_Home: "Far",
            Teacher_Quality: "Low",
            Peer_Influence: "Negative",
            Access_to_Resources: "Low",
            Learning_Disabilities: "Yes",
            School_Type: "Public",
            Internet_Access: "No",
            Extracurricular_Activities: "No",
        },
        average: {
            Hours_Studied: 20,
            Attendance: 80,
            Sleep_Hours: 7,
            Previous_Scores: 75,
            Tutoring_Sessions: 1,
            Physical_Activity: 3,
            Parental_Involvement: "Medium",
            Family_Income: "Medium",
            Parental_Education_Level: "College",
            Motivation_Level: "Medium",
            Distance_from_Home: "Moderate",
            Teacher_Quality: "Medium",
            Peer_Influence: "Neutral",
            Access_to_Resources: "Medium",
            Learning_Disabilities: "No",
            School_Type: "Public",
            Internet_Access: "Yes",
            Extracurricular_Activities: "Yes",
        },
        highAchiever: {
            Hours_Studied: 35,
            Attendance: 96,
            Sleep_Hours: 8,
            Previous_Scores: 92,
            Tutoring_Sessions: 2,
            Physical_Activity: 4,
            Parental_Involvement: "High",
            Family_Income: "High",
            Parental_Education_Level: "Postgraduate",
            Motivation_Level: "High",
            Distance_from_Home: "Near",
            Teacher_Quality: "High",
            Peer_Influence: "Positive",
            Access_to_Resources: "High",
            Learning_Disabilities: "No",
            School_Type: "Private",
            Internet_Access: "Yes",
            Extracurricular_Activities: "Yes",
        },
    };

    function applyPreset(preset, cardElem) {
        document.querySelectorAll(".persona-card").forEach((c) => c.classList.remove("active"));
        if (cardElem) cardElem.classList.add("active");

        // Set sliders with smooth visual updates
        SLIDERS.forEach((def) => {
            const slider = document.getElementById(def.id);
            if (slider && preset[def.id] !== undefined) {
                slider.value = preset[def.id];
                updateSliderVisual(def.id, preset[def.id]);
            }
        });

        // Set dropdowns
        DROPDOWNS.forEach((id) => {
            const el = document.getElementById(id);
            if (el && preset[id] !== undefined) {
                el.value = preset[id];
            }
        });

        // Set toggle buttons
        toggleGroups.forEach((group) => {
            const field = group.getAttribute("data-field");
            if (field && preset[field] !== undefined) {
                const buttons = group.querySelectorAll(".seg-btn");
                buttons.forEach((btn) => {
                    if (btn.getAttribute("data-value") === preset[field]) {
                        btn.classList.add("selected");
                    } else {
                        btn.classList.remove("selected");
                    }
                });
            }
        });

        executePrediction();
    }

    const personaAtRisk = document.getElementById("personaAtRisk");
    const personaAverage = document.getElementById("personaAverage");
    const personaHighAchiever = document.getElementById("personaHighAchiever");
    const personaReset = document.getElementById("personaReset");

    if (personaAtRisk) personaAtRisk.addEventListener("click", () => applyPreset(PRESETS.atRisk, personaAtRisk));
    if (personaAverage) personaAverage.addEventListener("click", () => applyPreset(PRESETS.average, personaAverage));
    if (personaHighAchiever) personaHighAchiever.addEventListener("click", () => applyPreset(PRESETS.highAchiever, personaHighAchiever));
    if (personaReset) personaReset.addEventListener("click", () => applyPreset(PRESETS.average, personaReset));

    // ── 5. Form Payload Harvester ──
    function getFormData() {
        const data = {};

        SLIDERS.forEach((def) => {
            const el = document.getElementById(def.id);
            data[def.id] = parseInt(el.value, 10);
        });

        DROPDOWNS.forEach((id) => {
            const el = document.getElementById(id);
            data[id] = el.value;
        });

        toggleGroups.forEach((group) => {
            const field = group.getAttribute("data-field");
            const selectedBtn = group.querySelector(".seg-btn.selected");
            if (field && selectedBtn) {
                data[field] = selectedBtn.getAttribute("data-value");
            }
        });

        return data;
    }

    // ── 6. Robust Backend Connection Fetcher ──
    async function postPrediction(payload) {
        // Production deployment (e.g. Render, Railway, custom domain): use relative API path directly
        if (
            window.location.hostname !== "localhost" &&
            window.location.hostname !== "127.0.0.1" &&
            window.location.protocol !== "file:"
        ) {
            return await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }

        // If served natively by FastAPI locally on port 8000, 8001, etc.
        if (window.location.port === "8000" || window.location.port === "8001") {
            return await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }

        // If on local Live Server (5500) or file://, try backend ports
        const endpoints = [
            "http://127.0.0.1:8000/api/predict",
            "http://127.0.0.1:8001/api/predict",
            "/api/predict",
        ];

        let lastErr = null;
        for (const url of endpoints) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (response.status !== 404) {
                    return response;
                }
            } catch (err) {
                lastErr = err;
            }
        }
        throw lastErr || new Error("Failed to reach FastAPI backend on port 8000 or 8001.");
    }

    // ── 7. Core Prediction Execution ──
    async function executePrediction() {
        if (isEvaluating) return;
        isEvaluating = true;

        if (errorCard) errorCard.classList.add("hidden");
        if (btnSpinner) btnSpinner.classList.remove("hidden");
        if (btnText) btnText.textContent = "Analyzing Risk...";
        if (submitBtn) submitBtn.disabled = true;

        const payload = getFormData();

        try {
            const response = await postPrediction(payload);
            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error(`Server returned non-JSON response (${response.status})`);
            }

            if (!response.ok) {
                if (result.detail && Array.isArray(result.detail)) {
                    const msg = result.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join("; ");
                    throw new Error(`Validation Error: ${msg}`);
                }
                throw new Error(result.detail || result.error || `Server error (${response.status})`);
            }

            // Render modern analytics
            renderAnalytics(result, payload);

            // Update status indicator
            if (systemStatus && statusLabel) {
                systemStatus.className = "status-indicator";
                statusLabel.textContent = "ML Model Active";
            }
        } catch (err) {
            console.error("Evaluation error:", err);
            if (errorCard && errorText) {
                errorText.textContent = err.message || "Failed to connect to backend.";
                errorCard.classList.remove("hidden");
            }
            if (statusLabel) statusLabel.textContent = "Connection Alert";
        } finally {
            isEvaluating = false;
            if (btnSpinner) btnSpinner.classList.add("hidden");
            if (btnText) btnText.textContent = "Compute Risk Prediction";
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    function triggerLiveEvaluate() {
        if (!liveToggle.checked) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            executePrediction();
        }, 220);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        executePrediction();
    });

    // ── 8. Render Rich Analytics & Speedometer ──
    function renderAnalytics(data, payload) {
        const { probability, prediction, risk_level } = data;
        const probaPct = probability * 100;

        // 1. Animate Speedometer Arc
        const targetOffset = CIRCUMFERENCE * (1 - probability);
        gaugeArc.style.strokeDashoffset = targetOffset;

        // Animate counter number
        animateValue(probaNumber, currentProbability * 100, probaPct, 600);
        currentProbability = probability;

        // 2. Tier Styling & Narrative
        radialContainer.classList.remove("safe", "warn", "danger");
        riskTierPill.classList.remove("safe", "warn", "danger");

        if (probability >= 0.7 || risk_level === "High Risk") {
            radialContainer.classList.add("danger");
            riskTierPill.classList.add("danger");
            riskTierPill.textContent = "Critical Risk Profile";
            riskEmoji.textContent = "🚨";
            riskHeadline.textContent = "Immediate Academic Intervention Needed";
            riskNarrative.textContent = "High probability of course failure or dropping out. Disproportionate negative indicators require structured faculty mediation.";
        } else if (probability >= 0.4 || risk_level === "Medium Risk") {
            radialContainer.classList.add("warn");
            riskTierPill.classList.add("warn");
            riskTierPill.textContent = "Moderate / Borderline Risk";
            riskEmoji.textContent = "⚡";
            riskHeadline.textContent = "Targeted Support Advised";
            riskNarrative.textContent = "Student displays mixed indicators. Proactive advising and habit reinforcement can prevent progression into severe risk.";
        } else {
            radialContainer.classList.add("safe");
            riskTierPill.classList.add("safe");
            riskTierPill.textContent = "Low Risk · On Track";
            riskEmoji.textContent = "🌟";
            riskHeadline.textContent = "Academic Performance Strong";
            riskNarrative.textContent = "Consistent study habits, robust attendance, and positive support structures correlate with high achievement.";
            triggerConfetti();
        }

        // 3. Update Mini Comparative Bars
        if (barMetricAtt && barFillAtt) {
            barMetricAtt.textContent = `${payload.Attendance}%`;
            barFillAtt.style.width = `${Math.min(payload.Attendance, 100)}%`;
        }
        if (barMetricStudy && barFillStudy) {
            barMetricStudy.textContent = `${payload.Hours_Studied} hrs`;
            barFillStudy.style.width = `${Math.min((payload.Hours_Studied / 40) * 100, 100)}%`;
        }
        if (barMetricScore && barFillScore) {
            barMetricScore.textContent = `${payload.Previous_Scores}`;
            barFillScore.style.width = `${Math.min(payload.Previous_Scores, 100)}%`;
        }
        if (barMetricSleep && barFillSleep) {
            barMetricSleep.textContent = `${payload.Sleep_Hours} hrs`;
            barFillSleep.style.width = `${Math.min((payload.Sleep_Hours / 10) * 100, 100)}%`;
        }

        // 4. Compute Strengths vs Risk Drivers
        computeInsights(payload, probability);
    }

    // Number counting animation
    function animateValue(elem, start, end, duration) {
        if (!elem) return;
        const startTime = performance.now();
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * progress;
            elem.textContent = current.toFixed(1);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ── 9. Dynamic Strengths & Action Plan Generator ──
    function computeInsights(payload, proba) {
        const strengths = [];
        const risks = [];
        const actions = [];

        // Attendance
        if (payload.Attendance >= 88) {
            strengths.push("High attendance rate (>88%)");
        } else if (payload.Attendance < 75) {
            risks.push("Critical attendance shortfall (<75%)");
            actions.push({ icon: "📅", text: "Establish mandatory attendance tracking & bi-weekly check-ins" });
        }

        // Hours Studied
        if (payload.Hours_Studied >= 22) {
            strengths.push("Dedicated weekly study habit (22+ hrs)");
        } else if (payload.Hours_Studied < 14) {
            risks.push("Sub-optimal independent study hours");
            actions.push({ icon: "⏱️", text: "Structure a scheduled 3-hr daily guided study block" });
        }

        // Peer Influence
        if (payload.Peer_Influence === "Positive") {
            strengths.push("Positive, academically-motivated peer circle");
        } else if (payload.Peer_Influence === "Negative") {
            risks.push("Negative peer circle strongly correlates with disengagement");
            actions.push({ icon: "🤝", text: "Assign student to high-achieving peer study & project team" });
        }

        // Tutoring
        if (payload.Tutoring_Sessions >= 2) {
            strengths.push("Active tutoring reinforcement");
        } else if (payload.Tutoring_Sessions === 0 && (payload.Previous_Scores < 70 || proba > 0.4)) {
            risks.push("No supplemental tutoring in place");
            actions.push({ icon: "🎓", text: "Enroll in departmental peer tutoring 2x weekly" });
        }

        // Sleep
        if (payload.Sleep_Hours >= 7 && payload.Sleep_Hours <= 8) {
            strengths.push("Healthy sleep & recovery routine");
        } else if (payload.Sleep_Hours < 6) {
            risks.push("Severe sleep deficit affects cognitive recall");
            actions.push({ icon: "💤", text: "Counsel on sleep hygiene to ensure minimum 7h rest" });
        }

        // Parental Involvement & Resources
        if (payload.Parental_Involvement === "High") {
            strengths.push("Strong proactive home engagement");
        } else if (payload.Parental_Involvement === "Low") {
            risks.push("Limited home academic support");
            actions.push({ icon: "📞", text: "Initiate monthly parent-counselor progress briefs" });
        }

        if (payload.Internet_Access === "No") {
            risks.push("No home internet access");
            actions.push({ icon: "📶", text: "Provide campus library hotspot or device loan program" });
        }

        if (payload.Learning_Disabilities === "Yes") {
            actions.push({ icon: "📋", text: "Verify individualized education accommodation plan (IEP)" });
        }

        // Fallbacks
        if (strengths.length === 0) {
            strengths.push("Regular enrollment status", "Baseline score foundation");
        }
        if (risks.length === 0) {
            risks.push("No critical vulnerabilities detected");
        }
        if (actions.length === 0) {
            actions.push(
                { icon: "⭐", text: "Maintain current academic rhythm and routine" },
                { icon: "🎯", text: "Explore advanced placement or mentorship opportunities" }
            );
        }

        // Render Strengths & Risks
        strengthsList.innerHTML = strengths.slice(0, 3).map((s) => `<li>${s}</li>`).join("");
        risksList.innerHTML = risks.slice(0, 3).map((r) => `<li>${r}</li>`).join("");

        // Render Actions
        actionPlanContainer.innerHTML = actions
            .slice(0, 4)
            .map(
                (act) => `
                <div class="action-item">
                    <span class="action-item-icon">${act.icon}</span>
                    <span>${act.text}</span>
                </div>`
            )
            .join("");
        if (actionCountBadge) actionCountBadge.textContent = `${actions.length} items`;
    }

    // ── 10. "What-If" Auto-Optimize Simulator ──
    btnSimulate.addEventListener("click", () => {
        showToast("Simulating optimal interventions...", "💡");

        // Target protective optimizations
        const targets = {
            Attendance: 92,
            Hours_Studied: 28,
            Tutoring_Sessions: 2,
            Sleep_Hours: 8,
            Motivation_Level: "High",
            Peer_Influence: "Positive",
        };

        // Smoothly adjust each slider
        Object.entries(targets).forEach(([key, val]) => {
            const slider = document.getElementById(key);
            const select = document.getElementById(key);
            if (slider && slider.type === "range") {
                slider.value = val;
                updateSliderVisual(key, val);
            } else if (select) {
                select.value = val;
            }
        });

        // Trigger evaluation
        executePrediction();
    });

    // ── 11. Copy Diagnostic Summary ──
    btnExport.addEventListener("click", () => {
        const payload = getFormData();
        const score = probaNumber ? probaNumber.textContent : "0";
        const tier = riskTierPill ? riskTierPill.textContent : "Unknown";

        const text = `
========================================
  STUDENT RISK PREDICTOR — DIAGNOSTIC BRIEF
========================================
Risk Level       : ${tier}
Probability      : ${score}%
Weekly Study     : ${payload.Hours_Studied} hrs/wk
Attendance       : ${payload.Attendance}%
Previous Score   : ${payload.Previous_Scores} / 100
Tutoring         : ${payload.Tutoring_Sessions} sessions/wk
Sleep            : ${payload.Sleep_Hours} hrs/day
Peer Group       : ${payload.Peer_Influence}
Motivation       : ${payload.Motivation_Level}
Parent Support   : ${payload.Parental_Involvement}
========================================
Generated by Student Risk Predictor
        `.trim();

        navigator.clipboard.writeText(text).then(() => {
            showToast("Diagnostic Brief copied to clipboard!", "📋");
        }).catch(() => {
            showToast("Brief ready to print", "🖨️");
        });
    });

    // ── 12. Toast Notification Helper ──
    function showToast(msg, icon = "ℹ️") {
        if (!toast) return;
        toastMsg.textContent = msg;
        toastIcon.textContent = icon;
        toast.classList.remove("hidden");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2800);
    }

    // ── 13. Confetti Animation (Zero-Dependency Vanilla Canvas) ──
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let particles = [];

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function triggerConfetti() {
        if (!ctx || confettiActive) return;
        confettiActive = true;
        particles = [];
        const colors = ["#6366f1", "#10b981", "#38bdf8", "#f59e0b", "#ec4899", "#8b5cf6"];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.45,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.9) * 16,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 8,
                opacity: 1,
            });
        }

        let frames = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // gravity
                p.rotation += p.rSpeed;
                p.opacity -= 0.012;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(p.opacity, 0);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            frames++;
            if (frames < 90) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confettiActive = false;
            }
        }
        requestAnimationFrame(animate);
    }

    // ── 14. Initial Load Evaluation ──
    // Run an initial evaluation with default values so the dashboard starts live
    setTimeout(() => {
        executePrediction();
    }, 150);
});
