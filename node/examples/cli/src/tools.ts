import { Genkit, ToolAction, z } from "genkit";

const MOCK_WEATHER: Record<string, { condition: string; tempC: number; humidity: number }> = {
  london: { condition: "Cloudy", tempC: 12, humidity: 78 },
  paris: { condition: "Sunny", tempC: 18, humidity: 55 },
  tokyo: { condition: "Rainy", tempC: 15, humidity: 85 },
  "new york": { condition: "Partly Cloudy", tempC: 10, humidity: 65 },
  sydney: { condition: "Sunny", tempC: 25, humidity: 50 },
};

const list = ["Bread", "Milk"];

export function createTools(ai: Genkit): ToolAction[] {

  const getWeather = ai.defineTool(
    {
      name: "getWeather",
      description: "Returns the current weather for a given city.",
      inputSchema: z.object({
        city: z.string().describe("The name of the city to get weather for."),
      }),
      outputSchema: z.object({
        city: z.string(),
        condition: z.string(),
        temperatureCelsius: z.number(),
        humidity: z.number(),
      }),
    },
    async ({ city }) => {
      const key = city.toLowerCase();
      const data = MOCK_WEATHER[key] ?? { condition: "Clear", tempC: 20, humidity: 60 };

      return {
        city,
        condition: data.condition,
        temperatureCelsius: data.tempC,
        humidity: data.humidity,
      };
    }
  );

  const getCurrentTime = ai.defineTool(
    {
      name: "getCurrentTime",
      description: "Returns the current UTC date and time.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        utcDateTime: z.string().describe("The current UTC date and time in ISO 8601 format."),
      }),
    },
    async () => ({ utcDateTime: new Date().toISOString() })
  );

  const getSupermarketListItems = ai.defineTool(
    {
      name: "getSupermarketListItems",
      description: "Returns current supermarket list items.",
      inputSchema: z.object({}),
    },
    async () => JSON.stringify(list)
  );

  return [getWeather, getCurrentTime, getSupermarketListItems];
}
