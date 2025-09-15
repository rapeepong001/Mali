require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
const { buildHeartPrompt } = require('./server_persona');

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

// In-memory simple memory: { userIdOrName: { name: "...", lastSeen: timestamp } }
const userMemory = {};

app.post('/api/chat', async (req, res) => {
  const { prompt, character, userName } = req.body;
  // record userName in memory if provided
  if (userName) {
    userMemory[userName] = { name: userName, lastSeen: Date.now() };
  }
  const effectiveUser = userName || (prompt && prompt._user) || null;
  const userKey = effectiveUser || 'anonymous';

  const { system, user } = buildHeartPrompt(character || 'Momo', effectiveUser, prompt);
  
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  if (!process.env.OPENAI_API_KEY) {
    // Provide a friendly error so the frontend can show a clear message
    return res.status(503).json({ error: 'missing_api_key', message: 'Server not configured: OPENAI_API_KEY is missing. Please set the environment variable.' });
  }

  try {
    // OpenAI v4 client: send a system message with persona context + the user message
    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ];
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });
    // The v4 response shape nests the output differently
    const reply = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
      ? response.choices[0].message.content
      : (response.choices && response.choices[0] && response.choices[0].text) || '';
  // Optionally update memory or other state here
  res.json({ reply });
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