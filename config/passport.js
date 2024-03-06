const passport = require('passport')
const passportJWT = require('passport-jwt')

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
          if (!user) {
            throw new Error('信箱或密碼錯誤，請重新輸入！')
          }
          const res = await bcrypt.compare(password, user.password)
          if (!res) {
            throw new Error('信箱或密碼錯誤，請重新輸入！')
          }
          return cb(null, user)
        } catch (err) {
          return cb(err)
        }
      })()
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
    ExtractJWT.fromAuthHeaderAsBearerToken(),
    ExtractJWT.fromHeader('token'),
    ExtractJWT.fromUrlQueryParameter('token'),
    extractTokenFromCookie,
  ]),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id, {
      include: [
        // { model: Restaurant, as: 'FavoritedRestaurants' },
        // { model: Restaurant, as: 'LikedRestaurants' },
        // { model: User, as: 'Followers' },
        // { model: User, as: 'Followings' }
      ],
    })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  })
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    // include: [
    //   { model: Restaurant, as: 'FavoritedRestaurants' },
    //   { model: Restaurant, as: 'LikedRestaurants' },
    //   { model: User, as: 'Followers' },
    //   { model: User, as: 'Followings' }
    // ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
