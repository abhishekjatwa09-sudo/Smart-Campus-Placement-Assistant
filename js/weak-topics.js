import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


const dsaTopics =
    document.getElementById("dsaTopics");

const aptitudeTopics =
    document.getElementById("aptitudeTopics");

const overallTopicTitle =
    document.getElementById("overallTopicTitle");

const overallTopicMessage =
    document.getElementById("overallTopicMessage");

const recommendation =
    document.getElementById("recommendation");


function getTime(result) {

    if (
        result.completedAt &&
        typeof result.completedAt.toMillis === "function"
    ) {
        return result.completedAt.toMillis();
    }

    return 0;
}


async function loadWeakTopics(user) {

    try {

        const resultsRef =
            collection(db, "quizResults");

        const q =
            query(
                resultsRef,
                where("userId", "==", user.uid)
            );

        const snapshot =
            await getDocs(q);


        const results = [];


        snapshot.forEach((doc) => {

            results.push(doc.data());

        });


        // Latest result first

        results.sort((a, b) => {

            return getTime(b) - getTime(a);

        });


        // Latest DSA attempt

        const latestDSA =
            results.find(
                result =>
                    result.quizType === "DSA" &&
                    result.questionResults
            );


        // Latest Aptitude attempt

        const latestAptitude =
            results.find(
                result =>
                    result.quizType === "Aptitude" &&
                    result.questionResults
            );


        // DSA analysis

        if (latestDSA) {

            analyzeTopics(
                latestDSA.questionResults,
                dsaTopics
            );

        }
        else {

            dsaTopics.innerHTML = `
                <div class="topic-loading">
                    Complete the DSA Quiz to see topic-level analysis.
                </div>
            `;

        }


        // Aptitude analysis

        if (latestAptitude) {

            analyzeTopics(
                latestAptitude.questionResults,
                aptitudeTopics
            );

        }
        else {

            aptitudeTopics.innerHTML = `
                <div class="topic-loading">
                    Complete the Aptitude Quiz to see topic-level analysis.
                </div>
            `;

        }


        // Find weak topics

        const weakDSA =
            latestDSA
                ? getWeakTopics(
                    latestDSA.questionResults
                )
                : [];


        const weakAptitude =
            latestAptitude
                ? getWeakTopics(
                    latestAptitude.questionResults
                )
                : [];


        const allWeakTopics = [
            ...weakDSA,
            ...weakAptitude
        ];


        // Overall recommendation

        if (allWeakTopics.length > 0) {

            overallTopicTitle.textContent =
                "Some areas need more practice";


            overallTopicMessage.textContent =
                `Focus on: ${allWeakTopics.join(", ")}.`;


            recommendation.textContent =
                `Your current weak areas are ${allWeakTopics.join(", ")}. Practice these topics before moving to harder questions.`;

        }

        else if (
            latestDSA ||
            latestAptitude
        ) {

            overallTopicTitle.textContent =
                "Keep building your preparation";


            overallTopicMessage.textContent =
                "Your latest quiz attempts do not currently show a major weak area.";


            recommendation.textContent =
                "Continue practicing regularly and gradually increase question difficulty.";

        }

        else {

            overallTopicTitle.textContent =
                "Topic analysis not available yet";


            overallTopicMessage.textContent =
                "Complete the DSA or Aptitude Quiz to generate personalized analysis.";


            recommendation.textContent =
                "Start a quiz first. Your answers will help SmartPrep identify topics that need more practice.";

        }

    }

    catch (error) {

        console.error(
            "Error loading weak topics:",
            error
        );


        dsaTopics.innerHTML = `
            <div class="topic-loading">
                Unable to load DSA analysis.
            </div>
        `;


        aptitudeTopics.innerHTML = `
            <div class="topic-loading">
                Unable to load Aptitude analysis.
            </div>
        `;


        recommendation.textContent =
            "Unable to analyze your performance right now.";

    }

}


// Analyze individual topics

function analyzeTopics(
    results,
    container
) {

    const topicData = {};


    results.forEach((result) => {

        const topic = result.topic;

        if (!topic) {
            return;
        }


        if (!topicData[topic]) {

            topicData[topic] = {
                total: 0,
                correct: 0
            };

        }


        topicData[topic].total++;


        if (result.isCorrect) {

            topicData[topic].correct++;

        }

    });


    container.innerHTML = "";


    Object.keys(topicData).forEach((topic) => {

        const data =
            topicData[topic];


        const percentage =
            Math.round(
                (data.correct /
                    data.total) * 100
            );


        let status =
            "Needs Practice";


        if (percentage >= 80) {

            status =
                "Excellent";

        }
        else if (percentage >= 60) {

            status =
                "Good";

        }


        const card =
            document.createElement("div");

        card.className =
            "topic-card";


        card.innerHTML = `

            <div class="topic-card-top">

                <h3>
                    ${topic}
                </h3>

                <span class="topic-percentage">
                    ${percentage}%
                </span>

            </div>


            <div class="topic-progress">

                <div
                    class="topic-progress-fill"
                    style="width: ${percentage}%">
                </div>

            </div>


            <div class="topic-card-bottom">

                <span>
                    ${data.correct} /
                    ${data.total}
                    correct
                </span>

                <span>
                    ${status}
                </span>

            </div>

        `;


        container.appendChild(card);

    });

}


// Get weak topics

function getWeakTopics(results) {

    const topicData = {};


    results.forEach((result) => {

        const topic = result.topic;

        if (!topic) {
            return;
        }


        if (!topicData[topic]) {

            topicData[topic] = {
                total: 0,
                correct: 0
            };

        }


        topicData[topic].total++;


        if (result.isCorrect) {

            topicData[topic].correct++;

        }

    });


    const weakTopics = [];


    Object.keys(topicData).forEach((topic) => {

        const percentage =
            (
                topicData[topic].correct /
                topicData[topic].total
            ) * 100;


        if (percentage < 60) {

            weakTopics.push(topic);

        }

    });


    return weakTopics;

}


// Authentication

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            loadWeakTopics(user);

        }
        else {

            window.location.href =
                "login.html";

        }

    }
);