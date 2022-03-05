const gulp = require('gulp')
const chalk = require('chalk')
const { dir, exec } = require('./utils')

const print = pkg => {
  console.log(
    `${chalk.white.bgBlue(
      `[${pkg}]`
    )} ------------------------------------------------------------------------------------------`
  )
}

gulp.task('test:@fsi/core', async () => {
  print('@fsi/core')
  const args = ['workspace', '@fsi/core', 'test']
  exec('yarn', args, { cwd: dir.root })
})

gulp.task('test:@fsi/api', async () => {
  print('@fsi/api')
  const args = ['workspace', '@fsi/api', 'test']
  exec('yarn', args, { cwd: dir.root })
})

gulp.task(
  'test',
  gulp.series(
    'test:@fsi/core',
    'test:@fsi/api',
    async () => {
    }
  )
)
