import { TreeNode } from '../../types/tree';
import OpenAI from 'openai';

const SENIOR_DEVELOPER_ASSISTANT_ID = "asst_5krcIPLblqj9rjKFB3rkjnLF";
const JUNIOR_DEVELOPER_ASSISTANT_ID = "asst_kDHA5TcSSrnkqeB29sVQ6jTp";

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


export async function callSolveATask(
  contents: any,
  node: TreeNode | null,
  parentNode: TreeNode | null,
  openai: OpenAI
) {
  const files = await Promise.all(contents.map(async (content: any) => {
    const file = await openai.files.create({
      file: content,
      purpose: 'assistants'
    });
    return file;
  }));

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Repository Contents"
  });

  const fileBatch = await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
    file_ids: files.map((file: any) => file.id)
  });

  await openai.beta.assistants.update(JUNIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  const thread = await openai.beta.threads.create();

  const prompt = `
    given this task, read it, try to solve it and return the solution in json format.
    the task is:
    ${JSON.stringify(parentNode)}
    here for reference you can see the whole tree of tasks inside the project:
    ${JSON.stringify(node)}
  `;

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: SENIOR_DEVELOPER_ASSISTANT_ID,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
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

// solve a task autonomously
export async function callSolveATaskAutonomously(
    contents: any,
    node: TreeNode | null,
    parentNode: TreeNode | null,
    openai: OpenAI
  ) {
  
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
  
    const thread = await openai.beta.threads.create();
  
    const prompt = `
      check the following tree and take one of the most reachable tasks and solve it.
      ${JSON.stringify(node)}
    `;
  
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });
  
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: SENIOR_DEVELOPER_ASSISTANT_ID,
    });
  
    if (run.status === 'completed') {
      const responseData = await openai.beta.threads.messages.list(run.thread_id);
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
  