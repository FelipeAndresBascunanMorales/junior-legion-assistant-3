export interface TreeNode {
  id: string; // Unique identifier for the task.
  title: string; // Brief task title.
  description: string; // Short purpose and expected outcome of the task.
  order?: number; // Execution sequence across all tasks.
  solved?: boolean; // Default set to false.
  isLocked?: boolean; // Default set to false.
  parentId?: string | null; // Parent task identifier.
  mustBeCodedInCodeBase?: boolean; // Indicates whether the task requires coding in the main project.
  levelOfGranularity?: number; // Rating from 0 (too complex) to 10 (completely approachable).
  isReachableByLowLevelDevelopers?: boolean; // [true/false] for junior developer suitability.
  children?: TreeNode[] | null; // Nested subtasks if any.
}

export interface Position {
  x: number;
  y: number;
}