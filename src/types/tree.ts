import { z } from 'zod';


export interface TreeNode {
  id: string; // Unique identifier for the task.
  title: string; // Brief task title.
  description?: string; // Short purpose and expected outcome of the task.
  order?: number; // Execution sequence across all tasks.
  solved?: boolean; // Default set to false.
  isLocked?: boolean; // Default set to false.
  parentId?: string | null; // Parent task identifier.
  mustBeCodedInCodeBase?: boolean; // Indicates whether the task requires coding in the main project.
  levelOfGranularity?: number; // Rating from 0 (too complex) to 10 (completely approachable).
  isReachableByLowLevelDevelopers?: boolean; // [true/false] for junior developer suitability.
  children?: TreeNode[] | null; // Nested subtasks if any.
}


// Define the TreeNode schema recursively
const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() => 
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    solved: z.boolean().optional(),
    isLocked: z.boolean().optional(),
    parentId: z.string().nullable().optional(),
    mustBeCodedInCodeBase: z.boolean().optional(),
    levelOfGranularity: z.number().min(0).max(10).optional(),
    isReachableByLowLevelDevelopers: z.boolean().optional(),
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