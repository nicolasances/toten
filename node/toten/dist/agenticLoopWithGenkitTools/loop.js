"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgenticLoop = void 0;
exports.describeTools = describeTools;
const uuid_1 = require("uuid");
const totoms_1 = require("totoms");
const prompts_1 = require("./prompts");
const types_1 = require("./types");
/**
 * Class that orchestrates the Agentic loop.
 */
class AgenticLoop {
    constructor({ ai, tools, correlationId, }) {
        this.ai = ai;
        this.tools = tools;
        this.correlationId = correlationId ?? (0, uuid_1.v4)();
        this.logger = totoms_1.Logger.getInstance();
    }
    /**
     * Run the loop
     */
    async loop(input) {
        const availableToolsText = describeTools(this.tools);
        const state = {
            goal: input.goal,
            context: input.context ?? [],
            maxIterations: input.maxIterations ?? 6,
            iterations: 0,
            observations: [],
            history: [],
        };
        while (state.iterations < state.maxIterations) {
            const iteration = state.iterations + 1;
            this.logger.compute(this.correlationId, "----------------------------------------------");
            this.logger.compute(this.correlationId, `Iteration #${iteration}`);
            const planResponse = await this.ai.generate({
                system: prompts_1.PLAN_SYSTEM_PROMPT,
                prompt: (0, prompts_1.buildPlanPrompt)(state, availableToolsText),
                output: { schema: types_1.PlanDecisionSchema },
            });
            if (!planResponse.output) {
                throw new Error("Planner returned no structured output.");
            }
            const plan = planResponse.output;
            this.logger.compute(this.correlationId, `Plan instruction: ${plan.instruction}`);
            let actOutput = "";
            try {
                const actResponse = await this.ai.generate({
                    system: prompts_1.ACT_SYSTEM_PROMPT,
                    prompt: (0, prompts_1.buildActPrompt)(state, plan.instruction),
                    tools: this.tools,
                });
                actOutput = actResponse.text?.trim() || "";
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                actOutput = `ERROR: Act step failed. ${errorMessage}`;
            }
            this.logger.compute(this.correlationId, `Act output: ${actOutput || "<empty>"}`);
            const criticResponse = await this.ai.generate({
                system: prompts_1.CRITIC_SYSTEM_PROMPT,
                prompt: (0, prompts_1.buildCriticPrompt)(state, actOutput),
                output: { schema: types_1.CriticDecisionSchema },
            });
            if (!criticResponse.output) {
                throw new Error("Critic returned no structured output.");
            }
            const critic = criticResponse.output;
            this.logger.compute(this.correlationId, `Critic fulfilled: ${critic.fulfilled}`);
            this.logger.compute(this.correlationId, `Critic reasoning: ${critic.reasoning}`);
            this.logger.compute(this.correlationId, `Critic observations: ${critic.observations}`);
            state.history.push({
                iteration,
                planInstruction: plan.instruction,
                planReasoning: plan.reasoning,
                actOutput,
                criticReasoning: critic.reasoning,
                criticFulfilled: critic.fulfilled,
                criticObservations: critic.observations,
            });
            state.iterations += 1;
            if (critic.fulfilled) {
                const finalAnswer = critic.finalAnswer ?? (actOutput || "Goal fulfilled.");
                state.finalAnswer = finalAnswer;
                return {
                    done: true,
                    finalAnswer,
                    state,
                };
            }
            const observation = critic.observations ?? "Goal not fulfilled yet.";
            state.observations.push(observation);
        }
        const timeout = `
        Loop stopped before goal completion.
        Last critic observation: ${state.observations[state.observations.length - 1] ?? "<none>"}
    `;
        state.finalAnswer = timeout;
        return {
            done: false,
            finalAnswer: timeout,
            state,
        };
    }
}
exports.AgenticLoop = AgenticLoop;
/**
 * Produces a human-readable description of the available tools, made for the AI to understand what tools it can use and how to use them.
 *
 * @param tools The list of tools to describe.
 *
 * @returns A string describing the available tools.
 */
function describeTools(tools) {
    function getToolName(tool) {
        const toolAny = tool;
        return toolAny?.name ?? toolAny?.__action?.name ?? toolAny?.metadata?.name ?? "unknownTool";
    }
    function getToolDescription(tool) {
        const toolAny = tool;
        return (toolAny?.description ??
            toolAny?.__action?.description ??
            toolAny?.metadata?.description ??
            "No description.");
    }
    return tools.map((tool) => `- ${getToolName(tool)}: ${getToolDescription(tool)}`).join("\n");
}
