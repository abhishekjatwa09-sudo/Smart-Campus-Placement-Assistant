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


const readinessScore =
    document.getElementById("readinessScore");

const readinessLevel =
    document.getElementById("readinessLevel");

const readinessMessage =
    document.getElementById("readinessMessage");

const readinessExplanation =
    document.getElementById("readinessExplanation");

const dsaScoreElement =
    document.getElementById("dsaScore");

const aptitudeScoreElement =
    document.getElementById("aptitudeScore");

const overallReadiness =
    document.getElementById("overallReadiness");

const dsaReadinessProgress =
    document.getElementById("dsaReadinessProgress");

const aptitudeReadinessProgress =
    document.getElementById("aptitudeReadinessProgress");

const dsaReadinessText =
    document.getElementById("dsaReadinessText");

const aptitudeReadinessText =
    document.getElementById("aptitudeReadinessText");


// Get Firestore timestamp

function getTime(result) {

    if (
        result.completedAt &&
        typeof result.completedAt.toMillis === "function"
    ) {
        return result.completedAt.toMillis();
    }

    return 0;
}


// Calculate readiness

async function calculateReadiness(user) {

    try {

        const quizResultsRef =
            collection(db, "quizResults");

        const q =
            query(
                quizResultsRef,
                where("userId", "==", user.uid)
            );

        const querySnapshot =
            await getDocs(q);


        const results = [];


        querySnapshot.forEach((doc) => {

            results.push(doc.data());

        });


        // Sort latest first

        results.sort((a, b) => {

            return getTime(b) - getTime(a);

        });


        // Latest attempts only

        const latestDSA =
            results.find(
                result => result.quizType === "DSA"
            );

        const latestAptitude =
            results.find(
                result => result.quizType === "Aptitude"
            );


        let dsaPercentage = 0;
        let aptitudePercentage = 0;


        // DSA percentage

        if (
            latestDSA &&
            latestDSA.totalQuestions > 0
        ) {

            dsaPercentage =
                Math.round(
                    (latestDSA.score /
                        latestDSA.totalQuestions) * 100
                );

        }


        // Aptitude percentage

        if (
            latestAptitude &&
            latestAptitude.totalQuestions > 0
        ) {

            aptitudePercentage =
                Math.round(
                    (latestAptitude.score /
                        latestAptitude.totalQuestions) * 100
                );

        }


        // Overall readiness

        let readiness = 0;


        if (
            latestDSA &&
            latestAptitude
        ) {

            readiness =
                Math.round(
                    (dsaPercentage +
                        aptitudePercentage) / 2
                );

        }

        else if (latestDSA) {

            readiness =
                dsaPercentage;

        }

        else if (latestAptitude) {

            readiness =
                aptitudePercentage;

        }


        // Display scores

        if (latestDSA) {

            dsaScoreElement.textContent =
                `${latestDSA.score} / ${latestDSA.totalQuestions}`;

        }
        else {

            dsaScoreElement.textContent =
                "Not attempted";

        }


        if (latestAptitude) {

            aptitudeScoreElement.textContent =
                `${latestAptitude.score} / ${latestAptitude.totalQuestions}`;

        }
        else {

            aptitudeScoreElement.textContent =
                "Not attempted";

        }


        // Main readiness

        readinessScore.textContent =
            `${readiness}%`;

        overallReadiness.textContent =
            `${readiness}%`;


        // Progress bars

        dsaReadinessProgress.style.width =
            `${dsaPercentage}%`;

        aptitudeReadinessProgress.style.width =
            `${aptitudePercentage}%`;


        dsaReadinessText.textContent =
            `${dsaPercentage}%`;

        aptitudeReadinessText.textContent =
            `${aptitudePercentage}%`;


        // --------------------------------
        // READINESS MESSAGE
        // --------------------------------

        if (readiness >= 80) {

            readinessLevel.textContent =
                "Strong Preparation";

            readinessMessage.textContent =
                "Your current quiz performance shows strong preparation. Continue practicing consistently.";

            readinessExplanation.textContent =
                "Your DSA and Aptitude performance is currently strong. Gradually increase question difficulty.";

        }

        else if (readiness >= 60) {

            readinessLevel.textContent =
                "Good Preparation";

            readinessMessage.textContent =
                "You have a good foundation. Focus on improving your weaker areas.";

            readinessExplanation.textContent =
                "Your preparation is progressing. Use Weak Topics and Smart Guidance to focus your practice.";

        }

        else if (readiness > 0) {

            readinessLevel.textContent =
                "Needs Improvement";

            readinessMessage.textContent =
                "Keep practicing DSA and Aptitude regularly to improve your preparation.";

            readinessExplanation.textContent =
                "Your current performance shows room for improvement. Focus on your weak areas and practice consistently.";

        }

        else {

            readinessLevel.textContent =
                "Not Available";

            readinessMessage.textContent =
                "Attempt the DSA or Aptitude quiz to calculate your readiness.";

            readinessExplanation.textContent =
                "Complete at least one quiz to start tracking your placement preparation.";

        }

    }

    catch (error) {

        console.error(
            "Error calculating readiness:",
            error
        );

        readinessMessage.textContent =
            "Unable to calculate readiness score.";

        readinessExplanation.textContent =
            "There was a problem loading your performance data.";

    }

}


// Authentication

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            calculateReadiness(user);

        }
        else {

            window.location.href =
                "login.html";

        }

    }
);