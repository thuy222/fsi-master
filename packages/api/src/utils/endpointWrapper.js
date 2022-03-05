export default (fn) => (req, res, next) => {
  const isAsync = fn.constructor.name === 'AsyncFunction'
  if (isAsync) {
    fn(req, res, next).catch((e) => next(e))
  } else {
    try {
      fn(req, res, next)
    } catch (e) {
      next(e)
    }
  }
}
