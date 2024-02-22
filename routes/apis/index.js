const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const userController = require('../../controllers/apis/user-controller');

const { apiErrorHandler } = require('../../middleware/error-handler');
// const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.post('/signup', userController.signUp);

router.get('/users');

router.use('/', apiErrorHandler);

module.exports = router;
