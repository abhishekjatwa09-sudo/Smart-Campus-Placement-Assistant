import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


const studentName =
    document.getElementById("studentName");

const logoutBtn =
    document.getElementById("logoutBtn");

const readinessStat =
    document.getElementById("readinessStat");

const dsaStat =
    document.getElementById("dsaStat");

const aptitudeStat =
    document.getElementById("aptitudeStat");

const statusStat =
    document.getElementById("statusStat");

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

const recentActivityList =
    document.getElementById("recentActivityList");


// Convert Firestore timestamp into milliseconds

function getTime(result) {

    if (
        result.completedAt &&
        typeof result.completedAt.toMillis === "function"
    ) {
        return result.completedAt.toMillis();
    }

    return 0;
}


// Load Dashboard

async function loadDashboard(user) {

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


        // Sort newest first

        results.sort((a, b) => {

            return getTime(b) - getTime(a);

        });


        // --------------------------------
        // GET LATEST DSA
        // --------------------------------

        const latestDSA =
            results.find(
                (result) => result.quizType === "DSA"
            );


        // --------------------------------
        // GET LATEST APTITUDE
        // --------------------------------

        const latestAptitude =
            results.find(
                (result) => result.quizType === "Aptitude"
            );


        // --------------------------------
        // DSA SCORE
        // --------------------------------

        let dsaPercentage = 0;

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


        // --------------------------------
        // APTITUDE SCORE
        // --------------------------------

        let aptitudePercentage = 0;

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


        // --------------------------------
        // READINESS
        // --------------------------------

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


        // --------------------------------
        // UPDATE STATS
        // --------------------------------

        readinessStat.textContent =
            `${readiness}%`;


        dsaStat.textContent =
            latestDSA
                ? `${dsaPercentage}%`
                : "Not attempted";


        aptitudeStat.textContent =
            latestAptitude
                ? `${aptitudePercentage}%`
                : "Not attempted";


        // --------------------------------
        // PREPARATION STATUS
        // --------------------------------

        if (readiness >= 80) {

            statusStat.textContent =
                "Strong";

        }

        else if (readiness >= 60) {

            statusStat.textContent =
                "Good";

        }

        else if (readiness > 0) {

            statusStat.textContent =
                "Improving";

        }

        else {

            statusStat.textContent =
                "Starting";

        }


        // --------------------------------
        // PROGRESS BARS
        // --------------------------------

        dsaProgress.style.width =
            `${dsaPercentage}%`;

        aptitudeProgress.style.width =
            `${aptitudePercentage}%`;

        overallProgress.style.width =
            `${readiness}%`;


        dsaProgressText.textContent =
            `${dsaPercentage}%`;

        aptitudeProgressText.textContent =
            `${aptitudePercentage}%`;

        overallProgressText.textContent =
            `${readiness}%`;


        // --------------------------------
        // RECENT ACTIVITY
        // ONLY LATEST DSA + APTITUDE
        // --------------------------------

        const latestResults = [];

        if (latestDSA) {

            latestResults.push(latestDSA);

        }

        if (latestAptitude) {

            latestResults.push(latestAptitude);

        }


        loadRecentActivity(latestResults);

    }

    catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

        if (recentActivityList) {

            recentActivityList.innerHTML = `
                <div class="activity-loading">
                    Unable to load recent activity.
                </div>
            `;

        }

    }

}


// --------------------------------
// RECENT ACTIVITY
// --------------------------------

function loadRecentActivity(results) {

    if (!recentActivityList) {
        return;
    }


    if (results.length === 0) {

        recentActivityList.innerHTML = `
            <div class="activity-loading">
                No quiz attempts yet.
                Start your first quiz to see your activity here.
            </div>
        `;

        return;

    }


    recentActivityList.innerHTML = "";


    results.forEach((result) => {

        const activityItem =
            document.createElement("div");

        activityItem.className =
            "activity-item";


        const icon =
            result.quizType === "DSA"
                ? "🧠"
                : "🔢";


        const percentage =
            result.totalQuestions > 0
                ? Math.round(
                    (result.score /
                        result.totalQuestions) * 100
                )
                : 0;


        let performanceText =
            "Needs Practice";


        if (percentage >= 80) {

            performanceText =
                "Excellent";

        }

        else if (percentage >= 60) {

            performanceText =
                "Good";

        }

        else if (percentage >= 40) {

            performanceText =
                "Keep Improving";

        }


        activityItem.innerHTML = `

            <div class="activity-icon">
                ${icon}
            </div>

            <div class="activity-info">

                <h3>
                    ${result.quizType || "Quiz"}
                </h3>

                <p>
                    Score:
                    ${result.score || 0}
                    /
                    ${result.totalQuestions || 0}
                </p>

            </div>

            <div class="activity-result">

                <strong>
                    ${percentage}%
                </strong>

                <span>
                    ${performanceText}
                </span>

            </div>

        `;


        recentActivityList.appendChild(
            activityItem
        );

    });

}


// --------------------------------
// AUTH
// --------------------------------

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            studentName.textContent =
                user.displayName || "Student";

            loadDashboard(user);

        }

        else {

            window.location.href =
                "login.html";

        }

    }
);


// --------------------------------
// LOGOUT
// --------------------------------

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);