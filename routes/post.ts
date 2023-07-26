export {};
const express = require('express');

const postController = require('../controllers/post');

const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostById);

router.post('/', checkAuth, postController.createPost);

router.put('/:id', checkAuth, postController.editPost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;