import { z } from "genkit";
export declare const PlanDecisionSchema: z.ZodObject<{
    instruction: z.ZodString;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    instruction: string;
    reasoning: string;
}, {
    instruction: string;
    reasoning: string;
}>;
export type PlanDecision = z.infer<typeof PlanDecisionSchema>;
export declare const CriticDecisionSchema: z.ZodEffects<z.ZodObject<{
    fulfilled: z.ZodBoolean;
    observations: z.ZodOptional<z.ZodString>;
    finalAnswer: z.ZodOptional<z.ZodString>;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reasoning: string;
    fulfilled: boolean;
    observations?: string | undefined;
    finalAnswer?: string | undefined;
}, {
    reasoning: string;
    fulfilled: boolean;
    observations?: string | undefined;
    finalAnswer?: string | undefined;
}>, {
    reasoning: string;
    fulfilled: boolean;
    observations?: string | undefined;
    finalAnswer?: string | undefined;
}, {
    reasoning: string;
    fulfilled: boolean;
    observations?: string | undefined;
    finalAnswer?: string | undefined;
}>;
export type CriticDecision = z.infer<typeof CriticDecisionSchema>;
export interface LoopIteration {
    iteration: number;
    planInstruction: string;
    planReasoning: string;
    actOutput: string;
    criticReasoning: string;
    criticFulfilled: boolean;
    criticObservations?: string;
}
export interface AgentLoopState {
    goal: string;
    context: string[];
    maxIterations: number;
    iterations: number;
    observations: string[];
    history: LoopIteration[];
    finalAnswer?: string;
}
export interface AgentLoopResult {
    done: boolean;
    finalAnswer: string;
    state: AgentLoopState;
}
