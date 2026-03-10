# Toten CLI Example

A runnable CLI demo of the **Toten Agentic Loop** using Google Vertex AI (`gemini-2.0-flash-lite`) and two example tools:

- **`getWeather`** — returns mock weather data (condition, temperature, humidity) for a set of cities
- **`getCurrentTime`** — returns the current UTC timestamp

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
2. Run the example with the default goal: _"What is the current weather in London and Paris? Also tell me the current UTC time."_

### Custom goal

Pass your goal as a CLI argument:

```bash
npm start -- "What is the weather in Tokyo?"
```

## Output

The example prints:
- **RESULT** — the final answer produced by the agent
- **LOOP TRACE** — the full JSON state of the loop, including all iterations, plan/act/critic reasoning, and observations
