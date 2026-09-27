import { auth, db } from "./firebase-config.js";
import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const questions = [
    {
        question: "What is 20% of 250?",
        options: ["40", "50", "60", "70"],
        answer: "50",
        topic: "Percentage"
    },
    {
        question: "A car travels 120 km in 3 hours. What is its average speed?",
        options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
        answer: "40 km/h",
        topic: "Time and Speed"
    },
    {
        question: "What is the ratio of 20 to 30 in simplest form?",
        options: ["1:2", "2:3", "3:2", "2:5"],
        answer: "2:3",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 2, 4, 8, 16, ?",
        options: ["20", "24", "32", "36"],
        answer: "32",
        topic: "Number Series"
    },
    {
        question: "If CP = ₹500 and SP = ₹600, what is the profit?",
        options: ["₹50", "₹75", "₹100", "₹150"],
        answer: "₹100",
        topic: "Profit and Loss"
    },

    {
        question: "What is 15% of 400?",
        options: ["40", "50", "60", "70"],
        answer: "60",
        topic: "Percentage"
    },
    {
        question: "A train covers 180 km in 3 hours. What is its speed?",
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        answer: "60 km/h",
        topic: "Time and Speed"
    },
    {
        question: "If 3 pens cost ₹30, what is the cost of 7 pens?",
        options: ["₹60", "₹70", "₹80", "₹90"],
        answer: "₹70",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 5, 10, 15, 20, ?",
        options: ["22", "25", "30", "35"],
        answer: "25",
        topic: "Number Series"
    },
    {
        question: "If CP = ₹800 and SP = ₹720, what is the loss?",
        options: ["₹60", "₹70", "₹80", "₹90"],
        answer: "₹80",
        topic: "Profit and Loss"
    },

    {
        question: "What is 25% of 320?",
        options: ["60", "70", "80", "90"],
        answer: "80",
        topic: "Percentage"
    },
    {
        question: "A person walks 20 km in 4 hours. What is the speed?",
        options: ["4 km/h", "5 km/h", "6 km/h", "8 km/h"],
        answer: "5 km/h",
        topic: "Time and Speed"
    },
    {
        question: "The ratio of boys to girls is 2:3. If there are 20 boys, how many girls are there?",
        options: ["25", "30", "35", "40"],
        answer: "30",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 3, 6, 12, 24, ?",
        options: ["36", "42", "48", "52"],
        answer: "48",
        topic: "Number Series"
    },
    {
        question: "An item bought for ₹1000 is sold for ₹1200. What is the profit percentage?",
        options: ["10%", "15%", "20%", "25%"],
        answer: "20%",
        topic: "Profit and Loss"
    },

    {
        question: "What is 30% of 500?",
        options: ["100", "125", "150", "175"],
        answer: "150",
        topic: "Percentage"
    },
    {
        question: "A bike travels at 50 km/h for 4 hours. What distance does it cover?",
        options: ["150 km", "180 km", "200 km", "250 km"],
        answer: "200 km",
        topic: "Time and Speed"
    },
    {
        question: "Divide ₹500 in the ratio 2:3. What is the smaller share?",
        options: ["₹150", "₹200", "₹250", "₹300"],
        answer: "₹200",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 100, 90, 80, 70, ?",
        options: ["50", "55", "60", "65"],
        answer: "60",
        topic: "Number Series"
    },
    {
        question: "If an article is sold at ₹900 after a loss of ₹100, what was its cost price?",
        options: ["₹800", "₹900", "₹1000", "₹1100"],
        answer: "₹1000",
        topic: "Profit and Loss"
    },

    {
        question: "A number is increased from 200 to 250. What is the percentage increase?",
        options: ["20%", "25%", "30%", "35%"],
        answer: "25%",
        topic: "Percentage"
    },
    {
        question: "How much time will it take to travel 150 km at 50 km/h?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        answer: "3 hours",
        topic: "Time and Speed"
    },
    {
        question: "If the ratio of two numbers is 4:5 and the first number is 20, what is the second?",
        options: ["20", "25", "30", "35"],
        answer: "25",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 1, 4, 9, 16, ?",
        options: ["20", "24", "25", "30"],
        answer: "25",
        topic: "Number Series"
    },
    {
        question: "An item costs ₹500 and is sold for ₹550. What is the profit percentage?",
        options: ["5%", "10%", "15%", "20%"],
        answer: "10%",
        topic: "Profit and Loss"
    },

    {
        question: "What is 40% of 250?",
        options: ["80", "90", "100", "120"],
        answer: "100",
        topic: "Percentage"
    },
    {
        question: "A bus travels 240 km at 60 km/h. How much time does it take?",
        options: ["3 hours", "4 hours", "5 hours", "6 hours"],
        answer: "4 hours",
        topic: "Time and Speed"
    },
    {
        question: "The ratio of 45 to 60 is:",
        options: ["2:3", "3:4", "4:5", "5:6"],
        answer: "3:4",
        topic: "Ratio"
    },
    {
        question: "Find the next number: 7, 14, 21, 28, ?",
        options: ["32", "35", "38", "42"],
        answer: "35",
        topic: "Number Series"
    },
    {
        question: "An article is bought for ₹2000 and sold for ₹2400. What is the profit percentage?",
        options: ["15%", "20%", "25%", "30%"],
        answer: "20%",
        topic: "Profit and Loss"
    }
];

