require('require-dir')('./tasks', {
  recurse: false,
  filter: abspath => {
    return !(abspath.endsWith('env.js') || abspath.endsWith('utils.js'))
  }
})
