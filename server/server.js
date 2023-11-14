require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
const port = 3000;

const setting = {
  temperature: 1,
  max_tokens: 300,
  top_p: 1,
  frequency_penalty: 0.94,
  presence_penalty: 0.1,
};

try {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  app.use(express.json());
  app.use(cors());

  app.get("/a", (req, res) => {
    res.send("Server is up and running");
  });

  app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        ...setting,
      });

      const reply = completion.data.choices[0].message.content;

      res.json({ reply });
    } catch (error) {
      if (error.response) {
        console.error("OpenAI Response Data:", error.response.data);
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
