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
  "content": "The full blog post content in semantic HTML. Use <h2> for subheadings (do not use h1), <p> for paragraphs, <strong> for emphasis, <em> for italics, and <blockquote> for distinguished quotes. Ensure the output is clean, professional, and ready for a rich text editor.",
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

Remember to return only valid JSON with title, content (formatted as semantic HTML), tags, and category fields. Avoid using <h1> inside the content field; use <h2> for main subheaders.`;
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

/**
 * Generate a concise summary of a blog post
 */
const summarizePost = async (content) => {
  if (!groq) {
    throw Object.assign(new Error('AI service is not configured.'), { statusCode: 503 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: config.ai.model,
      messages: [
        { 
          role: 'system', 
          content: 'You are an editorial assistant. Summarize the following blog post content into a single, punchy, and engaging paragraph (max 150 words). Maintain the tone of the original piece.' 
        },
        { role: 'user', content: `Summarize this: ${content}` },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    return response.choices?.[0]?.message?.content || 'No summary available.';
  } catch (error) {
    throw Object.assign(new Error('Summary generation failed: ' + error.message), { statusCode: 502 });
  }
};

/**
 * Generate an AI reply to a comment
 */
const generateReply = async (postContent, userComment) => {
  if (!groq) {
    throw Object.assign(new Error('AI service is not configured.'), { statusCode: 503 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: config.ai.model,
      messages: [
        { 
          role: 'system', 
          content: 'You are the author of a blog post. Write a brief, thoughtful, and professional reply to a user comment. Be appreciative but concise.' 
        },
        { 
          role: 'user', 
          content: `Post Context: ${postContent}\n\nUser Comment: ${userComment}\n\nDraft a reply:` 
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices?.[0]?.message?.content || 'No reply generated.';
  } catch (error) {
    throw Object.assign(new Error('Reply generation failed: ' + error.message), { statusCode: 502 });
  }
};

module.exports = { generateBlogPost, summarizePost, generateReply };
