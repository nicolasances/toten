# Toten — Instruct Example

A runnable CLI demo showing how to use [custom instructions](../../README.md#custom-instructions) to shape the behavior of a Toten Agentic Loop agent.

The example builds a **supermarket list assistant** that can read, and add items to a shopping list. It uses `additionalInstructions` to guide the Planner with domain-specific rules: since list items may come from speech-to-text input and could be misspelled (or spoken in Danish or Italian), the agent is instructed to cross-reference a common items list before adding anything new.

## Prerequisites

- Node.js ≥ 18
- Google Cloud credentials with Vertex AI access (the default `gcloud` ADC or a `GOOGLE_APPLICATION_CREDENTIALS` env var)

## Setup

```bash
npm install
```

This installs all dependencies, including the local `toten` SDK via the `file:../../` reference.

## Run

```bash
npm start
```

This will:
1. Build the `toten` SDK from source
2. Run the example with the default goal: _"What is in the supermarket list?"_

### Custom goal

Pass your goal as a CLI argument:

```bash
npm start -- "Add smør to the list"
```

## Output

The example prints:
- **RESULT** — the final answer produced by the agent
- **LOOP TRACE** — the full JSON state of the loop, including all iterations, plan/act/critic reasoning, and observations
