const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("SmartPrep AI Backend is running!");
});

app.post("/api/guidance", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        let response;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-3.7-flash",
                    contents: prompt
                });

                break;

            } catch (error) {
                console.log(`Gemini attempt ${attempt} failed`);

                if (attempt === 3) {
                    throw error;
                }

                const delay = attempt * 3000;

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );
            }
        }

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SmartPrep AI Backend running on port ${PORT}`);
});