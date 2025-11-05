import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// Lazily initialize the Gemini client to avoid read-order issues with dotenv
let genAI = null;
function getClient() {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key from env:', apiKey ? 'Present' : 'Missing');
  if (!apiKey) {
    // Throwing here will surface a clear error when generation is requested
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  // The library accepts an options object with an apiKey property
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  return genAI;
}

/**
 * Generate a structured lesson with questions using Gemini AI
 * @param {string} topic - The topic to generate lesson for
 * @param {string} difficulty - Difficulty level (Beginner, Intermediate, Advanced)
 * @param {number} questionCount - Number of questions to generate (default: 5)
 * @returns {Promise<Object>} Generated lesson data
 */
async function generateLesson(
  topic,
  difficulty = 'Beginner',
  questionCount = 5
) {
  try {
    const prompt = `Generate a comprehensive educational lesson on "${topic}" at ${difficulty} level.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "skillName": "lesson title",
  "skillIcon": "relevant emoji",
  "category": "one of: Marketing, Development, Data, Business, Design, Other",
  "difficulty": "${difficulty}",
  "description": "2-3 sentence description",
  "duration": "estimated time like '15 min'",
  "questions": [
    {
      "question": "clear question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": 0,
      "explanation": "detailed explanation of the correct answer",
      "xpReward": 15
    }
  ]
}

Requirements:
- Generate exactly ${questionCount} questions
- Each question must have 4 options
- correctAnswer is the index (0-3) of the correct option
- Make questions progressively harder
- Include practical examples in explanations
- Vary XP rewards based on question difficulty (10-25 XP)
- Ensure all content is accurate and educational

Return ONLY the JSON object, no additional text.`;

    const result = await getClient().models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });
    const text = result.text;

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const lessonData = JSON.parse(cleanedText);

    // Validate the structure
    if (!lessonData.questions || !Array.isArray(lessonData.questions)) {
      throw new Error('Invalid lesson structure: missing questions array');
    }

    return lessonData;
  } catch (error) {
    console.error('Error generating lesson with Gemini:', error);
    throw new Error(`Failed to generate lesson: ${error.message}`);
  }
}

/**
 * Generate a list of lesson titles/outlines for a topic
 * @param {string} topic - The main topic/skill to learn
 * @param {number} count - Number of lesson titles to generate (default: 10)
 * @returns {Promise<Array>} Array of lesson outlines
 */
async function generateLessonOutlines(topic, count = 10) {
  try {
    const prompt = `Generate ${count} progressive lesson titles for learning "${topic}".

The lessons should progress from BEGINNER to ADVANCED level naturally:
- Lessons 1-4: Beginner level (fundamentals, basics)
- Lessons 5-7: Intermediate level (practical applications, deeper concepts)
- Lessons 8-10: Advanced level (complex topics, optimization, best practices)

Return ONLY valid JSON (no markdown, no code blocks) as an array:
[
  {
    "skillName": "Lesson title",
    "skillIcon": "relevant emoji",
    "description": "1-2 sentence description of what will be learned",
    "duration": "estimated time"
  }
]

Requirements:
- Lessons should progress logically from basics to advanced concepts
- Each lesson should build on previous ones
- Make titles engaging and clear
- Beginner lessons: 10-15 min, Intermediate: 20-25 min, Advanced: 25-30 min
- Ensure practical, real-world applicability
- Use appropriate emojis for each lesson

Return ONLY the JSON array, no additional text.`;

    const result = await getClient().models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });
    const text = result.text;

    // Clean the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const outlines = JSON.parse(cleanedText);

    if (!Array.isArray(outlines)) {
      throw new Error('Invalid response: expected array of lesson outlines');
    }

    return outlines;
  } catch (error) {
    console.error('Error generating lesson outlines with Gemini:', error);
    throw new Error(`Failed to generate lesson outlines: ${error.message}`);
  }
}

/**
 * Determine the best category for a topic
 * @param {string} topic - The topic to categorize
 * @returns {Promise<Object>} Category and additional metadata
 */
async function categorizeTopic(topic) {
  try {
    const prompt = `Analyze this learning topic: "${topic}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "category": "one of: Marketing, Development, Data, Business, Design, Other",
  "difficulty": "one of: Beginner, Intermediate, Advanced",
  "skillIcon": "single relevant emoji",
  "suggestedDuration": "estimated time like '15 min'"
}

Return ONLY the JSON object, no additional text.`;

    const result = await getClient().models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });
    const text = result.text;

    // Clean the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error categorizing topic with Gemini:', error);
    // Return defaults if AI fails
    return {
      category: 'Other',
      difficulty: 'Beginner',
      skillIcon: '📚',
      suggestedDuration: '15 min',
    };
  }
}

export { generateLesson, generateLessonOutlines, categorizeTopic };
