import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import OpenAI from "openai";

export const app = express();

dotenv.config();

app.use(express.json());

const client = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/api/hello", (req, res) => {
  res.send({ message: "Hello World!" });
});

// For list of available models check https://platform.openai.com/docs/models
app.post("/api/conversation", async (req, res) => {
  const messages = req.body;

  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).send({ message: "Messages cannot be empty!" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.send(response.choices[0].message);
  } catch (error) {
    console.error("Failed to get response!", error);

    res.status(500).send({ message: "Failed to get response!" });
  }
});

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Successfully connected to mongodb!");
    })
    .catch((error) => {
      console.error("Failed to connect to mongodb!", error);
    });
} else {
  console.warn("MONGO_URI is not set!");
}
