const groq = require('../config/openai');
const Prompt = require('../models/Prompt.model');
const Usage = require('../models/Usage.model');

const SYSTEM_PROMPTS = {
  generate: 'You are a helpful AI assistant. Generate clear, well-structured content based on the user prompt.',
  summarize: 'You are a summarization expert. Summarize the given text concisely, keeping key points.',
  explain: 'You are a code explainer. Explain the given code in simple terms, line by line if needed.',
};

const handleAI = async (req, res) => {
  try {
    const { prompt, tool } = req.body;

    if (!prompt || !tool) {
      return res.status(400).json({ success: false, message: 'Please provide prompt and tool' });
    }

    if (!['generate', 'summarize', 'explain'].includes(tool)) {
      return res.status(400).json({ success: false, message: 'Invalid tool. Use: generate, summarize, explain' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[tool] },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage.total_tokens;
    const today = new Date().toISOString().split('T')[0];

    await Prompt.create({
      userId: req.user._id,
      tool,
      prompt,
      response,
      tokensUsed,
    });

    await Usage.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { tokensUsed, requestCount: 1 } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        response,
        tokensUsed,
        tokensToday: req.tokensToday + tokensUsed,
        dailyLimit: req.dailyLimit,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { handleAI };
