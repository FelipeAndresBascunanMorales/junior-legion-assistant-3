import { useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { pushTreeToGithub } from '../services/github';
import { generateNodeContent } from '../services/openai';


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

  const saveToGithub = useCallback(async (tree: TreeNode) => {
    try {
      await pushTreeToGithub(tree);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      throw error;
    }
  }, []);

  return {
    generateContent,
    saveToGithub
  };
}