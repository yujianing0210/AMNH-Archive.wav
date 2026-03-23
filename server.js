const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

function parseModelJson(content) {
  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

function normalizeModelResult(raw) {
  const {
    reasoning_summary,
    bpm,
    scale,
    synth_type,
    reverb_size,
    rhythm_density,
    register,
  } = raw;

  const fallbackReasoning = [
    `The tempo is set to ${bpm} BPM to reflect the object's overall historical character and emotional intensity.`,
    `The ${scale} scale and ${synth_type} waveform were selected to align with the cultural mood and perceived material texture.`,
    `A reverb size of ${reverb_size}, ${rhythm_density} rhythmic density, and a ${register} register are used to shape spatial depth and sonic focus.`,
  ].join(' ');

  return {
    params: {
      bpm,
      scale,
      synth_type,
      reverb_size,
      rhythm_density,
      register,
    },
    reasoning: reasoning_summary || fallbackReasoning,
  };
}

async function callOpenAI(messages) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on the server. Check your .env file.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `OpenAI HTTP ${response.status}`;
    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('The model did not return any content.');
  }

  return normalizeModelResult(parseModelJson(content));
}

app.post('/api/generate-from-metadata', async (req, res) => {
  try {
    const { metadata, systemPrompt } = req.body || {};
    if (!metadata || !systemPrompt) {
      return res.status(400).json({ error: { message: 'Missing metadata or systemPrompt.' } });
    }

    const result = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(metadata) },
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});

app.post('/api/generate-from-image', async (req, res) => {
  try {
    const { imageDataUrl, systemPrompt } = req.body || {};
    if (!imageDataUrl || !systemPrompt) {
      return res.status(400).json({ error: { message: 'Missing imageDataUrl or systemPrompt.' } });
    }

    const result = await callOpenAI([
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'This image was not found in the database. Analyze the visual content directly and return the parameter JSON.',
          },
          {
            type: 'image_url',
            image_url: { url: imageDataUrl },
          },
        ],
      },
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
