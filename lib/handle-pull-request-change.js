const stateChange = require('./state-changed')

module.exports = handlePullRequestChange

async function handlePullRequestChange (context, config) {
let { head, body } = context.payload.pull_request
console.log(body);
if(!body) {
  return stateChange(context, head, 'pending', 'Description Missing')
}

body = body.toLowerCase();

let checks = ['jira url', 'things to be tested', 'deployment type', 'collaborators'];

let res = checks.map(function(check) {
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
})
console.log(res)
if ((i = res.indexOf(false)) >= 0) {
  //console.log('Status Pending')
  return stateChange(context, head, 'pending', checks[i].toUpperCase() + ' Missing')
}
return stateChange(context, head, 'success', 'All good') 
}