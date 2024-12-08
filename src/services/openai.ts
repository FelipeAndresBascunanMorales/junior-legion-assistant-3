import OpenAI from 'openai';
import { TreeNode } from '../types/tree';
import { z } from 'zod';

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


export async function generateTreeContent(
  currentNode: TreeNode | null,
  tree: TreeNode | null,
  prompt: string
): Promise<TreeNode> {
  // wake up the assistant
  const assistant = await openai.beta.assistants.retrieve("asst_uoqTiJO5E9UAEY2f3ZJNIi8L");

  console.log("assistant: ", assistant);
  // create a thread
  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  console.log("message: ", message);
  
  console.log("thread: ", thread);
  // create a run
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  console.log("run: ", run);

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    console.log("reverse type: ", responseData.data.reverse()[0].content[0].type);
    console.log("reverse text value: ", responseData.data.reverse()[0].content[0].text.value);

    for (const message of responseData.data.reverse()) {
      console.log(`${message.role} > ${message.content[0].text.value}`);
    }

    const newTree = JSON.parse(responseData.data.reverse()[0].content[0].text.value);
    return newTree;
  } else {
    console.log(run.status);
    throw new Error(`OpenAI run failed with status: ${run.status}`);
  }
}

export async function generateNodeContent(
  currentNode: TreeNode,
  parentNode: TreeNode | null,
  prompt: string
): Promise<NodeUpdate> {
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