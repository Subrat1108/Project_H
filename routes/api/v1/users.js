const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const Post = require('../../../models/Post');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../../middleware/auth');

//@route  POST api/v1/user
//@desc   User Registration
//access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email id').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more charcters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      let avatar = gravatar.url(email, {
        r: 'pg',
        s: '200',
        d: 'mm',
      });

      let salt = await bcrypt.genSalt(10);
      let p_hash = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: p_hash,
        avatar,
      });

      await user.save();

      let payload = {
        user: {
          id: user.id, //not taking '_id', since mongoose abstracts it to 'id'
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send('server error');
    }
  }
);

//@route  DELETE api/v1/user/
//@desc   Completely delete auth user
//access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'user removed successfully' });
  } catch (e) {
    res.status(500).send('server error');
  }
});

module.exports = router;
