import { useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent, solveATaskContent, generateInitialTree as CallGenerateInitialTree, addAttributesToTree as callAddAttributesToTree } from '../services/openai';


export function useAIAssistant() {
  const generateContent = useCallback(async (
    node: TreeNode,
    parentNode: TreeNode | null,
    prompt: string
  ) => {
    try {
      return await generateNodeContent(node, parentNode, prompt);
    } catch (error) {
      console.error('Failed to generate content:', error);
      throw error;
    }
  }, []);

  const generateInitialTree = useCallback(async (prompt: string) => {
    return await CallGenerateInitialTree(prompt);
  }, []);

  
  const addAttributesToTree = useCallback(async (tree: TreeNode) => {
    //take uncompleted task from the tree
    const completedTasks = callAddAttributesToTree(tree);
    return completedTasks;
  }, []);
  
  const addAttributesToTreeStandBy = useCallback(async (tree: TreeNode) => {
    //take uncompleted task from the tree
    const uncompletedTask = tree.children?.find(child => !child.description);
    console.log("uncompletedTask from addAttributesToTree: ", uncompletedTask);
    if (uncompletedTask) {
      const completedTasks = callAddAttributesToTree(uncompletedTask);
      console.log("completedTasks from addAttributesToTree: ", completedTasks);
      const completedTree = {
        ...tree,
        children: tree.children?.map(child => {
          if (uncompletedTasks.map(task => task.id).includes(child.id)) {
            return completedTasks.then(tasks => tasks.find((task: TreeNode) => task.id === child.id)) as TreeNode;
          }
          return child;
        })
      };

      console.log("completedTree: ", completedTree);
      return completedTree;
    }
    return tree;
  }, []);


  const saveToGithub = useCallback(async (content: any) => {
    try {
      await pushTreeToGithub(content);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      throw error;
    }
  }, []);


  const solveATaskWithAI = useCallback(async (
    node: TreeNode | null,
    parentNode: TreeNode | null,
  ) => {
    const repo = await getRepoContents();
    const solutionToCommit = await solveATaskContent(repo, node, parentNode);
    console.log("in useAIAssistant - solutionToCommit: ", solutionToCommit);
    const assistantResponse = await commitAssistantResponse(solutionToCommit);
    console.log("in useAIAssistant - assistantResponse: ", assistantResponse);
    return assistantResponse;
  }, []);


  return {
    generateContent,
    generateInitialTree,
    saveToGithub,
    solveATaskWithAI,
    addAttributesToTree
  };
}
