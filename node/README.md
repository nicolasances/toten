# ToteN — Node.js / TypeScript

This package provides the Node.js implementation of ToteN. For a language-agnostic overview of the core concepts, see the [root README](../README.md).

## Table of Contents

- [Using the AgenticLoop](#using-the-agenticloop)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [Creating an Agentic Loop](#creating-an-agentic-loop)
    - [Constructor](#constructor)
    - [`loop(input)` method](#loopinput-method)
  - [Defining tools](#defining-tools)
  - [Runnable example](#runnable-example)
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
new AgenticLoop({ ai, tools, correlationId? })
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ai` | `Genkit` | ✓ | A configured Genkit instance. |
| `tools` | `ToolAction[]` | ✓ | The tools the agent can call. |
| `correlationId` | `string` | — | Optional tracing ID. A UUID is generated if omitted. |

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

### Runnable example

A fully working CLI example is available in [`examples/cli`](examples/cli/README.md). It uses Google Vertex AI and two mock tools (`getWeather` and `getCurrentTime`).

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
