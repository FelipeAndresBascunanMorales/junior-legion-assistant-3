import { TreeNode } from '../../types/tree';
import OpenAI from 'openai';

const JUNIOR_DEVELOPER_ASSISTANT_ID = "asst_kDHA5TcSSrnkqeB29sVQ6jTp";

// submit files
export async function submitFiles(contents: File[], openai: OpenAI) {
  const files = await Promise.all(contents.map(async (content: File) => {
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
    file_ids: files.map((file: OpenAI.Files.FileObject) => file.id)
  });

  await openai.beta.assistants.update(JUNIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  return fileBatch;
}

// solve a specific task


export async function callSolveATask(
  contents: File[],
  node: TreeNode | null,
  parentNode: TreeNode | null,
  openai: OpenAI
) {
  const files = await Promise.all(contents.map(async (content: File) => {
    const file = await openai.files.create({
      file: content,
      purpose: 'assistants'
    });
    return file;
  }));

  console.log('files generated', files);
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Repository Contents"
  });

  console.log('vectorStore created', vectorStore);

  const fileBatch = await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
    file_ids: files.map((file: OpenAI.Files.FileObject) => file.id)
  });

  console.log('fileBatch created', fileBatch);

  await openai.beta.assistants.update(JUNIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  console.log('assistant updated', JUNIOR_DEVELOPER_ASSISTANT_ID);

  const thread = await openai.beta.threads.create();

  console.log('thread created', thread);

  const prompt = `
    given this task, read it, try to solve it and return the solution in json format.
    the task is:
    ${JSON.stringify(parentNode)}
    here for reference you can see the whole tree of tasks inside the project:
    ${JSON.stringify(node)}
  `;

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: JUNIOR_DEVELOPER_ASSISTANT_ID,
  });

  console.log('run created', run);

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    console.log('responseData', responseData);
    const content = responseData.data[0].content[0];
    if ('text' in content) {
      const match = content.text.value.match(/```json([\s\S]*?)```/);
      console.log('match', match);
      try {
        if (match) {
          const jsonString = match[1].trim();
          return JSON.parse(jsonString);
        }
        else {
          const jsonString = ('text' in responseData.data[0].content[0]) 
            ? responseData.data[0].content[0].text.value
            : '';
          return JSON.parse(jsonString);
        }
      } catch (error) {
        throw new Error(`Failed to parse JSON content: ${error}`);
      }
    }
  }
}

// solve a task autonomously
export async function callSolveATaskAutonomously(
  contents: File[],
  node: TreeNode | null,
  openai: OpenAI
) {

  await Promise.all(contents.map(async (content: File) => {
    const file = await openai.files.create({
      file: content,
      purpose: 'assistants'
    });
    return file;

  }))

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Repository Contents"
  });


  await openai.beta.assistants.update(JUNIOR_DEVELOPER_ASSISTANT_ID, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  const thread = await openai.beta.threads.create();

  const prompt = `
      check the following tree and take one of the most reachable tasks and solve it.
      ${JSON.stringify(node)}
    `;

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: JUNIOR_DEVELOPER_ASSISTANT_ID,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    const content = responseData.data[0].content[0];
    const match = ('text' in content) ? content.text.value.match(/```json([\s\S]*?)```/) : null;

    try {
      if (match) {
        const jsonString = match[1].trim();
        return JSON.parse(jsonString);
      }
      else {
        // Check if content is text type before accessing text.value
        const content = responseData.data[0].content[0];
        if ('text' in content) {
          const jsonString = content.text.value;
          return JSON.parse(jsonString);
        }
        throw new Error('Response content is not in text format');
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON content: ${error}`);
    }
  }

}
