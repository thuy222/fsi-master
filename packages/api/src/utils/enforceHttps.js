import url from 'url'
import status from 'http-status'

export default (req, res, next) => {
  if (req.secure) {
    next()
  } else if (req.method === 'GET' || req.method === 'HEAD') {
    res.redirect(
      url.format({
        protocol: 'https',
        host: req.get('host'),
        pathname: req.originalUrl
      })
    )
  } else {
    res.status(status.BAD_REQUEST).json({
      error: 'invalid_request',
      error_description: 'do yourself a favor and only use https'
    })
  }
}
