import { TreeNode } from "../../types/tree";
import { openai } from "../../hooks/useAIAssistant";
// import { ThreadManager } from "./threadManager";

const PROJECT_MANAGER_ASSISTANT_ID = "asst_VTGGJNCkPc6oWAlm3EahI6Yi";
let threadId: string | null = null;

export async function sendPrompt(prompt: string) {
  const assistant = await openai.beta.assistants.retrieve(PROJECT_MANAGER_ASSISTANT_ID);
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }
  console.log("inside sendPrompt");
  console.log("threadId: ", threadId);
  console.log("prompt: ", prompt);

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: prompt
  });

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistant.id,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(threadId);
    const content = responseData.data[0].content[0];
    if ('text' in content) {
      const newTree = JSON.parse(content.text.value);
      return newTree;
    }
    throw new Error('Expected text response from OpenAI');
  }
}

export async function callGenerateSrs(prompt: string) {
  return sendPrompt(`generate SRS content for the following specification: ${prompt}`);
}

export async function callGenerateWireframe(prompt: string) {
  return sendPrompt(`generate wireframe content for the following specification: ${prompt}`);
}

export async function callGenerateInitialTree(
  ): Promise<TreeNode> {
    return sendPrompt("Generate a task tree to accomplish an mvp version of the project.");
  }

  export async function callGenerateTree(
    prompt: string,
  ): Promise<TreeNode> {
    return sendPrompt(`Generate a task tree for the previous specification. ${prompt}`);
  }

  
export async function callAddReadyForDevelopmentAttributesToTask(
  currentNode: TreeNode | null,
  tree: TreeNode | null,
  prompt?: string,
): Promise<TreeNode> {
  // wake up the assistant
  const assistant = await openai.beta.assistants.retrieve(PROJECT_MANAGER_ASSISTANT_ID);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...lonelyTask } = currentNode || {};

  if (!prompt) {
    prompt = "Add the readyForDevelopment related attributes to this task: " + JSON.stringify(lonelyTask) + "this is the tree for reference: " + JSON.stringify(tree) ;
  }

  if (!threadId) {
    // create a thread
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: prompt
  });

  // create a run
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistant.id,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    const content = responseData.data[0].content[0];
    if ('text' in content) {
      const newTree = JSON.parse(content.text.value);
      return newTree;
    }
    throw new Error('Expected text response from OpenAI');
  } else {
    throw new Error(`OpenAI run failed with status: ${run.status}`);
  }
}