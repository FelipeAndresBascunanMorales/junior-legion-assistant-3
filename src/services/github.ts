import { Octokit } from 'octokit';
import { TreeNode } from '../types/tree';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

const REPO_OWNER = 'FelipeAndresBascunanMorales';
const REPO_NAME = 'eschatological-messages';
const BRANCH = 'junior-partner-contributor';

interface TreeData {
  tree: TreeNode;
  timestamp: number;
  version: string;
}

interface ContentData {
  type: 'repository_contents',
  base_path: 'app/',
  files: [{
    path: string,
    content: string
  }],
  task_solved: "task identifier"
}

 // this code is working but JUST PUSH THE TREE to github
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

// this code push the changes on files according to the task solved
export async function commitAssistantResponse(assistantResponse: ContentData, branch = "junior-partner-contributor") {
  const { files, task_solved } = assistantResponse;
  
  try {
    // 1. Get the latest commit SHA
    const { data: ref } = await octokit.rest.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${branch}`,
    });
    const latestCommitSha = ref.object.sha;

    // // Check if branch already exists
    // try {
    //   await octokit.rest.git.getRef({
    //     owner: REPO_OWNER,
    //     repo: REPO_NAME,
    //     ref: `heads/${branch}`,
    //   });
    //   // If we get here, branch exists
    //   throw new Error(`Branch ${branch} already exists`);
    // } catch (error: any) {
    //   // 404 means branch doesn't exist, which is what we want
    //   if (error.status !== 404) {
    //     throw error;
    //   }
    // }

    const newBranch = branch;
    // if (branch !== "junior-partner-contributor") {
    //   // 2. Create a new branch for these changes
    //   newBranch = `feature/${task_solved}`;
    //   await octokit.rest.git.createRef({
    //   owner: REPO_OWNER,
    //   repo: REPO_NAME,
    //     ref: `refs/heads/${newBranch}`,
    //     sha: latestCommitSha,
    //   });
    // }
    // else {
    //   newBranch = branch;
    // }

    // 3. Create blobs for each file
    const fileBlobs = await Promise.all(
      files.map(async file => {
        console.log('file', file);
        const cleanPath = file.path.replace(/\/+$/, '').replace('tsx.ts', 'tsx');

        const { data: blob } = await octokit.rest.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content: file.content,
          encoding: "utf-8",
        });

        return {
          path: cleanPath,
          sha: blob.sha,
          mode: "100644",
          type: "blob",
        };
      })
    );

    //fixed with ai... i must check this behavior
    // 4. Create a tree
    const { data: tree } = await octokit.rest.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: latestCommitSha,
      tree: fileBlobs.map(blob => ({
        ...blob,
        mode: "100644" as const,
        type: "blob" as const
      })),
    });

    // 5. Create a commit
    const { data: commit } = await octokit.rest.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: `feat: ${task_solved}`,
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // 6. Update the branch reference
    await octokit.rest.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${newBranch}`,
      sha: commit.sha,
    });

    // 7. Create a pull request
    const { data: pr } = await octokit.rest.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `Feature: ${task_solved}`,
      head: newBranch,
      base: "main",
      body: `Automated changes by assistant for task: ${task_solved}`,
    });

    return {
      success: true,
      pullRequest: pr.html_url,
      branch: newBranch,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getRepoContents() {
  // Get the tree recursively
  const { data: { tree } } = await octokit.rest.git.getTree({
    owner: "FelipeAndresBascunanMorales",
    repo: "eschatological-messages",
    tree_sha: "junior-partner-contributor", // or your branch
    recursive: "1"
  });

  // Get file paths and their streams
  const fileStreams = await Promise.all(
    tree
      .filter(item => item.type === "blob" && item.path?.startsWith("app/") && (item.path?.endsWith('.tsx') || item.path?.endsWith('.ts')))
      .map(async file => {
        const { data } = await octokit.rest.git.getBlob({
          owner: "FelipeAndresBascunanMorales",
          repo: "eschatological-messages",
          file_sha: file.sha ?? ''
        });

        const base64ToUint8Array = (base64: string) => {
          const binaryString = atob(base64); // Decode base64 to a binary string
          const length = binaryString.length;
          const bytes = new Uint8Array(length);
      
          for (let i = 0; i < length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
      
          return bytes;
        };
        const decodedContent = base64ToUint8Array(data.content);
        // Create a Readable Stream that OpenAI can consume
        return new File(
          [decodedContent],
          file.path?.replace('tsx', 'tsx.ts') ?? '',
          { type: 'ts' }
        );
      })
    );

  return fileStreams;
}

// With rate limiting and batching
export async function handleLargeRepo() {
  const { data: { tree } } = await octokit.rest.git.getTree({
    owner: "FelipeAndresBascunanMorales",
    repo: "eschatological-messages",
    tree_sha: "junior-partner-contributor",
    recursive: "1"
  });

  const srcFiles = tree.filter(item => 
    item.type === "blob" && 
    item.path?.startsWith("app/")
  );

  // Process in batches
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < srcFiles.length; i += batchSize) {
    const batch = srcFiles.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async file => {
        const { data } = await octokit.rest.git.getBlob({
          owner: "FelipeAndresBascunanMorales",
          repo: "eschatological-messages",
          file_sha: file.sha ?? ''
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