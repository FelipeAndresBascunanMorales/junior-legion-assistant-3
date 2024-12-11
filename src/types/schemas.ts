import { z } from 'zod';

// Schema for the enhanced prompt (Output of Improver Assistant)
export const EnhancedPromptSchema = z.string();

// Schema for task tree nodes (Output of Task Generator Assistant)
export const TaskNodeSchema: z.ZodType<any> = z.lazy(() => 
  z.object({
    id: z.string(),
    title: z.string(),
    children: z.array(TaskNodeSchema).optional(),
  })
);

export const TaskTreeSchema = z.object({
  tasks: z.array(TaskNodeSchema)
});

// Schema for implementation details (Output of Implementation Assistant)
export const ImplementationDetailsSchema = z.object({
  taskId: z.string(),
  type: z.enum(['create', 'update', 'delete']),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
  dependencies: z.array(z.string()).optional(),
});

// Types derived from schemas
export type EnhancedPrompt = z.infer<typeof EnhancedPromptSchema>;
export type TaskTree = z.infer<typeof TaskTreeSchema>;
export type ImplementationDetails = z.infer<typeof ImplementationDetailsSchema>;

// Example usage:
// const validateEnhancedPrompt = (data: unknown): EnhancedPrompt => {
//   return EnhancedPromptSchema.parse(data);
// };

// Helper to validate responses from each assistant
export const validateAssistantResponse = {
  improver: (data: unknown) => EnhancedPromptSchema.parse(data),
  taskGenerator: (data: unknown) => TaskTreeSchema.parse(data),
  implementer: (data: unknown) => ImplementationDetailsSchema.parse(data),
};

// Example of a chain type
export type AssistantChain = {
  improver: (rawPrompt: string) => Promise<EnhancedPrompt>;
  taskGenerator: (enhancedPrompt: EnhancedPrompt) => Promise<TaskTree>;
  implementer: (task: TaskNodeSchema, tree: TaskTree) => Promise<ImplementationDetails>;
};



