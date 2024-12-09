import OpenAI from 'openai';
import { TreeNode } from '../types/tree';
import { object, z } from 'zod';

const PROJECT_MANAGER_ASSISTANT_ID = "asst_uoqTiJO5E9UAEY2f3ZJNIi8L";
const SENIOR_DEVELOPER_ASSISTANT_ID = "asst_5krcIPLblqj9rjKFB3rkjnLF";

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
  const assistant = await openai.beta.assistants.retrieve(PROJECT_MANAGER_ASSISTANT_ID);

  // create a thread
  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  // create a run
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);  
    const newTree = JSON.parse(responseData.data[0].content[0].text.value);
    console.log("responseData: ", responseData);
    console.log("newTree (parsed): ", newTree);
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

export async function solveATaskContent(
  contents: any,
  node: TreeNode | null,
  parentNode: TreeNode | null,
) {

  // example of file object

  // {
  //   "id": "file-abc123",
  //   "object": "file",
  //   "bytes": 120000,
  //   "created_at": 1677610602,
  //   "filename": "salesOverview.pdf",
  //   "purpose": "assistants",
  // }

  const files = await Promise.all(contents.map(async (content: any) => {
    console.log("content: ", content);
    const file = await openai.files.create({
      file: content,
      purpose: 'assistants'
    });
    return file;

  }))

  console.log("files: ", files);

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Repository Contents"
  });

  const fileBatch = await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
    file_ids: files.map((file: any) => file.id)
  });

  console.log("fileBatch: ", fileBatch);
  console.log("fileBatch.status: ", fileBatch.status);

  await openai.beta.assistants.update(SENIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });
  console.log("fileBatch.status after assistant update: ", fileBatch.status);

  const thread = await openai.beta.threads.create();

  const prompt = `
    check the following tree and take one of the most reachable tasks and solve it.
    ${JSON.stringify(node)}
  `;
  console.log("prompt: ", prompt);

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  console.log("message: ", message);
  console.log("fileBatch.status after message creation: ", fileBatch.status);
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: SENIOR_DEVELOPER_ASSISTANT_ID,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    console.log("responseData: ", responseData);

    const match = responseData.data[0].content[0].text.value.match(/```json([\s\S]*?)```/);
    
    try {
      if (match) {
        const jsonString = match[1].trim();
        return JSON.parse(jsonString);
      }
      else {
        const jsonString = responseData.data[0].content[0].text.value;
        return JSON.parse(jsonString);
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON content: ${error}`);
    }
  }

}
