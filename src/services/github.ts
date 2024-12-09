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
