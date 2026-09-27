import { auth, db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await generateAIGuidance(user.uid);
});


async function generateAIGuidance(userId) {

    try {

        const guidanceTitle =
            document.getElementById("guidanceTitle");

        const guidanceMessage =
            document.getElementById("guidanceMessage");

        const dsaGuidance =
            document.getElementById("dsaGuidance");

        const aptitudeGuidance =
            document.getElementById("aptitudeGuidance");

        const readinessGuidance =
            document.getElementById("readinessGuidance");

        const focusArea =
            document.getElementById("focusArea");

        const nextStep =
            document.getElementById("nextStep");


        guidanceTitle.textContent =
            "Generating AI guidance...";

        guidanceMessage.textContent =
            "SmartPrep AI is analyzing your latest quiz performance.";


        const q = query(
            collection(db, "quizResults"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);


        let latestDSA = null;
        let latestAptitude = null;


        snapshot.forEach((doc) => {

            const data = doc.data();

            if (data.quizType === "DSA") {

                if (
                    !latestDSA ||
                    data.completedAt?.toMillis() >
                    latestDSA.completedAt?.toMillis()
                ) {
                    latestDSA = data;
                }

            }


            if (data.quizType === "Aptitude") {

                if (
                    !latestAptitude ||
                    data.completedAt?.toMillis() >
                    latestAptitude.completedAt?.toMillis()
                ) {
                    latestAptitude = data;
                }

            }

        });


        const dsaScore =
            latestDSA?.score || 0;

        const aptitudeScore =
            latestAptitude?.score || 0;


        const weakTopics =
            findWeakTopics(
                latestDSA,
                latestAptitude
            );


        let readiness = 0;

        if (latestDSA && latestAptitude) {

            readiness = Math.round(
                (dsaScore + aptitudeScore) / 2
            );

        } else if (latestDSA) {

            readiness = dsaScore;

        } else if (latestAptitude) {

            readiness = aptitudeScore;

        }


        dsaGuidance.textContent =
            latestDSA
                ? `${dsaScore}%`
                : "Not Attempted";


        aptitudeGuidance.textContent =
            latestAptitude
                ? `${aptitudeScore}%`
                : "Not Attempted";


        readinessGuidance.textContent =
            readiness > 0
                ? `${readiness}%`
                : "Not Available";


        const prompt = `
You are SmartPrep, an AI placement preparation assistant.

Analyze the student's placement preparation performance.

DSA Score: ${dsaScore}%

Aptitude Score: ${aptitudeScore}%

Placement Readiness: ${readiness}%

Weak Topics:
${weakTopics.length > 0
    ? weakTopics.join(", ")
    : "No major weak topics detected."
}

Give personalized guidance for this student.

Include:

1. Performance analysis
2. Main weak areas
3. What to study next
4. A simple daily preparation plan
5. One motivational tip

Keep the response beginner-friendly and practical.
Do not make unrealistic promises.
`;


        const response = await fetch(
"https://smartprep-ai-backend-8t4g.onrender.com/api/guidance",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    prompt: prompt
                })
            }
        );


        const result = await response.json();


        if (!result.success) {
            throw new Error(
                result.error || "AI response failed"
            );
        }


        guidanceTitle.textContent =
            "Your AI-Powered Guidance";

        guidanceMessage.innerHTML =
            formatAIResponse(result.reply);


        focusArea.textContent =
            weakTopics.length > 0
                ? weakTopics.join(", ")
                : "No major weak area detected yet.";


        if (readiness < 60) {

            nextStep.textContent =
                "Focus on your weak topics and practice DSA and Aptitude regularly.";

        } else if (readiness < 80) {

            nextStep.textContent =
                "Your preparation is progressing. Continue practicing and improve your weak areas.";

        } else {

            nextStep.textContent =
                "Maintain your preparation and start practicing placement-level questions.";

        }

    } catch (error) {

        console.error("AI Guidance Error:", error);

        document.getElementById("guidanceTitle").textContent =
            "AI Guidance Unavailable";

        document.getElementById("guidanceMessage").textContent =
            "AI guidance generate nahi ho payi. Please check that the backend is running.";
    }
}


function findWeakTopics(dsaData, aptitudeData) {

    const weakTopics = [];

    function analyze(data) {

        if (!data || !data.questionResults) {
            return;
        }

        const topicStats = {};

        data.questionResults.forEach((question) => {

            const topic = question.topic || "General";

            if (!topicStats[topic]) {

                topicStats[topic] = {
                    correct: 0,
                    total: 0
                };

            }

            topicStats[topic].total++;

            if (question.isCorrect) {
                topicStats[topic].correct++;
            }

        });


        Object.entries(topicStats).forEach(
            ([topic, stats]) => {

                const percentage =
                    (stats.correct / stats.total) * 100;

                if (percentage < 60) {
                    weakTopics.push(topic);
                }

            }
        );
    }


    analyze(dsaData);
    analyze(aptitudeData);

    return [...new Set(weakTopics)];
}


function formatAIResponse(text) {

    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");

}