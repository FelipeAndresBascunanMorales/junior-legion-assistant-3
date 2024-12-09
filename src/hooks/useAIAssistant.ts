import { useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent, generateTreeContent, solveATaskContent } from '../services/openai';


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

  const generateTree = useCallback(async (prompt: string) => {
    return await generateTreeContent(null, null, prompt);
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
    generateTree,
    saveToGithub,
    solveATaskWithAI
  };
}
