import { genkit } from "genkit";
import { AgenticLoop } from "toten";
import { createTools } from "./tools";
import { vertexAI } from "@genkit-ai/google-genai";

const DEFAULT_GOAL =
  "What is in the supermarket list?";

async function main(): Promise<void> {

  const goal = process.argv.slice(2).join(" ") || DEFAULT_GOAL;

  const ai = genkit({
    plugins: [vertexAI()],
    model: vertexAI.model('gemini-2.0-flash')
  });

  const tools = createTools(ai);
  const loop = new AgenticLoop({
    ai,
    tools,
    additionalInstructions: `
      If the user is naming items to add or remove from the list follow THESE VERY IMPORTANT CONSIDERATIONS; 
        - The list could come from a speech-to-text transcription and might contain errors. Some items might have been pronounced in Danish or Italian and the translation might be wrong. 
        - BEFORE adding an item to the list, if the item could be a Danish mispelling, check if you find it in the common supermarket items list. If you find something similar, use that one. 
    `
  });

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
