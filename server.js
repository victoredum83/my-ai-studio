const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Replicate = require('replicate');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serves your index.html automatically

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Backend Route for generation requests
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (mode === 'image') {
      // Image Generation Model
      const output = await replicate.run("black-forest-labs/flux-schnell", {
        input: { prompt: prompt }
      });
      res.json({ url: output[0] });

    } else {
      // Real AI Video Generation Model (Wan 2.2 Fast)
      const output = await replicate.run("wan-video/wan-2.2-t2v-fast", {
        input: { 
          prompt: prompt,
          go_fast: true,
          resolution: "480p",
          aspect_ratio: "16:9"
        }
      });
      
      // Replicate video models return a direct URL to the mp4 file
      res.json({ url: output });
    }

  } catch (error) {
    console.error('Error generating AI media:', error);
    res.status(500).json({ error: 'Failed to generate media' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
