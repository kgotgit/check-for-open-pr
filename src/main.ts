import * as core from '@actions/core'
import * as github from '@actions/github';
import { PullRequest } from '@octokit/webhooks-types';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const sha: string = github.context.sha;
    const token : string = core.getInput('token');
    
    const octokit = github.getOctokit(token);

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: 'open',
    });

    console.log(pullRequests);

    const activePR: PullRequest | undefined = (pullRequests as PullRequest[]).find((pr: PullRequest) => pr.head.sha === sha);

    if (activePR) {
      core.info(`Active pull request found: ${activePR.html_url}`);
    } else {
      core.info('No active pull request found for the given SHA.');
    }


  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
