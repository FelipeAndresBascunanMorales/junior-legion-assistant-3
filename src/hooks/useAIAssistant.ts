import { useCallback, useState } from 'react';
import OpenAI from 'openai';
import { parseAssistantResponseToTreeNode, TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent } from '../services/openai';
import { callEnhancerAssistant } from '../services/openai/theEnhancerAssistant';
import { callAddReadyForDevelopmentAttributesToTask, callGenerateTree, generateSrs, generateWireframe } from '../services/openai/theProductManagerAssistant';
import { callSolveATask, callSolveATaskAutonomously } from '../services/openai/theJuniorDevAssistant';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export function useAIAssistant() {
  const [srsContent, setSrsContent] = useState<string>("srs content");
  const [wireframeContent, setWireframeContent] = useState<string>("wireframe content");

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
    try {
      // 1.- Enhance the prompt
      const enhancedPrompt = await callEnhancerAssistant(prompt);
      
      // 2.- Generate SRS and wireframe content
      const newSrsContent = await generateSrs(enhancedPrompt);
      const newWireframeContent = await generateWireframe(enhancedPrompt);
      
      // 3.- Update the state
      setSrsContent(newSrsContent);
      setWireframeContent(newWireframeContent);

      // 4.- Generate the list of tasks
      return parseAssistantResponseToTreeNode(await callGenerateTree(enhancedPrompt));
    } catch (error) {
      console.error('Error in generateInitialTree:', error);
      throw error;
    }
  }, []);

  const generateTree = useCallback(async (prompt: string, node: TreeNode | null, tree: TreeNode | null) => {
    return parseAssistantResponseToTreeNode(await callGenerateTree(prompt, openai, node, tree));
  }, []);

  const addReadyForDevelopmentAttributes = useCallback(async (node: TreeNode, tree: TreeNode) => {
    const treeWithAttributes = parseAssistantResponseToTreeNode(await callAddReadyForDevelopmentAttributesToTask(node, tree, openai));
    return treeWithAttributes;
  }, []);
  
  const addAttributesToTreeStandBy = useCallback(async (tree: TreeNode) => {
    //take uncompleted task from the tree
    const uncompletedTask = tree.children?.find(child => !child.description);
    if (uncompletedTask) {
      const completedTasks = callAddAttributesToTree(uncompletedTask);
      const completedTree = {
        ...tree,
        children: tree.children?.map(child => {
          if (uncompletedTasks.map(task => task.id).includes(child.id)) {
            return completedTasks.then(tasks => tasks.find((task: TreeNode) => task.id === child.id)) as TreeNode;
          }
          return child;
        })
      };
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
    const solutionToCommit = await callSolveATask(repo, node, parentNode, openai);
    const assistantResponse = await commitAssistantResponse(solutionToCommit);
    return assistantResponse;
  }, []);

  const solveATaskWithAIAutonomously = useCallback(async (
    node: TreeNode | null,
    parentNode: TreeNode | null,
  ) => {
    const repo = await getRepoContents();
    const solutionToCommit = await callSolveATaskAutonomously(repo, node, parentNode, openai);
    const assistantResponse = await commitAssistantResponse(solutionToCommit);
    return assistantResponse;
  }, []);


  return {
    generateContent,
    generateInitialTree,
    saveToGithub,
    solveATaskWithAI,
    generateTree,
    addReadyForDevelopmentAttributes,
    solveATaskWithAIAutonomously,
    srsContent,
    wireframeContent
  };
}


