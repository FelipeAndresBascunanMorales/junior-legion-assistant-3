import { useCallback, useState } from 'react';
import OpenAI from 'openai';
import { parseAssistantResponseToTreeNode, TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent } from '../services/openai';
import { callEnhancerAssistant } from '../services/openai/theEnhancerAssistant';
import { callAddReadyForDevelopmentAttributesToTask, callGenerateInitialTree, callGenerateTree, generateSrs, generateWireframe } from '../services/openai/theProductManagerAssistant';
import { callSolveATask, callSolveATaskAutonomously } from '../services/openai/theJuniorDevAssistant';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export function useAIAssistant() {
  const [srsContent, setSrsContent] = useState('');
  const [wireframeContent, setWireframeContent] = useState('');

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

  const generateDocuments = useCallback(async (prompt: string) => {
      // 1.- Enhance the prompt
      const enhancedPrompt = await callEnhancerAssistant(prompt);
      
      // 2.- Generate SRS and wireframe content
      const newSrsContent = await generateSrs(enhancedPrompt);
      setSrsContent(newSrsContent);
      const newWireframeContent = await generateWireframe(enhancedPrompt);
      setWireframeContent(newWireframeContent);
      

      return {
        enhancedPrompt: enhancedPrompt,
        srsContent: newSrsContent,
        wireframeContent: newWireframeContent
      };
  }, []);

  const generateInitialTree = useCallback(async (prompt: string	) => {
    try {
        return parseAssistantResponseToTreeNode(await callGenerateInitialTree());
    } catch (error) {
      console.error('Error in generateInitialTree:', error);
      throw error;
    }
  }, []); 

  const generateTree = useCallback(async (prompt: string, node: TreeNode | null, tree: TreeNode | null) => {
    return parseAssistantResponseToTreeNode(await callGenerateTree(prompt, node, tree));
  }, []);

  const addReadyForDevelopmentAttributes = useCallback(async (node: TreeNode, tree: TreeNode) => {
    const treeWithAttributes = parseAssistantResponseToTreeNode(await callAddReadyForDevelopmentAttributesToTask(node, tree));
    return treeWithAttributes;
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
    srsContent,
    wireframeContent,
    generateContent,
    generateInitialTree,
    saveToGithub,
    solveATaskWithAI,
    generateTree,
    addReadyForDevelopmentAttributes,
    solveATaskWithAIAutonomously,
    generateDocuments
  };
}


