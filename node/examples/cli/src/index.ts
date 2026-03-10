import { genkit } from "genkit";
import { AgenticLoop } from "toten";
import { createTools } from "./tools";
import { vertexAI } from "@genkit-ai/google-genai";

const DEFAULT_GOAL =
  "What is the current weather in London and Paris? Also tell me the current UTC time.";

async function main(): Promise<void> {

  const goal = process.argv.slice(2).join(" ") || DEFAULT_GOAL;

  const ai = genkit({
    plugins: [vertexAI()],
    model: vertexAI.model('gemini-2.0-flash-lite')
  });

  const tools = createTools(ai);
  const loop = new AgenticLoop({ ai, tools });

  console.log(`Goal: ${goal}\n`);

  const result = await loop.loop({ goal, maxIterations: 6 });

  console.log("\n=== RESULT ===");
  console.log(result.finalAnswer);
  console.log("\n=== LOOP TRACE ===");
  console.log(JSON.stringify(result.state, null, 2));
}

main().catch((error) => {
  console.error("Example failed:", error);
  process.exit(1);
});
