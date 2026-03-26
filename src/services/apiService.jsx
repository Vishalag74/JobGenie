const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export const generateInterviewQuestions = async (role, count = 5, difficulty = 'Beginner') => {
  const prompt = `You MUST return ONLY valid JSON array format. No markdown, no explanation, no extra text.
Generate exactly ${count} ${difficulty.toLowerCase()}-level interview questions for a ${role} position.
Output format MUST be:
[{"text": "Question 1 here"}, {"text": "Question 2 here"}, {"text": "Question 3 here"}, {"text": "Question 4 here"}, {"text": "Question 5 here"}]

Return ONLY this JSON array. Do not add code blocks, explanations, or any text outside the array.`;

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
  const parseJsonSafe = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  questions = parseJsonSafe(generatedText);

  if (!questions) {
    // attempt to extract the array from any surrounding text
    const arrayMatch = generatedText.match(/\[([\s\S]*)\]/);
    if (arrayMatch) {
      questions = parseJsonSafe(arrayMatch[0]);
    }
  }

  const tryExtractQuestionsFromBlock = (text) => {
    if (!text || typeof text !== 'string') return null;

    const objectCandidates = Array.from(text.matchAll(/\{[\s\S]*?\}/g)).map(m => m[0]);
    const parsedObjects = objectCandidates
      .map((candidate) => {
        const js = parseJsonSafe(candidate);
        return js && js.text ? js : null;
      })
      .filter(Boolean);

    if (parsedObjects.length >= 1) {
      return parsedObjects;
    }

    const textMatches = Array.from(text.matchAll(/(?:"|')?text(?:"|')?\s*:\s*(?:"|')([^"']{5,})(?:"|')/gi));
    if (textMatches.length >= 1) {
      return textMatches.map((m, i) => ({ id: i+1, text: m[1].trim() }));
    }

    return null;
  };

  if ((!questions || !questions.length) && generatedText) {
    const extract = tryExtractQuestionsFromBlock(generatedText);
    if (extract) {
      questions = extract;
    }
  }

  const normalizeQuestions = (rawArray) => {
    return (Array.isArray(rawArray) ? rawArray : [])
      .map((q, i) => {
        if (!q || typeof q !== 'object') return null;
        const text = typeof q.text === 'string' ? q.text.trim() : '';
        return text.length > 0 ? { id: i + 1, text } : null;
      })
      .filter(Boolean)
      .map((q, i) => ({ ...q, id: i + 1 }));
  };

  if (questions) {
    questions = normalizeQuestions(questions);
  }

  if (!questions || questions.length < count) {
    console.warn("⚠️ Insufficient questions from JSON, attempting extraction...");
    const lines = generatedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 10 && !/^[\[\]{}",:\s]/.test(line));

    if (lines.length >= count) {
      questions = lines.slice(0, count).map((text, i) => ({ id: i + 1, text }));
    } else {
      const objectMatches = generatedText.match(/\{"text"\s*:\s*"([^"]+)"/gi) || [];
      if (objectMatches.length >= count) {
        questions = objectMatches.slice(0, count).map((match, i) => ({
          id: i + 1,
          text: match.replace(/\{"text"\s*:\s*"/, '').replace(/"$/, '')
        }));
      }
    }
  }

  if (!Array.isArray(questions)) {
    throw new Error('Invalid question format returned from API');
  }

  if (questions.length < count) {
    throw new Error(`Expected ${count} questions but only got ${questions.length}. Please try again.`);
  }

  return questions.slice(0, count);
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