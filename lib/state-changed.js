module.exports = stateChange

async function stateChange(context, head, state, desc) {
  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/ChaluHiver',
    description: desc,
    context: 'Pull Request Tests'
  }

  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}