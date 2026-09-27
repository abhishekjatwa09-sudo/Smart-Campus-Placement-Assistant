const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

exports.setAdminClaim = onCall(async (request) => {

    // User login hona chahiye
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "You must be logged in."
        );
    }

    // YAHAN APNA ADMIN EMAIL LIKHNA HAI
    const adminEmail = "abhishekjatwa09@gmail.com";

    if (request.auth.token.email !== adminEmail) {
        throw new HttpsError(
            "permission-denied",
            "You are not authorized to become an admin."
        );
    }

    // Admin claim set karo
    await getAuth().setCustomUserClaims(
        request.auth.uid,
        {
            admin: true
        }
    );

    return {
        success: true,
        message: "Admin role granted successfully."
    };
});