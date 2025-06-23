import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { events, direction, summary, subject } = request.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a creative historian. The subject is: "${subject}". Here is a timeline of events (in order):\n${events.map(e => `- ${e.date}: ${e.summary}`).join("\n")}.\nThe current summary is: ${summary}\n\nYour task is to imagine 1-2 plausible events that could have happened ${direction === 'before' ? 'before the first event' : 'after the last event'} in this timeline, and then return a new JSON object with two keys:\n- 'new_events': an array of 1-2 new event objects (each with 'date', 'summary', and 'details'),\n- 'new_summary': an updated summary that incorporates the new events into the narrative.\nDo not include any text or markdown outside the JSON object.`;

    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();
    const jsonString = aiResponseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonString);
    response.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    response.status(500).json({ error: "Failed to extend timeline" });
  }
}
