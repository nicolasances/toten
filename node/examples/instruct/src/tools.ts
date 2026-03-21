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

  const getSupermarketListItems = ai.defineTool(
    {
      name: "getSupermarketListItems",
      description: "Returns current supermarket list items.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        items: z.array(z.string()).describe("The list of items in the supermarket list."),
      }),
    },
    async () => ({ items: list })
  );

  const getCommonItems = ai.defineTool(
    {
      name: "getCommonItems",
      description: "Returns a list of common supermarket items added in the supermarket list in the past.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        items: z.array(z.string()).describe("The list of common supermarket items."),
      }),
    },
    async () => ({ items: ["Eggs", "Butter", "Bacon", "Bacon i tern", "Let mælk", "Riskiks", "Spaghetti", "Mandler", "Almonds", "Walnuts", "Bread C", "Bread N", "Musli N", "Musli"] })
  );

  const addItemToList = ai.defineTool(
    {
      name: "addItemToList",
      description: "Adds an item to the supermarket list.",
      inputSchema: z.object({
        item: z.string().describe("The item to add to the supermarket list."),
      }),
      outputSchema: z.object({
        success: z.boolean().describe("Whether the item was successfully added to the supermarket list."),
      }),
    },
    async ({ item }) => {
      list.push(item);
      return { success: true };
    }
  );

  return [getSupermarketListItems, getCommonItems, addItemToList];
}
