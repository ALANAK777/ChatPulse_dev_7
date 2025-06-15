import { env } from "@/env.mjs";
import OpenAI from "openai";

const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY,
  baseURL: "https://api.fireworks.ai/inference/v1",
});
export default fireworks;
