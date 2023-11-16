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
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      });

      const reply = response.data.choices[0].message.content;
      console.log(reply);
      res.json({ reply });
    } catch (error) {
      console.log("Error Message:", error.message);
      if (error.response) {
        console.error("OpenAI Response Data:", error.response.data);
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  let continueProcessing = true;

  app.post("/stream", async (req, res) => {
    continueProcessing = true;

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // flush the headers to establish SSE with client

    const { message } = req.body;

    const response = openai.createChatCompletion(
      {
        model: "gpt-4",
        stream: true,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      },
      { responseType: "stream" }
    );

    response.then((resp) => {
      let partialChunk = "";

      resp.data.on("data", (chunk) => {
        const rawData = `${partialChunk}${chunk}`.toString();
        const payloads = rawData.split("\n\n");

        // Keep the last incomplete payload for the next iteration
        partialChunk = payloads.pop() || "";

        for (const payload of payloads) {
          // if string includes '[DONE]'
          if (payload.includes("[DONE]") || !continueProcessing) {
            res.end(); // Close the connection and return
            return;
          }

          if (payload.startsWith("data:")) {
            // remove 'data: ' and parse the corresponding object
            try {
              const data = JSON.parse(payload.replace("data: ", ""));
              const text = data.choices[0].delta?.content;
              if (text) {
                // send value of text to the client
                res.write(`${text}`);
              }
            } catch (error) {
              console.log(`Error with JSON.parse and ${payload}.\n${error}`);
            }
          }
        }
      });
    });
  });

  app.post("/stopProcessing", (req, res) => {
    continueProcessing = false;
    res.json({ message: "Processing stopped" });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
