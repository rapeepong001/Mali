require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend from /public
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable. Set it in your environment or Railway variables.');
  // Do not exit in this environment to allow health checks, but warn loudly.
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    // Log useful debug info without exposing secrets
    try {
      console.error('OpenAI API error message:', err.message);
      if (err.response && err.response.status) {
        console.error('OpenAI response status:', err.response.status);
      }
      if (err.response && err.response.data) {
        console.error('OpenAI response data:', JSON.stringify(err.response.data));
      }
    } catch (logErr) {
      console.error('Error while logging OpenAI error:', logErr);
    }
    res.status(500).json({ error: 'OpenAI API failed', message: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Mali Proxy Server running on http://localhost:${PORT}`);
});