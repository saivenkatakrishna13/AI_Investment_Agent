const axios = require('axios');

/**
 * Service to generate investment analysis using NVIDIA NIM
 * Endpoint: https://integrate.api.nvidia.com/v1/chat/completions
 * Default Model: meta/llama-3.2-11b-vision-instruct
 */
const analyzeCompany = async (data) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('NVIDIA API key is missing. Please set NVIDIA_API_KEY in your backend/.env file.');
  }

  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

  const prompt = `You are an expert investment research analyst.
Analyze the company using the provided structured context data (company fundamentals and recent news).
Give a clear recommendation: INVEST, PASS, or WATCHLIST.
Do not give generic advice.
Use only the provided data.
If some data is missing, clearly mention it in the analysis.
Return ONLY valid JSON matching this schema with no markdown formatting, no code fences, and no surrounding commentary.

JSON Schema:
{
  "decision": "INVEST or PASS or WATCHLIST",
  "confidence": 85,
  "summary": "short summary of the company state",
  "keyReasons": ["reason 1", "reason 2", "reason 3"],
  "risks": ["risk 1", "risk 2"],
  "newsSummary": "summary of latest news impact",
  "finalVerdict": "final practical recommendation"
}

Context Data:
${JSON.stringify(data, null, 2)}`;

  try {
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional financial investment analyst. Respond strictly in valid JSON format matching the schema provided by the user. Do not include markdown code blocks or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000 // 45s timeout
      }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content || '';
    if (!rawContent) {
      throw new Error('Empty response received from NVIDIA NIM API');
    }

    // Clean potential markdown wrappers e.g. ```json ... ``` or ``` ... ```
    const cleanedJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch (parseErr) {
      // Fallback: extract substring matching first { to last }
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Failed to parse NVIDIA NIM response as JSON: ${parseErr.message}`);
      }
    }

    return {
      decision: parsed.decision || 'WATCHLIST',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 75,
      summary: parsed.summary || 'Summary unavailable.',
      keyReasons: Array.isArray(parsed.keyReasons) ? parsed.keyReasons : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      newsSummary: parsed.newsSummary || 'No recent news summary available.',
      finalVerdict: parsed.finalVerdict || parsed.summary || 'Analysis complete.',
      provider: `NVIDIA NIM (${model.split('/').pop()})`
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('NVIDIA NIM API request timed out after 45 seconds.');
    }

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      const apiMsg = errorData?.error?.message || errorData?.message || JSON.stringify(errorData);

      if (status === 401) {
        throw new Error('NVIDIA API Authentication Failed (401): Invalid or unauthorized API key. Please check your NVIDIA_API_KEY in backend/.env');
      } else if (status === 429) {
        throw new Error(`NVIDIA API Rate Limit Exceeded (429): ${apiMsg || 'Too many requests, please try again shortly.'}`);
      } else if (status === 404 || status === 410) {
        throw new Error(`NVIDIA Model Unavailable (${status}): The configured model "${model}" is unavailable or deprecated. Details: ${apiMsg}`);
      } else if (status >= 500) {
        throw new Error(`NVIDIA NIM Service Error (${status}): ${apiMsg || 'Remote service error from NVIDIA NIM.'}`);
      } else {
        throw new Error(`NVIDIA NIM API Error (${status}): ${apiMsg}`);
      }
    }

    if (error.request) {
      throw new Error(`Network error connecting to NVIDIA NIM API: ${error.message}`);
    }

    throw error;
  }
};

/**
 * Checks if a string contains Japanese characters (Hiragana or Katakana)
 */
const containsJapanese = (text) => {
  if (!text || typeof text !== 'string') return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
};

/**
 * Dynamically translates Japanese news articles (title and description) into English
 * using NVIDIA NIM. Preserves non-Japanese articles, source names, URLs, and dates.
 */
const translateJapaneseNews = async (articles) => {
  if (!Array.isArray(articles) || articles.length === 0) {
    return articles;
  }

  // Identify articles containing Japanese text in title or description
  const toTranslate = [];
  articles.forEach((art, index) => {
    if (containsJapanese(art.title) || containsJapanese(art.description)) {
      toTranslate.push({
        index,
        title: art.title || '',
        description: art.description || ''
      });
    }
  });

  // If no Japanese articles found, return immediately
  if (toTranslate.length === 0) {
    return articles;
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.warn('NVIDIA_API_KEY missing, skipping Japanese news translation');
    return articles;
  }

  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

  const prompt = `You are a professional financial news translator.
Translate the following Japanese news headlines and descriptions into clear, natural, professional English.
Preserve all company names (e.g. Apple, Spigen, FISCO), ticker symbols (e.g. AAPL), numbers, dates, and financial metrics accurately.
Do not invent information or add opinions.
Return ONLY a valid JSON array matching this schema with no markdown formatting or extra text:
[
  {
    "index": <number>,
    "title": "<translated English title>",
    "description": "<translated English description>"
  }
]

Articles to translate:
${JSON.stringify(toTranslate, null, 2)}`;

  try {
    console.log(`Translating ${toTranslate.length} Japanese news article(s) via NVIDIA NIM (${model})...`);
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional Japanese-to-English financial news translator. Respond strictly with a valid JSON array of translated objects. Do not include markdown code blocks or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content || '';
    if (!rawContent) {
      console.warn('Empty translation response from NVIDIA NIM');
      return articles;
    }

    const cleanedJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let translations = [];
    try {
      translations = JSON.parse(cleanedJson);
    } catch (parseErr) {
      const match = rawContent.match(/\[[\s\S]*\]/);
      if (match) {
        translations = JSON.parse(match[0]);
      } else {
        console.warn('Failed to parse translation JSON from NVIDIA NIM:', parseErr.message);
        return articles;
      }
    }

    if (!Array.isArray(translations)) {
      return articles;
    }

    // Merge translated title and description back into the articles
    const updatedArticles = articles.map((art, idx) => {
      const match = translations.find(t => t.index === idx);
      if (match) {
        return {
          ...art,
          title: match.title ? match.title.trim() : art.title,
          description: match.description ? match.description.trim() : art.description
        };
      }
      return art;
    });

    console.log(`Successfully translated ${toTranslate.length} Japanese article(s) to English.`);
    return updatedArticles;
  } catch (err) {
    console.error('Error during Japanese news translation via NVIDIA NIM:', err.message);
    // Graceful fallback: return original articles so the rest of the research request succeeds
    return articles;
  }
};

module.exports = { 
  analyzeCompany, 
  translateJapaneseNews, 
  containsJapanese 
};

