import { auth, db } from "./firebase-config.js";
import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const questions = [
    {
        question: "Which data structure follows LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        answer: "Stack",
        topic: "Stack"
    },
    {
        question: "Which data structure follows FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: "Queue",
        topic: "Queue"
    },
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        answer: "O(log n)",
        topic: "Searching"
    },
    {
        question: "Which data structure is used in recursion?",
        options: ["Queue", "Stack", "Array", "Graph"],
        answer: "Stack",
        topic: "Stack"
    },
    {
        question: "Which of the following is a linear data structure?",
        options: ["Tree", "Graph", "Array", "Binary Tree"],
        answer: "Array",
        topic: "Arrays"
    },

    {
        question: "What is the time complexity of accessing an array element by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        answer: "O(1)",
        topic: "Arrays"
    },
    {
        question: "Which data structure is best suited for implementing a priority queue?",
        options: ["Heap", "Stack", "Array", "Linked List"],
        answer: "Heap",
        topic: "Heap"
    },
    {
        question: "Which traversal of a Binary Search Tree gives sorted order?",
        options: ["Preorder", "Inorder", "Postorder", "Level Order"],
        answer: "Inorder",
        topic: "Trees"
    },
    {
        question: "Which data structure is commonly used for BFS?",
        options: ["Stack", "Queue", "Heap", "Array"],
        answer: "Queue",
        topic: "Graphs"
    },
    {
        question: "Which data structure is commonly used for DFS?",
        options: ["Queue", "Stack", "Heap", "Hash Table"],
        answer: "Stack",
        topic: "Graphs"
    },

    {
        question: "What is the worst-case time complexity of linear search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: "O(n)",
        topic: "Searching"
    },
    {
        question: "Which sorting algorithm repeatedly selects the minimum element?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
        answer: "Selection Sort",
        topic: "Sorting"
    },
    {
        question: "Which sorting algorithm repeatedly swaps adjacent elements?",
        options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Heap Sort"],
        answer: "Bubble Sort",
        topic: "Sorting"
    },
    {
        question: "What is the average time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        answer: "O(n log n)",
        topic: "Sorting"
    },
    {
        question: "What is the time complexity of Merge Sort?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        answer: "O(n log n)",
        topic: "Sorting"
    },

    {
        question: "Which data structure stores key-value pairs?",
        options: ["Stack", "Queue", "Hash Table", "Array"],
        answer: "Hash Table",
        topic: "Hashing"
    },
    {
        question: "Which operation adds an element to a stack?",
        options: ["Enqueue", "Push", "Pop", "Insert"],
        answer: "Push",
        topic: "Stack"
    },
    {
        question: "Which operation removes an element from a stack?",
        options: ["Push", "Enqueue", "Pop", "Delete"],
        answer: "Pop",
        topic: "Stack"
    },
    {
        question: "Which operation adds an element to a queue?",
        options: ["Push", "Pop", "Enqueue", "Peek"],
        answer: "Enqueue",
        topic: "Queue"
    },
    {
        question: "Which operation removes an element from a queue?",
        options: ["Push", "Pop", "Dequeue", "Peek"],
        answer: "Dequeue",
        topic: "Queue"
    },

    {
        question: "What is the maximum number of children a binary tree node can have?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        topic: "Trees"
    },
    {
        question: "Which data structure represents hierarchical relationships?",
        options: ["Array", "Tree", "Stack", "Queue"],
        answer: "Tree",
        topic: "Trees"
    },
    {
        question: "Which data structure is used to represent a network?",
        options: ["Stack", "Queue", "Graph", "Array"],
        answer: "Graph",
        topic: "Graphs"
    },
    {
        question: "What is the root node of a tree?",
        options: [
            "The deepest node",
            "The topmost node",
            "The leaf node",
            "The last node"
        ],
        answer: "The topmost node",
        topic: "Trees"
    },
    {
        question: "A node with no children in a tree is called:",
        options: ["Root", "Parent", "Leaf", "Edge"],
        answer: "Leaf",
        topic: "Trees"
    },

    {
        question: "Which technique solves a problem by breaking it into smaller subproblems?",
        options: [
            "Recursion",
            "Compilation",
            "Hashing",
            "Indexing"
        ],
        answer: "Recursion",
        topic: "Recursion"
    },
    {
        question: "Which algorithm is used to find the shortest path in an unweighted graph?",
        options: [
            "DFS",
            "BFS",
            "Binary Search",
            "Selection Sort"
        ],
        answer: "BFS",
        topic: "Graphs"
    },
    {
        question: "Which sorting algorithm uses divide and conquer?",
        options: [
            "Bubble Sort",
            "Merge Sort",
            "Selection Sort",
            "Linear Search"
        ],
        answer: "Merge Sort",
        topic: "Sorting"
    },
    {
        question: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        answer: "O(n²)",
        topic: "Sorting"
    },
    {
        question: "Which data structure allows insertion and deletion from both ends?",
        options: ["Stack", "Queue", "Deque", "Tree"],
        answer: "Deque",
        topic: "Queue"
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

            quizType: "DSA",

            score: score,

            totalQuestions: questions.length,

            questionResults: questionResults,

            completedAt: serverTimestamp()
        });

        console.log("DSA result saved successfully");

    } catch (error) {

        console.error("Error saving DSA result:", error);

    }
}

loadQuestion();