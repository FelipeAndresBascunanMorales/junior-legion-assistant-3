import { z } from 'zod';


export interface TreeNode {
  id: string; // Unique identifier for the task.
  title: string; // Complete task title.
  description?: string; // Purpose and expected outcome of the task.
  order?: number; // Execution order across all tasks in the whole tree from 0 to n.
  solved?: boolean; // Default set to false.
  isLocked?: boolean; // Default set to false.
  relevance?: number; // Rating from 0 (not relevant, unnecessary, doesn't make sense, doesn't give value, etc.) to 10 (very relevant, essential, makes lot of sense, gives lot of value, etc.).
  parentId?: string | null; // Parent task identifier.
  mustBeCodedInCodeBase?: boolean; // Indicates whether the task requires coding in the main project.
  levelOfGranularity?: number; // Rating from 0 (too complex) to 10 (completely approachable).
  isReachableByEntryLevelDevelopers?: boolean; // [true/false] for junior developer suitability.
  children?: TreeNode[] | null; // Nested subtasks if any.
  readyForDevelopment?: boolean; // Default set to false.
  indicationsForDevelopment?: {
    instructions: string; // Instructions for the developer to solve the task.
    suggestion: string; // Suggestion for the developer on how to solve the task.
    filesRelated: {
      path: string; // Path to a new or existing file related to the solution.
      whatToDo: string; // What to do inside the file.
    }[]
    conditionsForSolved: string; // conditions the task must meet to be considered solved.
  }
}


export interface FullfilledTask extends TreeNode {
  id: string; // Unique identifier for the task.
  title: string; // Brief task title.
  description: string; // Short purpose and expected outcome of the task.
  order: number; // Execution sequence across all tasks.
  solved: boolean; // Default set to false.
  isLocked: boolean; // Default set to false.
  parentId: string | null; // Parent task identifier.
  mustBeCodedInCodeBase: boolean; // Indicates whether the task requires coding in the main project.
  levelOfGranularity: number; // Rating from 0 (too complex) to 10 (completely approachable).
  isReachableByEntryLevelDevelopers: boolean; // [true/false] for junior developer suitability.
  children?: null; // Nested subtasks if any.
        relevance: number; // Rating from 0 (not relevant) to 10 (very relevant) task.
        requireHighLevelDecision: boolean; // Indicates whether the task requires high-level decision.
  readyForDevelopment: boolean; // Default set to false.
  indicationsForDevelopment: {
    instructions: string; // Instructions for the developer to solve the task.
    suggestion: string; // Suggestion for the developer on how to solve the task.
    filesRelated: {
      path: string; // Path to a new or existing file related to the solution.
      whatToDo: string; // What to do inside the file.
    }[]
    conditionsForSolved: string; // conditions the task must meet to be considered solved.
  }
}

// Define the TreeNode schema recursively
const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() => 
  z.object({
    id: z.string(),
    title: z.string(), 
    description: z.string().optional(),
    relevance: z.number().min(0).max(10).optional(),
    readyForDevelopment: z.boolean().optional(),
    order: z.number().optional(),
    solved: z.boolean().optional(),
    isLocked: z.boolean().optional(),
    parentId: z.string().nullable().optional(),
    mustBeCodedInCodeBase: z.boolean().optional(),
    levelOfGranularity: z.number().min(0).max(10).optional(),
    isReachableByEntryLevelDevelopers: z.boolean().optional(),
    indicationsForDevelopment: z.object({
      instructions: z.string(),
      suggestion: z.string(),
      filesRelated: z.array(z.object({
        path: z.string(),
        whatToDo: z.string()
      })),
      conditionsForSolved: z.string()
    }).optional(),
    children: z.array(treeNodeSchema).nullable().optional()
  })
);

// Helper function to parse assistant response to TreeNode
export function parseAssistantResponseToTreeNode(response: unknown): TreeNode {
  try {
    // First validate it matches our TreeNode schema
    return treeNodeSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    }
    throw new Error('Failed to parse assistant response to TreeNode');
  }
}

// Example usage:
// const validatedTree = parseAssistantResponseToTreeNode(assistantResponse);