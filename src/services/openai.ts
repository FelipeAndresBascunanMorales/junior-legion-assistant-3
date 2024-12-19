import OpenAI from 'openai';
import { TreeNode } from '../types/tree';
import { z } from 'zod';
// import { callSolveATaskContent } from './openai/theJuniorDevAssistant';
// import { callListOfTaskGenerator } from './openai/theListOfTaskGenerator';


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


// this is a previous version of the generateNodeContent function

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
