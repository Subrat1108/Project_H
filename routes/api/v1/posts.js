const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Profile = require('../../../models/Profile');
const User = require('../../../models/User');
const Post = require('../../../models/Post');
const { post } = require('./users');

//@route  POST api/v1/post
//@desc   Create a new post
//access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error('errr', error);
      res.status(500).send('server error');
    }
  }
);

//@route  GET api/v1/post
//@desc   Get all posts
//access  Private
router.get('/', auth, async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error('errr', error);
    res.status(500).send('server error');
  }
});

//@route  GET api/v1/post/:id
//@desc   Get a post by id
//access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post)
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    // if (post.user.toString() !== req.user.id)
    //   return res.status(401).json({ errors: [{ msg: 'Invalid user' }] });
    res.json(post);
  } catch (error) {
    console.error('errr', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    }
    res.status(500).send('server error');
  }
});

//@route  DELETE api/v1/post/:id
//@desc   Delete a post by id
//access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post)
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ errors: [{ msg: 'Invalid user' }] });
    post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (error) {
    console.error('errr', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    }
    res.status(500).send('server error');
  }
});

//@route  PUT api/v1/post/like/:id
//@desc   Like or unlike a post
//access  Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);
    if (!post)
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      res.json(post.likes);
    } else {
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    }
  } catch (error) {
    console.error('errr', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    }
    res.status(500).send('server error');
  }
});

//@route  POST api/v1/post/comment/:post_id
//@desc   Create a new comment
//access  Private
router.post(
  '/comment/:post_id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error('errr', error);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
      }
      res.status(500).send('server error');
    }
  }
);

//@route  DELETE api/v1/post/comment/:post_id/:comment_id
//@desc   Delete a comment
//access  Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    }
    let comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment)
      return res.status(400).json({ errors: [{ msg: 'Comment not found' }] });
    if (comment.user.toString() !== req.user.id)
      return res.status(401).json({ errors: [{ msg: 'User unauthorised' }] });

    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error('errr', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ errors: [{ msg: 'Post not found' }] });
    }
    res.status(500).send('server error');
  }
});

module.exports = router;
