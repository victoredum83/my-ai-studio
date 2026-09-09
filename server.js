const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Replicate = require('replicate');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is missing from environment variables!");
    }

    if (mode === 'image') {
      const output = await replicate.run("black-forest-labs/flux-schnell", {
        input: { prompt: prompt }
      });
      res.json({ url: output[0] });

    } else {
      const output = await replicate.run(
        "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a2e0b0ffdc1b8385b5d",
        {
          input: {
            input_image: "https://picsum.photos/500/500",
            fps: 6,
            motion_bucket_id: 127
          }
        }
      );
      
      let videoUrl = output;
      if (Array.isArray(output)) {
        videoUrl = output[0];
      }

      res.json({ url: videoUrl });
    }

  } catch (error) {
    console.error('Generation Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate media' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
