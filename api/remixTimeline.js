import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { shuffledSummaries, subject } = request.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an alternate-history storyteller. 
Write a short, readable narrative about "${subject}" that describes the following events as if they happened in the exact order listed, 
one after another, even if this order is impossible or illogical. 
Ignore the original dates and sequence of the events, and instead focus on creating a compelling narrative that connects them.
Do not explain, justify, or reference the unusual order. 
Do not use phrases like "before this," or "earlier," 
Simply tell the story as if each event happened after the previous one, no matter what. 
Embrace the strangeness and do not try to make sense of it, rather, focus on creating a compelling narrative 
that connects these events in a way that feels natural and engaging.
Keep in mind that the text should read as a historical account, not a fictional story.
When an event is followed, or follows, another event that is impossible or illogical, like being born after dying, 
try to create a narrative that makes it feel like a natural progression, 
even if it defies logic or historical accuracy. In this world, some science fiction or magic elements may exist, 
but they should be presented as if they are part of the historical record, 
and only if they are needed to explain the events listed. For example, if a character appears to have died but is later mentioned as alive, 
you might mention that they were resurrected, or they faked their death, or that they were a clone, but do not dwell on the mechanics of how this happened. 
Focus instead on the implications of these events and how they shape the world you are describing.
Do not use markdown, bullet points, or headings—just write a continuous narrative in less than 350 words.

Events (in order):
${shuffledSummaries}
`;

    console.log("Prompt for remixing summary:", prompt);
    const result = await model.generateContent(prompt);
    const remixedSummary = result.response.text();

    response.status(200).json({ summary: remixedSummary });
  } catch (error) {
    console.error("API Error:", error);
    response.status(500).json({ error: "Failed to remix summary" });
  }
}
