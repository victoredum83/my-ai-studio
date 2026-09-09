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

    if (mode === 'image') {
      const output = await replicate.run("black-forest-labs/flux-schnell", {
        input: { prompt: prompt }
      });
      res.json({ url: output[0] });

    } else {
      // Create a prediction and explicitly wait for it to finish safely
      const prediction = await replicate.predictions.create({
        model: "wan-video/wan-2.2-t2v-fast",
        input: { 
          prompt: prompt,
          go_fast: true,
          resolution: "480p",
          aspect_ratio: "16:9"
        }
      });

      // Poll/wait until the prediction status is completed
      let result = await replicate.predictions.get(prediction.id);
      while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        result = await replicate.predictions.get(prediction.id);
      }

      if (result.status === "failed") {
        throw new Error("Video generation failed on Replicate.");
      }

      let videoUrl = result.output;
      if (Array.isArray(result.output)) {
        videoUrl = result.output[0];
      }

      res.json({ url: videoUrl });
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
