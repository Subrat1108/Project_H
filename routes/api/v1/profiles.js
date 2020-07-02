const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const auth = require('../../../middleware/auth');
const Profile = require('../../../models/Profile');
const User = require('../../../models/User');

//@route  GET api/v1/profile/me
//@desc   Get auth user profile
//access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).send('server error');
  }
});

//@route  Post api/v1/profile/
//@desc   Create or Update user profile
//access  Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skill is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      facebook,
      youtube,
      linkedin,
      twitter,
      instagram,
    } = req.body;

    let profilePayload = {};
    profilePayload.user = req.user.id;
    if (company) profilePayload.company = company;
    if (website) profilePayload.website = website;
    if (location) profilePayload.location = location;
    if (status) profilePayload.status = status;
    if (bio) profilePayload.bio = bio;
    if (githubusername) profilePayload.githubusername = githubusername;
    if (skills) {
      profilePayload.skills = skills.split(',').map(skill => skill.trim());
    }
    profilePayload.social = {};
    if (facebook) profilePayload.social.facebook = facebook;
    if (youtube) profilePayload.social.youtube = youtube;
    if (linkedin) profilePayload.social.linkedin = linkedin;
    if (twitter) profilePayload.social.twitter = twitter;
    if (instagram) profilePayload.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilePayload },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profilePayload);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error('errr', e);

      res.status(500).send('server error');
    }
  }
);

//@route  GET api/v1/profile/
//@desc   Get all profiles
//access  Public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).send('server error');
  }
});

//@route  GET api/v1/profile/user/:user_id
//@desc   Get single user's profile
//access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    res.json(profile);
  } catch (e) {
    if (e.kind === 'ObjectId')
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    res.status(500).send('server error');
  }
});

//@route  PUT api/v1/profile/experience
//@desc   Add experience
//access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    let { title, company, location, from, to, current, description } = req.body;

    const experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });
      if (!profile) {
        return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
      }
      profile.experience.unshift(experience);
      await profile.save();
      res.json(profile);
    } catch (e) {
      res.status(500).send('server error');
    }
  }
);

//@route  DELETE api/v1/profile/experience/:exp_id
//@desc   Delete an experience
//access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send(`server error`);
  }
});

//@route  PUT api/v1/profile/education
//@desc   Add education
//access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    let {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const education = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });
      if (!profile) {
        return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
      }
      profile.education.unshift(education);
      await profile.save();
      res.json(profile);
    } catch (e) {
      res.status(500).send('server error');
    }
  }
);

//@route  DELETE api/v1/profile/education/:edu_id
//@desc   Delete an education
//access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send(`server error`);
  }
});

//@route  GET api/v1/profile/github/:username
//@desc   Get user github details
//access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const payload = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'git_clientId'
      )}&client_secret=${config.get('git_clientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(payload, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Github profile not found' }] });
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(e.message);
    res.status(500).send(`server error`);
  }
});

module.exports = router;
