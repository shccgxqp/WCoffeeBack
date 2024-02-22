const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models');
const { User } = db;

const userController = {
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON();
      delete userData.password;
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
      return cb(null, { token, user: userData });
    } catch (err) {
      cb(err);
    }
  },
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error('Passwords do not match!');
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!');
        return bcrypt
          .hash(req.body.password, 10)
          .then(hash =>
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            })
          )
          .then(user => {
            const userData = user.toJSON();
            delete userData.password;
            return cb(null, { data: { message: '註冊成功!', user: userData } });
          });
      })
      .catch(err => cb(err));
  },
};
module.exports = userController;
