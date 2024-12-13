import OpenAI from "openai";
import { TreeNode } from "../../types/tree";
// import { ThreadManager } from "./threadManager";

const PROJECT_MANAGER_ASSISTANT_ID = "asst_VTGGJNCkPc6oWAlm3EahI6Yi";
let threadId: string | null = null;

export async function callGenerateTree(
    prompt: string,
    openai: OpenAI,
    currentNode?: TreeNode | null,
    tree?: TreeNode | null
  ): Promise<TreeNode> {
    // wake up the assistant
    const assistant = await openai.beta.assistants.retrieve(PROJECT_MANAGER_ASSISTANT_ID);
  
    // create a thread
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
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

  
export async function callAddReadyForDevelopmentAttributesToTask(
  currentNode: TreeNode | null,
  tree: TreeNode | null,
  openai: OpenAI,
  prompt?: string,
): Promise<TreeNode> {
  // wake up the assistant
  const assistant = await openai.beta.assistants.retrieve(PROJECT_MANAGER_ASSISTANT_ID);

  const { children, ...lonelyTask } = currentNode;

  if (!prompt) {
    prompt = "Add the readyForDevelopment related attributes to this task: " + JSON.stringify(lonelyTask) + "this is the tree for reference: " + JSON.stringify(tree) ;
  }

  if (!threadId) {
    // create a thread
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }

  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: prompt
  });

  // create a run
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistant.id,
  });

  if (run.status === 'completed') {
    const responseData = await openai.beta.threads.messages.list(run.thread_id);
    const newTree = JSON.parse(responseData.data[0].content[0].text.value);
    console.log("responseData from the addAttributesToTree function: ", responseData);
    console.log("newTree (parsed) from the addAttributesToTree function: ", newTree);
    return newTree;
  } else {
    console.log(run.status);
    throw new Error(`OpenAI run failed with status: ${run.status}`);
  }
}