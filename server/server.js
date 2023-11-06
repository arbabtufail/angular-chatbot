require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
const port = 3000;

const configuration = new Configuration({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(cors());

app.get("/a", (req, res) => {
  res.send("Server is up and running");
});
app.post("/chat", async (req, res) => {
  console.log("chat fucntion is invoked");
  const { message } = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: message },
    ],
  });

  const reply = completion.data.choices[0].message.content;

  console.log("response is: ", reply);

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
