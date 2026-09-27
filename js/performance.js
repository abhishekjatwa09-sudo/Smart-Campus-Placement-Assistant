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


const dsaScore =
    document.getElementById("dsaScore");

const aptitudeScore =
    document.getElementById("aptitudeScore");

const overallScore =
    document.getElementById("overallScore");

const performanceMessage =
    document.getElementById("performanceMessage");

const dsaProgress =
    document.getElementById("dsaProgress");

const aptitudeProgress =
    document.getElementById("aptitudeProgress");

const overallProgress =
    document.getElementById("overallProgress");

const dsaProgressText =
    document.getElementById("dsaProgressText");

const aptitudeProgressText =
    document.getElementById("aptitudeProgressText");

const overallProgressText =
    document.getElementById("overallProgressText");


function getTime(result) {

    if (
        result.completedAt &&
        typeof result.completedAt.toMillis === "function"
    ) {
        return result.completedAt.toMillis();
    }

    return 0;
}


async function loadPerformance(user) {

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


        // Newest result first

        results.sort((a, b) => {

            return getTime(b) - getTime(a);

        });


        // Latest attempt only

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


        let overallPercentage = 0;


        if (
            latestDSA &&
            latestAptitude
        ) {

            overallPercentage =
                Math.round(
                    (dsaPercentage +
                        aptitudePercentage) / 2
                );

        }

        else if (latestDSA) {

            overallPercentage =
                dsaPercentage;

        }

        else if (latestAptitude) {

            overallPercentage =
                aptitudePercentage;

        }


        dsaScore.textContent =
            latestDSA
                ? `${dsaPercentage}%`
                : "Not Attempted";


        aptitudeScore.textContent =
            latestAptitude
                ? `${aptitudePercentage}%`
                : "Not Attempted";


        overallScore.textContent =
            `${overallPercentage}%`;


        dsaProgress.style.width =
            `${dsaPercentage}%`;

        aptitudeProgress.style.width =
            `${aptitudePercentage}%`;

        overallProgress.style.width =
            `${overallPercentage}%`;


        dsaProgressText.textContent =
            `${dsaPercentage}%`;

        aptitudeProgressText.textContent =
            `${aptitudePercentage}%`;

        overallProgressText.textContent =
            `${overallPercentage}%`;


        generatePerformanceMessage(
            dsaPercentage,
            aptitudePercentage,
            overallPercentage,
            !!latestDSA,
            !!latestAptitude
        );

    }

    catch (error) {

        console.error(
            "Error loading performance:",
            error
        );

        performanceMessage.textContent =
            "Unable to load your performance data right now.";

    }

}


function generatePerformanceMessage(
    dsa,
    aptitude,
    overall,
    dsaAttempted,
    aptitudeAttempted
) {

    if (
        !dsaAttempted &&
        !aptitudeAttempted
    ) {

        performanceMessage.textContent =
            "You have not attempted any quiz yet. Start with DSA or Aptitude to begin tracking your placement preparation.";

        return;
    }


    if (
        dsaAttempted &&
        aptitudeAttempted
    ) {

        if (
            dsa < 60 &&
            aptitude < 60
        ) {

            performanceMessage.textContent =
                `Your current overall performance is ${overall}%. Both DSA and Aptitude need more practice.`;

        }

        else if (dsa < 60) {

            performanceMessage.textContent =
                `Your Aptitude performance is ${aptitude}%, while DSA is ${dsa}%. Focus more on DSA.`;

        }

        else if (aptitude < 60) {

            performanceMessage.textContent =
                `Your DSA performance is ${dsa}%, while Aptitude is ${aptitude}%. Focus more on Aptitude.`;

        }

        else {

            performanceMessage.textContent =
                `Your current overall performance is ${overall}%. Continue practicing both DSA and Aptitude consistently.`;

        }

        return;
    }


    if (dsaAttempted) {

        performanceMessage.textContent =
            `Your current DSA performance is ${dsa}%. Complete the Aptitude Quiz as well for a more complete analysis.`;

        return;
    }


    if (aptitudeAttempted) {

        performanceMessage.textContent =
            `Your current Aptitude performance is ${aptitude}%. Complete the DSA Quiz as well for a more complete analysis.`;

    }

}


onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            loadPerformance(user);

        }

        else {

            window.location.href =
                "login.html";

        }

    }
);