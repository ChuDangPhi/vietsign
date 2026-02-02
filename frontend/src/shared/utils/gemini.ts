import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateContent(prompt: string) {
    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw error;
    }
}
