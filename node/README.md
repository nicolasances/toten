# ToteN — Node.js / TypeScript

This package provides the Node.js implementation of ToteN. For a language-agnostic overview of the core concepts, see the [root README](../README.md).

## Table of Contents

- [Using the AgenticLoop](#using-the-agenticloop)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [Creating an Agentic Loop](#creating-an-agentic-loop)
    - [Constructor](#constructor)
    - [`loop(input)` method](#loopinput-method)
  - [Custom instructions](#custom-instructions)
    - [Identity](#identity)
    - [Personality](#personality)
    - [Additional instructions](#additional-instructions)
  - [Defining tools](#defining-tools)
  - [Runnable examples](#runnable-examples)
- [Building and Publishing to NPM](#building-and-publishing-to-npm)
  - [Build](#build)
  - [Type-check without emitting](#type-check-without-emitting)
  - [Publish](#publish)

## Using the AgenticLoop

### Installation

```bash
npm install toten
```

### Quick start

```typescript
import { genkit, z } from "genkit";
import { vertexAI } from "@genkit-ai/google-genai";
import { AgenticLoop } from "toten";

// 1. Create a Genkit instance with the AI model you want to use.
const ai = genkit({
  plugins: [vertexAI()],
  model: vertexAI.model("gemini-2.0-flash-lite"),
});

// 2. Define the tools the agent is allowed to call.
const myTool = ai.defineTool(
  {
    name: "getCurrentTime",
    description: "Returns the current UTC date and time.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      utcDateTime: z.string(),
    }),
  },
  async () => ({ utcDateTime: new Date().toISOString() })
);

// 3. Instantiate the loop and run it.
const loop = new AgenticLoop({ ai, tools: [myTool] });

const result = await loop.loop({
  goal: "What is the current UTC time?",
});

console.log(result.finalAnswer); // The agent's final answer
console.log(result.done);        // true when the goal was fulfilled
console.log(result.state);       // Full execution trace
```

### Creating an Agentic Loop

#### Constructor

```typescript
new AgenticLoop({ ai, tools, correlationId?, identity?, personality?, additionalInstructions? })
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ai` | `Genkit` | ✓ | A configured Genkit instance. |
| `tools` | `ToolAction[]` | ✓ | The tools the agent can call. |
| `correlationId` | `string` | — | Optional tracing ID. A UUID is generated if omitted. |
| `identity` | `string` | — | Replaces the default identity in the Act system prompt (e.g. "You are a Supermarket Assistant agent"). Defaults to "You are a helpful AI agent." |
| `personality` | `string` | — | Replaces the default personality in the Act system prompt to give the agent a specific style or tone. |
| `additionalInstructions` | `string` | — | Appended to the Plan user prompt to inject domain-specific rules or constraints for the Planner. |

#### `loop(input)` method

```typescript
const result = await loop.loop(input);
```

**Input**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `goal` | `string` | ✓ | The objective the agent should achieve. |
| `context` | `string[]` | — | Optional background information passed to every phase. |
| `maxIterations` | `number` | — | Maximum number of Plan→Act→Critic cycles (default: `6`). |

**Output** (`AgentLoopResult`)

| Field | Type | Description |
|-------|------|-------------|
| `done` | `boolean` | `true` when the Critic marked the goal as fulfilled. |
| `finalAnswer` | `string` | The agent's final answer (or a timeout message). |
| `state` | `AgentLoopState` | Full execution state including the history of every iteration. |

### Custom instructions

The three constructor parameters `identity`, `personality`, and `additionalInstructions` let you tailor the agent's behavior without modifying any prompts directly.

#### Identity

`identity` replaces the default `"You are a helpful AI agent."` line in the Act system prompt. Use it to give the agent a clear role or persona.

```typescript
const loop = new AgenticLoop({
  ai,
  tools,
  identity: "You are a supermarket assistant agent. You help users manage their shopping list.",
});
```

#### Personality

`personality` replaces the default `"Be professional, concise, and directly useful."` line in the Act system prompt. Use it to control the agent's tone and communication style.

```typescript
const loop = new AgenticLoop({
  ai,
  tools,
  personality: "Be friendly and warm. Use simple language and keep answers short.",
});
```

#### Additional instructions

`additionalInstructions` is appended to the Planner's prompt at runtime. Use it to inject domain-specific rules, constraints, or heuristics that should guide every planning step — without changing the agent's identity or tone.

```typescript
const loop = new AgenticLoop({
  ai,
  tools,
  additionalInstructions: `
    Before adding an item to the list, check the common items list for similar entries
    to avoid duplicates caused by spelling variations.
  `,
});
```

All three can be combined freely:

```typescript
const loop = new AgenticLoop({
  ai,
  tools,
  identity: "You are a supermarket assistant agent.",
  personality: "Be friendly and use simple language.",
  additionalInstructions: "Always confirm with the user before removing items from the list.",
});
```

### Defining tools

Tools are defined with the Genkit `ai.defineTool()` API. Each tool needs:

- A **name** — used internally to identify the tool.
- A **description** — read by the Planner to decide when to use the tool.
- An **inputSchema** and **outputSchema** — Zod schemas describing the tool's inputs and outputs.
- An **async handler** — the function that performs the actual work.

```typescript
import { z } from "genkit";

const getWeather = ai.defineTool(
  {
    name: "getWeather",
    description: "Returns the current weather for a given city.",
    inputSchema: z.object({
      city: z.string().describe("The name of the city."),
    }),
    outputSchema: z.object({
      condition: z.string(),
      temperatureCelsius: z.number(),
    }),
  },
  async ({ city }) => {
    // Call a real weather API here.
    return { condition: "Sunny", temperatureCelsius: 22 };
  }
);
```

Pass the tool to the loop:

```typescript
const loop = new AgenticLoop({ ai, tools: [getWeather] });
```

### Runnable examples

- **[`examples/cli`](examples/cli/README.md)** — basic CLI demo using Google Vertex AI with two mock tools (`getWeather` and `getCurrentTime`).
- **[`examples/instruct`](examples/instruct/README.md)** — demonstrates custom instructions (`identity`, `personality`, `additionalInstructions`) with a supermarket list agent.

---

## Building and Publishing to NPM

### Build

The package is written in TypeScript. Compile it to JavaScript before publishing:

```bash
npm run build
```

This runs `tsc` and outputs compiled JavaScript and type declarations to the `dist/` directory. Only the `dist/` folder is included in the published package.

### Type-check without emitting

```bash
npm run typecheck
```

### Publish

Bump the version in `package.json` to the next appropriate semver version, then publish:

```bash
npm publish
```

> Make sure you are logged in to NPM (`npm login`) and that the version has not already been published before running `npm publish`.
