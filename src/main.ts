import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { wait } from './wait'

async function generateBranchName(): Promise<string> {
  // Use the current branch name from the GitHub context
  const branchName = process.env['GITHUB_HEAD_REF']
  if (!branchName) {
    throw new Error("Cannot auto generate a branch name. GITHUB_HEAD_REF environment variable is not set. Please set a branch name manually.")
  }

  // Replace '/' with '-'
  const formattedBranchName = branchName.replace(/\//g, '-').toLowerCase()
  return formattedBranchName
}

async function branchExists(
  organization: string,
  database: string,
  branch: string
): Promise<boolean> {
  let exists = false

  const options: exec.ExecOptions = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      const output = data.toString().trim()
      if (output !== '') {
        exists = true
      }
    },
    stderr: (data: Buffer) => {
      core.debug(data.toString())
    }
  }

  try {
    await exec.exec(
      'pscale',
      ['branch', 'show', database, branch, '--org', organization],
      options
    );
  } catch (error) {
    if (error instanceof Error) {
      core.debug(`Error executing command: ${error.message}`)
    }
    // Set exists to false in case of any errors
    exists = false
  }

  return exists
}

async function waitForBranchReady(
  organization: string,
  database: string,
  branch: string
): Promise<void> {
  let ready = false

  while (!ready) {
    const options: exec.ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        const output = data.toString().trim()
        try {
          const branchInfo = JSON.parse(output)
          if (branchInfo.ready === true) {
            ready = true
          }
        } catch (error) {
          if (error instanceof Error) {
            core.debug(`Error parsing JSON output: ${error.message}`)
          }
        }
      },
      stderr: (data: Buffer) => {
        core.debug(data.toString())
      }
    }

    try {
      // Check if the branch is ready
      await exec.exec(
        'pscale',
        ['branch', 'show', database, branch, '--org', organization, '-f', 'json'],
        options
      );
    } catch (error) {
      if (error instanceof Error) {
        core.debug(`Error executing command: ${error.message}`)
      }
      // Stop waiting in case of any errors
      break;
    }

    if (!ready) {
      // Wait for 5 seconds before checking again
      core.info(`Branch '${branch}' not ready yet. Waiting for 5 seconds...`)
      await wait(5000)
    }
  }
}

async function run(): Promise<void> {
  try {
    const organization = process.env['ORGANIZATION'] || '';
    const database = process.env['DATABASE'] || ''
    const branch = process.env['BRANCH'] || (await generateBranchName())
    const shouldWait = process.env['WAIT'] || false

    core.info(`branch '${branch}',database '${database}', organization '${organization}'.`)

    const exists = await branchExists(organization, database, branch)

    if (exists) {
      core.info(`Branch '${branch}' already exists. Will use it.`)
    } else {
      core.info(`Creating '${branch}'.`)

      await exec.exec(
        'pscale',
        ['branch', 'create', database, branch, '--org', organization]
      )

      if (shouldWait) {
        await waitForBranchReady(organization, database, branch)
      }
      core.info(`Branch '${branch}' is ready.`)
    }

    core.info(`Connecting to '${branch}'.`)
    await exec.exec(
      'pscale',
      ['connect', database, branch, '--org', organization, '&']
    )

    // set output of DATABASE_URL to value of DATABASE_URL
    core.setOutput('DATABASE_URL', process.env['DATABASE_URL'])
    core.info(`DATABASE_URL: ${process.env['DATABASE_URL']}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
