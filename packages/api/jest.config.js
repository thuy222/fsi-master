const ignores = ['/build/', '/dist/', '/node_modules/', '/data/']

module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ignores,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80
    }
  },
  testPathIgnorePatterns: ignores
}
