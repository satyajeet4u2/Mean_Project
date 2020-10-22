const express = require('express');
const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router = express.Router();
const postController = require('../controllers/postController')


router.post("", checkAuth, extractFile, postController.createNewPost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.get('', postController.getAllPost);

router.get('/:id', postController.getOnePost)

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router
