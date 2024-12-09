import OpenAI from 'openai';
import { TreeNode } from '../types/tree';
import { object, z } from 'zod';

const PROJECT_MANAGER_ASSISTANT_ID = "asst_uoqTiJO5E9UAEY2f3ZJNIi8L";
const SENIOR_DEVELOPER_ASSISTANT_ID = "asst_5krcIPLblqj9rjKFB3rkjnLF";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Functions to manage the project tree structure.