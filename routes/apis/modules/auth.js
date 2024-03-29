const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const passport = require('../../../config/passport')
const { authenticated } = require('../../../middleware/api-auth')
const authController = require('../../../controllers/apis/auth-controller')

router.post('/server/sendEmail', authenticated, authController.sendEmail)

router.post('/checkLogin', userController.checkLoginFbGl)
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { successRedirect: `${process.env.CORS_ORIGIN}/auth/login` })
)

router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
)
router.get(
  '/google/callback',
  passport.authenticate('google', { successRedirect: `${process.env.CORS_ORIGIN}/auth/login` })
)

module.exports = router
