const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const passport = require('../../../config/passport')

router.post('/checkLogin', userController.checkLoginFbGl)
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { successRedirect: `${process.env.CORS_ORIGIN}/auth/login` })
)
router.get(
  '/google/callback',
  passport.authenticate('google', { successRedirect: `${process.env.CORS_ORIGIN}/auth/login` })
)

module.exports = router
