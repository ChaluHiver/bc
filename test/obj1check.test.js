const handlePullRequestChange = require('../lib/handle-pull-request-change')
const nock = require('nock')
const github = require('@octokit/rest')()

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

describe('handlePullRequestChange', () => {
  test('it is a function', () => {
    expect(typeof handlePullRequestChange).toBe('function')
  })

  test('sets `pending` status if PR doesnt have deployment type', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `Corner cases:
Configuration Changes:
JIRA url: xyz
Collaborators: chalukya
What can be affected:
Things to be tested:xyx 
Deployment Type: `
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'DEPLOYMENT TYPE Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })

test('sets `pending` status if PR doesnt have jira url missing', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `Corner cases:
Configuration Changes:
JIRA url: 
Collaborators: chalukya
What can be affected:
Things to be tested:xyx 
Deployment Type: tet `
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'JIRA URL Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })


test('sets `success` status if PR has everything', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `Corner cases:
Configuration Changes:
JIRA url: hsc
Collaborators: chalukya
What can be affected:
Things to be tested:xyx 
Deployment Type: tet `
    const expectedBody = {
      state: 'success',
      target_url: 'https://github.com/ChaluHiver',
      description: 'All good',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })


  test('sets `pending` status if body is missing', async () => {
    const context = buildContext()
    context.payload.pull_request.body = ``
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'Description Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })


  test('sets `pending` status if PR has everything', async () => {
    const context = buildContext()
    context.payload.pull_request.body = ` Corner cases:
    Configuration Changes:
    JIRA url: hsc
    Collaborators: chalukya
    What can be affected:
    Things to be tested:xyx `
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'DEPLOYMENT TYPE Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })





test('sets `pending` status if PR doesnt have Things to be tested', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `Corner cases:
Configuration Changes:
JIRA url: xyz
Collaborators: chalukya
What can be affected:
Things to be tested: 
Deployment Type: shcksn`
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'THINGS TO BE TESTED Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })



test('sets `pending` status if PR doesnt have Collaborators', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `Corner cases:
Configuration Changes:
JIRA url: xyz
Collaborators:
What can be affected:
Things to be tested:xyx 
Deployment Type: jdsnv`
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/ChaluHiver',
      description: 'COLLABORATORS Missing',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })




})

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({ owner: 'sally', repo: 'project-x' }, obj)
    },

    payload: {
      pull_request: {
        number: 123,
        title: 'do a thing',
        head: {
          sha: 'abcdefg'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

function unsemanticCommits () {
  return [
    { commit: { message: 'fix something' } },
    { commit: { message: 'fix something else' } }
  ]
}
