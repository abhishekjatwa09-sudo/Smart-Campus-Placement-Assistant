import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


// ===============================
// Password Show / Hide
// ===============================

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) return;

    button.addEventListener("click", function () {

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
            button.setAttribute("aria-label", "Hide password");
        } 
        else {
            input.type = "password";
            button.textContent = "👁";
            button.setAttribute("aria-label", "Show password");
        }

    });
}


// ===============================
// Firebase Error Messages
// ===============================

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password should be at least 6 characters.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        default:
            return "Something went wrong. Please try again.";
    }
}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {

            message.textContent = "Please fill all fields.";
            message.className = "form-message error";

            return;
        }

        if (password.length < 6) {

            message.textContent = "Password must contain at least 6 characters.";
            message.className = "form-message error";

            return;
        }

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";
            message.className = "form-message error";

            return;
        }


        try {

            message.textContent = "Creating your account...";
            message.className = "form-message";


            // Create Firebase account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            // Get newly created user
            const user = userCredential.user;


            // Save user's name in Firebase Auth profile
            await updateProfile(user, {
                displayName: name
            });


            message.textContent =
                "Account created successfully!";

            message.className = "form-message success";


            // Move to login page after 1.5 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);


        } catch (error) {

            console.error(error);

            message.textContent =
                getFirebaseErrorMessage(error);

            message.className = "form-message error";
        }

    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        if (!email || !password) {

            message.textContent =
                "Please fill all fields.";

            message.className =
                "form-message error";

            return;
        }


        try {

            message.textContent =
                "Logging in...";

            message.className =
                "form-message";


            // Firebase Login
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            message.textContent =
                "Login successful!";

            message.className =
                "form-message success";


            // Temporary redirect
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                getFirebaseErrorMessage(error);

            message.className =
                "form-message error";
        }

    });
}


// ===============================
// FORGOT PASSWORD
// ===============================

const forgotPassword =
    document.querySelector(".forgot-password");

if (forgotPassword) {

    forgotPassword.addEventListener("click", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const message =
            document.getElementById("loginMessage");


        if (!email) {

            message.textContent =
                "Enter your email address first.";

            message.className =
                "form-message error";

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            message.textContent =
                "Password reset email sent. Check your inbox.";

            message.className =
                "form-message success";


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to send reset email. Please check your email.";

            message.className =
                "form-message error";
        }

    });
}


// ===============================
// Initialize Password Toggles
// ===============================

setupPasswordToggle(
    "loginPasswordToggle",
    "loginPassword"
);

setupPasswordToggle(
    "registerPasswordToggle",
    "registerPassword"
);

setupPasswordToggle(
    "confirmPasswordToggle",
    "confirmPassword"
);