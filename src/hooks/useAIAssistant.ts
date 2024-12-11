import { useCallback } from 'react';
import OpenAI from 'openai';
import { parseAssistantResponseToTreeNode, TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent, solveATaskContent } from '../services/openai';
import { callEnhancerAssistant } from '../services/openai/theEnhancerAssistant';
import { callAddAttributesToTree, callGenerateInitialTree } from '../services/openai/theProductManagerAssistant';


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
  // 1.- Enhance the prompt
  const enhancedPrompt = await callEnhancerAssistant(prompt, openai);
  // 2.- Generate the list of tasks
  return parseAssistantResponseToTreeNode(await callGenerateInitialTree(enhancedPrompt, openai));

  }, []);

  const addAttributesToTree = useCallback(async (tree: TreeNode) => {
    const treeWithAttributes = parseAssistantResponseToTreeNode(await callAddAttributesToTree(tree, openai));
    return treeWithAttributes;
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
