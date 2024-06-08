const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads
const {
  createPost,
  getPostById,
  listPostsByCommunity,
  deletePost,
} = require('../controllers/post.controller');

// Post routes
router.post('/', authenticate, upload.single('image'), createPost);
router.get('/:postId', authenticate, getPostById);
router.get('/', authenticate, listPostsByCommunity);
router.delete('/:postId', authenticate, deletePost);



module.exports = router ;
