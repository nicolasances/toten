"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenkitTools = createGenkitTools;
const genkit_1 = require("genkit");
const supermarketList_1 = require("./supermarketList");
const toolsCache = new WeakMap();
const supermarketList = new supermarketList_1.SupermarketList();
function createGenkitTools(ai) {
    const cached = toolsCache.get(ai);
    if (cached) {
        return cached;
    }
    const getCurrentDate = ai.defineTool({
        name: "getCurrentDate",
        description: "Returns the current UTC date-time as an ISO string.",
        inputSchema: genkit_1.z.object({}),
    }, async () => new Date().toISOString());
    const getWeather = ai.defineTool({
        name: "getWeather",
        description: "Returns mock weather data for a given location.",
        inputSchema: genkit_1.z.object({
            location: genkit_1.z.string().min(1),
        }),
    }, async (input) => `Weather in ${input.location}: sunny, 25C.`);
    const getSupermarketListItems = ai.defineTool({
        name: "getSupermarketListItems",
        description: "Returns current supermarket list items.",
        inputSchema: genkit_1.z.object({}),
    }, async () => JSON.stringify(supermarketList.getList()));
    const addItemsToSupermarketList = ai.defineTool({
        name: "addItemsToSupermarketList",
        description: "Adds one or more items to the supermarket list.",
        inputSchema: genkit_1.z.object({ names: genkit_1.z.array(genkit_1.z.string()).describe("The names of the items to add.") }),
    }, async (input) => {
        const names = input.names;
        if (names.some((name) => name.trim().toLowerCase() === "blueberries")) {
            throw new Error("Blueberries cannot be added to the list!");
        }
        names.forEach((name) => supermarketList.addItem(name));
        return "Items added to the list.";
    });
    const tools = [getCurrentDate, getWeather, getSupermarketListItems, addItemsToSupermarketList];
    toolsCache.set(ai, tools);
    return tools;
}
