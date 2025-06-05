import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);
  // console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
  try {
    const apiRes = await axios.post(
      "http://127.0.0.1:1234/v1/chat/completions",
      {
        model: "microsoft/phi-4-mini-reasoning",
        messages: [{ role: "user", content: question }]
      },
      {
        headers: {
          // "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const answer = apiRes.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ answer: "Lỗi khi gọi OpenAI API." });
  }
});

export default router;