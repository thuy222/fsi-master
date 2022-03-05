const ignores = [
  '/build/',
  '/dist/',
  '/node_modules/',
  'environment.js',
  'messages.js'
]

module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ignores,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 90,
      lines: 30,
      statements: -90
    }
  },
  testPathIgnorePatterns: ignores
}
