const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');

const analyzeCompany = async (data) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key is missing');

  // Initialize the Langchain Google GenAI chat model
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: apiKey,
    temperature: 0.2
  });

  // Use PromptTemplate for the structured prompt
  const template = `You are an expert investment research analyst.
Analyze the company using the provided structured context data (company fundamentals and recent news).
Give a clear recommendation: INVEST, PASS, or WATCHLIST.
Do not give generic advice.
Use only the provided data.
If some data is missing, clearly mention it in the analysis.
Return only valid JSON.

JSON format:
{{
  "decision": "INVEST or PASS or WATCHLIST",
  "confidence": 0-100,
  "summary": "short summary of the company state",
  "keyReasons": ["reason 1", "reason 2", "reason 3"],
  "risks": ["risk 1", "risk 2"],
  "newsSummary": "summary of latest news impact",
  "finalVerdict": "final practical recommendation"
}}

Data:
{data}`;

  const prompt = PromptTemplate.fromTemplate(template);

  // Create a Langchain Runnable Sequence
  const chain = prompt.pipe(model);

  try {
    const result = await chain.invoke({
      data: JSON.stringify(data, null, 2)
    });
    
    let responseText = result.content;
    if (typeof responseText !== 'string') {
        responseText = responseText.toString();
    }
    
    // Clean up potential markdown formatting from JSON output
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini output as JSON", error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = { analyzeCompany };
