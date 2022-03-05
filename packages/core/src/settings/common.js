module.exports = {
  envName: { $env: 'ENV_NAME', $default: 'UNKNOWN' },
  activeTabTime: { $env: 'ACTIVE_TIME_MS', $default: 15 * 1000 }
}
