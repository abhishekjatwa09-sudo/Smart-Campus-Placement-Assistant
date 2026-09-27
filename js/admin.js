import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


// HTML elements

const totalStudents =
    document.getElementById("totalStudents");

const totalAttempts =
    document.getElementById("totalAttempts");

const dsaAttempts =
    document.getElementById("dsaAttempts");

const aptitudeAttempts =
    document.getElementById("aptitudeAttempts");

const resultsTable =
    document.getElementById("resultsTable");

const studentSearch =
    document.getElementById("studentSearch");

const refreshAdminBtn =
    document.getElementById("refreshAdminBtn");


// Store all results for search

let allResults = [];


// Load admin data

async function loadAdminData() {

    try {

        resultsTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Loading results...
                </td>
            </tr>
        `;


        const resultsRef =
            collection(db, "quizResults");

        const snapshot =
            await getDocs(resultsRef);


        let dsaCount = 0;
        let aptitudeCount = 0;

        const students = new Set();

        allResults = [];


        snapshot.forEach((doc) => {

            const data = doc.data();

            allResults.push(data);


            // Count students

            if (data.userId) {
                students.add(data.userId);
            }


            // Count quiz types

            if (data.quizType === "DSA") {
                dsaCount++;
            }

            if (data.quizType === "Aptitude") {
                aptitudeCount++;
            }

        });


        // Update statistics

        totalStudents.textContent =
            students.size;

        totalAttempts.textContent =
            allResults.length;

        dsaAttempts.textContent =
            dsaCount;

        aptitudeAttempts.textContent =
            aptitudeCount;


        // Display results

        displayResults(allResults);

    }

    catch (error) {

        console.error(
            "Error loading admin data:",
            error
        );


        resultsTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load student results.
                </td>
            </tr>
        `;

    }

}


// Display results

function displayResults(results) {

    resultsTable.innerHTML = "";


    if (results.length === 0) {

        resultsTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No quiz results found.
                </td>
            </tr>
        `;

        return;
    }


    // Sort latest first

    results.sort((a, b) => {

        const timeA =
            a.completedAt?.toMillis
                ? a.completedAt.toMillis()
                : 0;

        const timeB =
            b.completedAt?.toMillis
                ? b.completedAt.toMillis()
                : 0;

        return timeB - timeA;

    });


    // Show latest 20 results

    const recentResults =
        results.slice(0, 20);


    recentResults.forEach((result) => {

        const row =
            document.createElement("tr");


        const score =
            result.score || 0;

        const total =
            result.totalQuestions || 0;


        let percentage = 0;

        if (total > 0) {

            percentage =
                Math.round(
                    (score / total) * 100
                );

        }


        // Status

        let status = "Needs Practice";

        if (percentage >= 80) {
            status = "Excellent";
        }
        else if (percentage >= 60) {
            status = "Good";
        }
        else if (percentage >= 40) {
            status = "Improving";
        }


        row.innerHTML = `

            <td>
                ${result.userName || "Student"}
            </td>

            <td>
                ${result.quizType || "Quiz"}
            </td>

            <td>
                ${score} / ${total}
            </td>

            <td>
                ${percentage}%
            </td>

            <td>
                <span class="admin-status">
                    ${status}
                </span>
            </td>

        `;


        resultsTable.appendChild(row);

    });

}


// Search results

studentSearch.addEventListener(
    "input",
    () => {

        const searchText =
            studentSearch.value
                .toLowerCase()
                .trim();


        if (searchText === "") {

            displayResults(allResults);

            return;

        }


        const filteredResults =
            allResults.filter((result) => {

                const name =
                    (result.userName || "")
                        .toLowerCase();

                const quiz =
                    (result.quizType || "")
                        .toLowerCase();

                return (
                    name.includes(searchText) ||
                    quiz.includes(searchText)
                );

            });


        displayResults(filteredResults);

    }
);


// Refresh button

refreshAdminBtn.addEventListener(
    "click",
    () => {

        loadAdminData();

    }
);


// Authentication

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            loadAdminData();

        }
        else {

            window.location.href =
                "login.html";

        }

    }
);