const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const generateInterviewQuestions = async (role, count = 5, difficulty = 'Beginner') => {
  const prompt = `Generate ${count} ${difficulty.toLowerCase()}-level interview questions for a ${role} position.
  Make them specific to the role and include a mix of technical, behavioral, and situational questions appropriate for ${difficulty.toLowerCase()} candidates.
  Return ONLY a JSON array, nothing else. Format:
  [{"id": 1, "text": "Question here"}, {"id": 2, "text": "Another question"}]`;

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate questions');
  }

  const data = await response.json();
  let generatedText = data.candidates[0].content.parts[0].text.trim();

  // 🧹 Clean unwanted markdown/code fences
  generatedText = generatedText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^\s*{\s*|\s*}\s*$/g, (m) => m.includes("{") ? "[" : "]"); // in case AI wraps with {}

  let questions = [];
  try {
    questions = JSON.parse(generatedText);
  } catch (err) {
    console.warn("⚠️ JSON parse failed, fallback to line-split mode.");
    questions = generatedText
      .split("\n")
      .filter(q => q.trim())
      .map((q, i) => ({ id: i + 1, text: q }));
  }

  return questions.slice(0, count); // only first N questions
};

export const generateFeedback = async (role, answers) => {
  const answersText = Object.entries(answers)
    .map(([id, answer]) => `Q${id}: ${answer}`)
    .join('\n');

  const prompt = `As an AI interview coach, provide detailed feedback for a ${role} interview based on these answers:

${answersText}

Return ONLY a JSON object with these exact fields:
{
  "overallScore": number between 0-100,
  "summary": "1–2 sentence overall performance summary",
  "strengths": ["2-3 short strengths (max 6 words each)"],
  "improvements": ["2-3 short improvements (max 6 words each)"],
  "suggestions": "2-3 concise lines of actionable suggestions"
}`;

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate feedback');
  }

  const data = await response.json();
  let generatedText = data.candidates[0].content.parts[0].text.trim();

  // 🧹 Clean AI response
  generatedText = generatedText
    .replace(/```json/gi, "")
    .replace(/```/g, "");

  let feedback;
  try {
    feedback = JSON.parse(generatedText);
  } catch (err) {
    console.error("⚠️ JSON parse failed, raw output:", generatedText);
    throw new Error("Feedback format error. Please try again.");
  }

  return feedback;
};