let currentQuestion = 0;
let score = 0;
let questionResults = [];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("nextBtn");
const resultElement = document.getElementById("result");

function loadQuestion() {

    const current = questions[currentQuestion];

    questionElement.textContent =
        `Q${currentQuestion + 1}. ${current.question}`;

    optionsElement.innerHTML = "";

    current.options.forEach(option => {

        const button = document.createElement("button");

        button.textContent = option;
        button.classList.add("option-btn");

        button.addEventListener("click", () => {
            checkAnswer(option);
        });

        optionsElement.appendChild(button);
    });

    nextButton.style.display = "none";
}

function checkAnswer(selectedAnswer) {

    const current = questions[currentQuestion];

    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(button => {

        button.disabled = true;

        if (button.textContent === current.answer) {
            button.classList.add("correct");
        }

        if (
            button.textContent === selectedAnswer &&
            selectedAnswer !== current.answer
        ) {
            button.classList.add("wrong");
        }
    });

    const isCorrect = selectedAnswer === current.answer;

    if (isCorrect) {
        score++;
    }

    questionResults.push({
        questionNumber: currentQuestion + 1,
        topic: current.topic,
        selectedAnswer: selectedAnswer,
        correctAnswer: current.answer,
        isCorrect: isCorrect
    });

    nextButton.style.display = "block";

    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "Finish Quiz";
    } else {
        nextButton.textContent = "Next Question";
    }
}

nextButton.addEventListener("click", () => {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResult();
    }
});

async function showResult() {

    questionElement.style.display = "none";
    optionsElement.style.display = "none";
    nextButton.style.display = "none";

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    resultElement.innerHTML = `
        <h2>Quiz Completed 🎉</h2>
        <p>Your Score</p>
        <h1>${score} / ${questions.length}</h1>
        <p>${percentage}%</p>

        <button onclick="window.location.href='dashboard.html'">
            Back to Dashboard
        </button>
    `;

    try {

        await addDoc(collection(db, "quizResults"), {

            userId: auth.currentUser.uid,

            userName:
                auth.currentUser.displayName || "Student",

            quizType: "Aptitude",

            score: score,

            totalQuestions: questions.length,

            questionResults: questionResults,

            completedAt: serverTimestamp()
        });

        console.log("Aptitude result saved successfully");

    } catch (error) {

        console.error(
            "Error saving Aptitude result:",
            error
        );
    }
}

loadQuestion();