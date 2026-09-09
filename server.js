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
      const output = await replicate.run("black-forest-labs/flux-schnell", {
        input: { prompt: prompt }
      });
      res.json({ url: output[0] });
    } else {
      // Video placeholder endpoint (or plug a video model like Luma/Runway here later)
      res.json({ url: "https://www.w3schools.com/html/mov_bbb.mp4" });
    }
  } catch (error) {
    console.error('Error generating AI media:', error);
    res.status(500).json({ error: 'Failed to generate media' });
  }
});

// Render dynamically assigns a port, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});