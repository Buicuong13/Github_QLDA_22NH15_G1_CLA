import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  try {
    const apiRes = await axios.post(
      "http://127.0.0.1:1234/v1/chat/completions", 
      {
        model: "gemma-3-12b-it", 
        messages: [{ role: "user", content: question }]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const answer = apiRes.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Lỗi gọi LM Studio:", error.message);
    res.status(500).json({ answer: "Lỗi khi gọi LM Studio API." });
  }
});

export default router;
