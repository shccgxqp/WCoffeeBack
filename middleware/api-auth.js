const passport = require('../config/passport') // 引入 passport

const authenticated = (req, res, next) => {
  if (!req.user) {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) return reject(new Error('使用者沒有權限，請先登入!!!'))
        req.user = user
        resolve()
      })(req, res, next)
    })
      .then(() => next())
      .catch(err => {
        console.error(err.message)
        res.status(401).json({ status: 'error', message: err.message })
      })
  } else {
    next()
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied!!' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
}
