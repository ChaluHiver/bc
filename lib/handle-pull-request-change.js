module.exports = handlePullRequestChange

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

async function handlePullRequestChange (context, config) {
  let { title, head, body } = context.payload.pull_request
  //console.log(body);

  if(!body) {
    return stateChange(context, head, 'pending', 'Description Missing')
  }

  body = body.toLowerCase();

  let checks = ['jira url', 'things to be tested', 'deployment type', 'collaborators'];

  let res = checks.map(function(check) {
    try {
      if (body.includes(check)) {
        let x = body.split(check+':')[1]
        
        if (!x)
          return false

        if (x) 
          x = x.split('\n')[0]
          if (x) 
            x = x.trim()

        if (!x) 
          return false
        return [true, x];
      }
      return false
    }
    catch (ex) {
      return false
    }
  })
  console.log(res)
  if ((i = res.indexOf(false)) >= 0) {
    //console.log('Status Pending')
    return stateChange(context, head, 'pending', checks[i].toUpperCase() + ' Missing')
  }

  const wipPresent = title.includes('WIP:')

  const state = wipPresent ? 'pending' : 'success'

  return stateChange(context, head, state, 'WIP present check')
}
