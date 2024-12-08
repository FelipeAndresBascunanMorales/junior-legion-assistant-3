import { Octokit } from 'octokit';
import { TreeNode } from '../types/tree';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

const REPO_OWNER = 'your-username';
const REPO_NAME = 'your-repo';
const BRANCH = 'main';

interface TreeData {
  tree: TreeNode;
  timestamp: number;
  version: string;
}

export async function pushTreeToGithub(tree: TreeNode): Promise<void> {
  try {
    const treeData: TreeData = {
      tree,
      timestamp: Date.now(),
      version: '1.0.0'
    };

    // Get the latest commit SHA
    const { data: ref } = await octokit.rest.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BRANCH}`
    });

    const { data: commit } = await octokit.rest.git.getCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      commit_sha: ref.object.sha
    });

    // Create a new blob with the tree data
    const { data: blob } = await octokit.rest.git.createBlob({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      content: Buffer.from(JSON.stringify(treeData, null, 2)).toString('base64'),
      encoding: 'base64'
    });

    // Create a new tree
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: commit.tree.sha,
      tree: [{
        path: 'tree-data.json',
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      }]
    });

    // Create a new commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: 'Update tree data',
      tree: newTree.sha,
      parents: [ref.object.sha]
    });

    // Update the reference
    await octokit.rest.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BRANCH}`,
      sha: newCommit.sha
    });
  } catch (error) {
    console.error('Failed to push to GitHub:', error);
    throw new Error('Failed to push to GitHub');
  }
}