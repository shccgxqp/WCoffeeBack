const passport = require('passport')
const passportJWT = require('passport-jwt')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const LocalStrategy = require('passport-local')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // authenticate user
    (req, email, password, cb) => {
      ;(async () => {
        try {
          const user = await User.findOne({ where: { email } })
          const error = new Error('信箱或密碼錯誤，請重新輸入！')
          error.status = 401
          if (!user) throw error
          const res = await bcrypt.compare(password, user.password)
          if (!res) throw error

          return cb(null, user)
        } catch (err) {
          return cb(err)
        }
      })()
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'displayName'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile._json.email
        const last_name = profile.displayName.substr(0, 1)
        const first_name = profile.displayName.substr(1)
        const user = await User.findOne({ where: { email } })
        if (user) return cb(null, user)
        const randomPwd = Math.random().toString(36).slice(-8)
        const hash = await bcrypt.hash(randomPwd, 10)
        const userData = {
          last_name,
          first_name,
          email,
          password: hash,
        }
        const newUser = await User.create(userData)
        cb(null, newUser)
      } catch (err) {
        cb(err)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { email, family_name, given_name } = profile._json
        const user = await User.findOne({ where: { email } })
        if (user) return cb(null, user)
        const randomPwd = Math.random().toString(36).slice(-8)
        const hash = await bcrypt.hash(randomPwd, 10)
        const userData = {
          last_name: family_name,
          first_name: given_name,
          email,
          password: hash,
        }
        const newUser = await User.create(userData)
        cb(null, newUser)
      } catch (err) {
        cb(err)
      }
    }
  )
)

const extractTokenFromCookie = req => {
  if (req && req.cookies && req.cookies.token) {
    return req.cookies.token
  }
  return null
}

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromExtractors([
    extractTokenFromCookie,
    ExtractJWT.fromAuthHeaderAsBearerToken(),
    ExtractJWT.fromHeader('token'),
    ExtractJWT.fromUrlQueryParameter('token'),
  ]),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then(user => cb(null, user))
      .catch(err => cb(err))
  })
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
