import { useCallback, useState } from 'react';
import OpenAI from 'openai';
import { parseAssistantResponseToTreeNode, TreeNode } from '../types/tree';
import { pushTreeToGithub, getRepoContents, commitAssistantResponse } from '../services/github';
import { generateNodeContent } from '../services/openai';
import { callEnhancerAssistant } from '../services/openai/theEnhancerAssistant';
import { callAddReadyForDevelopmentAttributesToTask, callGenerateInitialTree, callGenerateSrs, callGenerateTree, callGenerateWireframe } from '../services/openai/theProductManagerAssistant';
import { callSolveATask, callSolveATaskAutonomously } from '../services/openai/theJuniorDevAssistant';
import { aGoodResponse } from '../utils/aGoodResponse';

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

  // deprecated
  const generateDocuments = useCallback(async (prompt: string) => {
    
    // const enhancedPrompt = await new Promise(resolve => setTimeout(async () => {
      //   resolve(`Enhanced prompt: <code>${prompt}</code>`)
      // }, 1000))

      // 1.- Enhance the prompt
      const enhancedPrompt = await callEnhancerAssistant(prompt);
      // 2.- Generate SRS
      const newSrsContent = await generateSrs(enhancedPrompt);
      setSrsContent(newSrsContent);
      // 3.- Generate wireframe
      const newWireframeContent = await generateWireframe(enhancedPrompt);
      setWireframeContent(newWireframeContent);

      return {
        enhancedPrompt: enhancedPrompt,
        srsContent: newSrsContent,
        wireframeContent: newWireframeContent
      };
  }, []);

  const enhancePrompt = useCallback(async (prompt: string) => {
    return callEnhancerAssistant(prompt);
  }, []);

   const generateSrs = useCallback(async (prompt: string) => {
    try {
      return await callGenerateSrs(prompt);
      // return new Promise(resolve => setTimeout(async () => {
      //   resolve(`SRS content: <pre><code>${prompt}</code></pre>`)
      // }, 1000))
    } catch (error) {
      console.error('Failed to generate SRS:', error);
      throw error;
    }
   }, []);

   const generateWireframe = useCallback(async (prompt: string) => {
    try {
      return await callGenerateWireframe(prompt);
      // return new Promise(resolve => setTimeout(async () => {
      //   resolve(`Wireframe content: <pre><code>${prompt}`)
      // }, 1000))
    } catch (error) {
      console.error('Failed to generate wireframe:', error);
      throw error;
    }
   }, []);

  const generateInitialTree = useCallback(async (prompt: string	) => {
    try {
      return parseAssistantResponseToTreeNode(await callGenerateInitialTree());
      // fake response

      // return new Promise(resolve => setTimeout(async () => {
      //   resolve(parseAssistantResponseToTreeNode(aGoodResponse))
      // }, 1000))
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
    console.log('solving a task with AI');
    const repo = await getRepoContents();
    console.log('repo', repo);
    const solutionToCommit = await callSolveATask(repo, node, parentNode, openai);
    console.log('solutionToCommit', solutionToCommit);
    const assistantResponse = await commitAssistantResponse(solutionToCommit);
    console.log('assistantResponse', assistantResponse);
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
    enhancePrompt,
    generateInitialTree,
    saveToGithub,
    solveATaskWithAI,
    generateTree,
    addReadyForDevelopmentAttributes,
    solveATaskWithAIAutonomously,
    generateDocuments,
    generateSrs,
    generateWireframe
  };
}


