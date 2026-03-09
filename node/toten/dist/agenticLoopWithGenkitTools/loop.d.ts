import { Genkit } from "genkit";
import { ToolAction } from "genkit";
import { AgentLoopResult } from "./types";
export interface RunLoopInput {
    goal: string;
    context?: string[];
    maxIterations?: number;
}
export interface AgenticLoopOptions {
    correlationId?: string;
}
/**
 * Class that orchestrates the Agentic loop.
 */
export declare class AgenticLoop {
    private readonly ai;
    private readonly tools;
    private readonly correlationId;
    private readonly logger;
    constructor({ ai, tools, correlationId, }: {
        ai: Genkit;
        tools: ToolAction[];
        correlationId?: string;
    });
    /**
     * Run the loop
     */
    loop(input: RunLoopInput): Promise<AgentLoopResult>;
}
/**
 * Produces a human-readable description of the available tools, made for the AI to understand what tools it can use and how to use them.
 *
 * @param tools The list of tools to describe.
 *
 * @returns A string describing the available tools.
 */
export declare function describeTools(tools: ToolAction[]): string;
