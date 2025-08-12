
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env.local file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getAIRecommendations(
  studentInfo: { researchInterests: string[]; challenges: string[] },
  researchers: any[]
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  console.log(studentInfo, researchers);

  const prompt = `
    You are an expert academic advisor. Your task is to match a student with the most suitable researchers based on their profile and needs.

    Student Information:
    - Research Interests: ${studentInfo.researchInterests.join(", ")}
    - Challenges: ${studentInfo.challenges.join(", ")}

    Available Researchers:
    ${researchers.map(r => `-${r.id}, name:${r.name}: ${r.title} at ${r.institution}, specializing in ${r.specialties.join(", ")}`).join("\n")}

    Please return a ranked list of the top 3 researchers who would be the best match for this student. For each recommended researcher, provide a "matchScore" (out of 100) and a brief explanation for why they are a good fit.

    IMPORTANT: Your response must be ONLY a valid JSON array of objects, without any markdown formatting, code blocks, or other text.
  `;

  let rawText = '';
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = await response.text();

    // Clean the response by removing potential markdown code block delimiters
    const cleanedText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    console.log("AI Recommendations:", cleanedText);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error calling Gemini API:", error, "Raw response was:", rawText);
    throw new Error("Failed to get AI recommendations.");
  }
}

export async function getAITopicSuggestions(studentProfile: { field: string; interests: string[] }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert academic advisor. Your task is to suggest innovative and relevant research topics for a student.

    Student Profile:
    - Field of Study: ${studentProfile.field}
    - Interests: ${studentProfile.interests.join(", ")}

    Please generate a list of 3 research topics. For each topic, provide:
    - A concise title.
    - A brief description.
    - A relevance score (out of 100).
    - A difficulty rating (Beginner, Intermediate, or Advanced).
    - An estimated duration.
    - A list of relevant keywords.
    - A trending score (out of 100).
    - A list of suggested methodologies.

    IMPORTANT: Your response must be ONLY a valid JSON array of objects, without any markdown formatting, code blocks, or other text.
  `;

  let rawText = '';
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = await response.text();

    const cleanedText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error calling Gemini API for topic suggestions:", error, "Raw response was:", rawText);
    throw new Error("Failed to get AI topic suggestions.");
  }
}
