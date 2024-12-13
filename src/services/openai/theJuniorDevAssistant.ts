import { TreeNode } from '../../types/tree';
import OpenAI from 'openai';

const SENIOR_DEVELOPER_ASSISTANT_ID = "asst_5krcIPLblqj9rjKFB3rkjnLF";

// submit files

export async function submitFiles(contents: any, openai: OpenAI) {
  const files = await Promise.all(contents.map(async (content: any) => {
    const file = await openai.files.create({
      file: content,
      purpose: 'assistants'
    });
    return file;
  }))

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Repository Contents"
  });

  const fileBatch = await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
    file_ids: files.map((file: any) => file.id)
  });

  
  await openai.beta.assistants.update(SENIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  return fileBatch;
}

// solve a specific task

export async function callSolveATaskContent(
    contents: any,
    node: TreeNode | null,
    parentNode: TreeNode | null,
    openai: OpenAI
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
  