const gulp = require('gulp')
const { dir, exec } = require('./utils')

gulp.task('lint', async () => {
  ['@fsi/api'].forEach(pkg => {
    exec('yarn', ['workspace', pkg, 'lint'], { cwd: dir.root })
  })
})
