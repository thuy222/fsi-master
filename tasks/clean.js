const gulp = require('gulp')
const { dir, exec } = require('./utils')

gulp.task('clean', async () => {
  ['@fsi/api'].forEach(pkg => {
    exec('yarn', ['workspace', pkg, 'clean'], { cwd: dir.root })
  })
  exec('rimraf', ['build'], { cwd: dir.root })
})
