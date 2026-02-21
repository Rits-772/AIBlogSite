const config = require('../config/env');
const Groq = require('groq-sdk');

const groq = config.ai.apiKey ? new Groq({ apiKey: config.ai.apiKey }) : null;

/**
 * AI Service — abstraction layer for external AI provider (Groq).
 */

/**
 * Build the system prompt for editorial blog generation
 */
const buildSystemPrompt = () => {
  return `You are an expert editorial writer for "Midnight Typewriter", a literary publishing platform.
Your writing should be:
- Thoughtful and well-structured
- Rich in vocabulary but accessible
- Free from generic AI patterns and clichés
- Written with strong narrative voice

Format your response as JSON with the following structure:
{
  "title": "A compelling, editorial-quality title",
  "content": "The full blog post content with proper paragraphs",
  "tags": ["relevant", "tags"],
  "category": "appropriate category"
}

Important: Return ONLY valid JSON. No markdown code fences, no explanations outside the JSON.`;
};

/**
 * Build the user prompt from input parameters
 */
const buildUserPrompt = ({ topic, tone, wordCount }) => {
  return `Write a blog post about: ${topic}

Tone: ${tone || 'thoughtful'}
Target word count: ${wordCount || 800}

Remember to return only valid JSON with title, content, tags, and category fields.`;
};

/**
 * Generate a blog post using Groq
 */
const generateBlogPost = async ({ topic, tone, wordCount }) => {
  if (!groq) {
    throw Object.assign(new Error('AI service is not configured. Please set GROQ_API_KEY.'), {
      statusCode: 503,
    });
  }

  try {
    const response = await groq.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt({ topic, tone, wordCount }) },
      ],
      temperature: 0.7,
      max_tokens: Math.min((wordCount || 800) * 2, 4000),
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw Object.assign(new Error('AI provider returned empty response'), {
        statusCode: 502,
      });
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      // Fallback
      parsed = {
        title: topic,
        content: rawContent,
        tags: [],
        category: 'uncategorized',
      };
    }

    return {
      title: parsed.title || topic,
      content: parsed.content || rawContent,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      category: parsed.category || 'uncategorized',
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw Object.assign(new Error('Failed to generate post with Groq: ' + error.message), {
      statusCode: 502,
    });
  }
};

module.exports = { generateBlogPost };
