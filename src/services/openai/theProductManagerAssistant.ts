import OpenAI from "openai";
import { TreeNode } from "../../types/tree";

const PROJECT_MANAGER_ASSISTANT_ID = "asst_uoqTiJO5E9UAEY2f3ZJNIi8L";

export async function callGenerateTreeContent(
    currentNode: TreeNode | null,
    tree: TreeNode | null,
    prompt: string,
    openai: OpenAI
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