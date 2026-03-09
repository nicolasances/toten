"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriticDecisionSchema = exports.PlanDecisionSchema = void 0;
const genkit_1 = require("genkit");
exports.PlanDecisionSchema = genkit_1.z.object({
    instruction: genkit_1.z.string().min(1),
    reasoning: genkit_1.z.string(),
});
exports.CriticDecisionSchema = genkit_1.z
    .object({
    fulfilled: genkit_1.z.boolean(),
    observations: genkit_1.z.string().optional(),
    finalAnswer: genkit_1.z.string().optional(),
    reasoning: genkit_1.z.string(),
})
    .superRefine((value, ctx) => {
    if (value.fulfilled && !value.finalAnswer) {
        ctx.addIssue({
            code: genkit_1.z.ZodIssueCode.custom,
            path: ["finalAnswer"],
            message: "finalAnswer is required when fulfilled=true.",
        });
    }
    if (!value.fulfilled && !value.observations) {
        ctx.addIssue({
            code: genkit_1.z.ZodIssueCode.custom,
            path: ["observations"],
            message: "observations is required when fulfilled=false.",
        });
    }
});
