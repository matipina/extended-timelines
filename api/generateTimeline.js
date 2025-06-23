import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { articleText } = request.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze the following text. Your task is to return a single, valid JSON object. 
    This object must have two keys: "overall_summary" and "events".
    - "events" should be an array of objects, where each object has a "date" (string) and a "summary" (string, max 10 words).
    The events must be in chronological order, and they should be the most relevant items of the article. 
    Do not include any text or markdown formatting outside of the JSON object.
    - "overall_summary" should be a well-developed, engaging, and imaginative summary of the entire text, written in a narrative style, mentioning all of the previously mentioned events in a cohesive and creative way. The summary should read like a short, compelling article, not just a list of facts.

    Text:
    """
    ${articleText}
    """`;

    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonString = aiResponseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonString);

    response.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    response.status(500).json({ error: "Failed to generate timeline" });
  }
}
