{
    id: string; // Unique identifier for the task.
    title: string; // Complete task title.
    description: string; // Purpose and expected outcome of the task.
    order: number; // Execution order across all tasks in the whole tree from 0 to n.
    solved: boolean; // Default set to false.
    isLocked: boolean; // Default set to false.
    relevance: number; // Rating from 0 (not relevant, unnecessary, doesn't make sense, doesn't give value, etc.) to 10 (very relevant, essential, makes lot of sense, gives lot of value, etc.).
    parentId: string | null; // Parent task identifier.
    mustBeCodedInCodeBase: boolean; // Indicates whether the task requires coding in the main project.
    levelOfGranularity: number; // Rating from 0 (too complex) to 10 (completely approachable).
    isReachableByEntryLevelDevelopers: boolean; // [true/false] for junior developer suitability.
    children: TaskNode[] | null; // Nested subtasks if any.
  }