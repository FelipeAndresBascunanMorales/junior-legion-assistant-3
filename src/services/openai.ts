import OpenAI from 'openai';
import { TreeNode } from '../types/tree';
import { z } from 'zod';
import { callSolveATaskContent } from './openai/theJuniorDevAssistant';
import { callGenerateTreeContent } from './openai/theProductManagerAssistant';
import { TaskNodeSchema } from '../types/schemas';
import { callListOfTaskGenerator } from './openai/theListOfTaskGenerator';
import { callEnhancerAssistant } from './openai/theEnhancerAssistant';


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});


const nodeUpdateSchema = z.object({
  title: z.string(),
  description: z.string(),
  action: z.enum(['create', 'update', 'delete'])
});

type NodeUpdate = z.infer<typeof nodeUpdateSchema>;

export async function enhancePrompt(prompt: string) {
  const result = await callEnhancerAssistant(prompt, openai);
  return result;
}

export async function generateListOfTasks(prompt: string) {
  const result = await callListOfTaskGenerator(prompt, openai);
  return result;
}

export async function solveATaskContent(contents: any, node: TreeNode | null, parentNode: TreeNode | null): Promise<TreeNode> {
  const result = await callSolveATaskContent(contents, node, parentNode, openai);
  return result;
}

export async function generateTreeContent(currentNode: TreeNode | null, tree: TreeNode | null, prompt: string): Promise<TreeNode> {

  const result = await callGenerateTreeContent(currentNode, tree, prompt, openai);
  return result;
}

export async function generateInitialTree(prompt: string): Promise<TreeNode> {
  const enhancedPrompt = await enhancePrompt(prompt);
  const listOfTasks = await generateListOfTasks(enhancedPrompt);
  const tree = await generateTreeContent(null, null, enhancedPrompt);
  return tree;
}

export async function generateNodeContent(currentNode: TreeNode, parentNode: TreeNode | null, prompt: string): Promise<NodeUpdate> {
  const systemPrompt = `You are a helpful AI assistant that helps users manage and organize information in a tree structure.
Current context:
- Node title: ${currentNode.title}
- Node description: ${currentNode.description}
${parentNode ? `- Parent node title: ${parentNode.title}
- Parent node description: ${parentNode.description}` : ''}

Generate a response that includes a title and description for the node, considering the user's input and the current context.
The response should be in JSON format with the following structure:
{
  "title": "string",
  "description": "string",
  "action": "create" | "update" | "delete"
}`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'gpt-4-turbo-preview',
    response_format: { type: 'json_object' }
  });

  const response = completion.choices[0].message.content;
  if (!response) throw new Error('No response from OpenAI');

  try {
    const parsedResponse = JSON.parse(response);
    return nodeUpdateSchema.parse(parsedResponse);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    throw new Error('Invalid response format from OpenAI');
  }
}
