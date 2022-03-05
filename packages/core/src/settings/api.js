const { env } = process

module.exports = {
  uamBaseUrl: env.UAM_BASE_URL || 'http://localhost:3001/DEVLOCAL',
  uamSecretKey: env.UAM_SECRET_KEY || 'RXAjqOjADR9rp83cfEUOkdY96Qu13tRQUNhHRHGH80M'
}
