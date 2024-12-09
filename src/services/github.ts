import { Octokit } from 'octokit';
import { TreeNode } from '../types/tree';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

const REPO_OWNER = 'FelipeAndresBascunanMorales';
const REPO_NAME = 'junior-legion-assistant-3';
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
      content: btoa(JSON.stringify(treeData, null, 2)),
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



export async function getRepoContents() {
  // Get the tree recursively
  const { data: { tree } } = await octokit.git.getTree({
    owner: "FelipeAndresBascunanMorales",
    repo: "junior-legion-assistant-3",
    tree_sha: "junior-partner-contributor", // or your branch
    recursive: "1"
  });

  // Filter for src/ files
  const srcFiles = tree.filter(item => 
    item.type === "blob" && 
    item.path.startsWith("src/")
  );

  // Get content for each file
  const contents = await Promise.all(
    srcFiles.map(async file => {
      const { data } = await octokit.git.getBlob({
        owner: "username",
        repo: "repo",
        file_sha: file.sha
      });

      return {
        path: file.path,
        content: Buffer.from(data.content, 'base64').toString()
      };
    })
  );

  return contents;
}

// With rate limiting and batching
export async function handleLargeRepo() {
  const { data: { tree } } = await octokit.git.getTree({
    owner: "username",
    repo: "repo",
    tree_sha: "main",
    recursive: "1"
  });

  const srcFiles = tree.filter(item => 
    item.type === "blob" && 
    item.path.startsWith("src/")
  );

  // Process in batches
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < srcFiles.length; i += batchSize) {
    const batch = srcFiles.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async file => {
        const { data } = await octokit.git.getBlob({
          owner: "username",
          repo: "repo",
          file_sha: file.sha
        });

        return {
          path: file.path,
          content: Buffer.from(data.content, 'base64').toString()
        };
      })
    );
    results.push(...batchResults);
    
    // Optional: Add delay between batches
    if (i + batchSize < srcFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}