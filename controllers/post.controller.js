const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const { bucket } = require('../config/gcsClient');
const uploadFile = require('../helpers/uploadFile');
const formatResponse = require('../helpers/responseFormatter');
const isMemberOfCommunity = require('../helpers/isMemberOfCommunity');
const path = require('path');


/**
 * @function createPost
 * @description This function creates a new post with optional images. 
 * It extracts the post content, author, and community ID from the request body and optionally handles file uploads. The post is then saved to the database, and a JSON response with the created post is sent.
 * 
 * @param {Object} req - Express request object containing the post data in the body and an optional file.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { communityId } = req.params;
  const file = req.file;
  const userId = req.user.uid;

  try {
    const isMember = await isMemberOfCommunity(communityId, userId);
    if (!isMember) {
      return res.status(403).json(formatResponse('User is not a member of the community'));
    }

    let imagePaths = [];
    if (file) {
      const filePath = `post-images/${Date.now()}_${path.basename(file.originalname)}`;
      const imagePath = await uploadFile(file, filePath);
      imagePaths = [imagePath];
    }

    const postData = {
      title,
      content,
      author: userId, // Use userId as the author
      communityId,
      imagePaths,
    };

    const post = await PostModel.createPost(postData);
    res.status(201).json(formatResponse('Post created successfully', null, post));
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};



/**
 * @function getPostById
 * @description This function retrieves a post by its ID. 
 * It extracts the post ID from the request parameters, attempts to fetch the post from the database, generates signed URLs for any image paths, and sends a JSON response with the post data or an error message.
 * 
 * @param {Object} req - Express request object containing the post ID in the URL parameters.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const getPostById = async (req, res) => {
  try {
    // Extract post ID from request parameters
    const { postId } = req.params;

    // Attempt to fetch the post by ID
    const post = await PostModel.getPostById(postId);

    // If the post is not found, send a 404 response
    if (!post) {
      return res.status(404).json(formatResponse('Post not found'));
    }

    // Fetch the author details
    const author = await UserModel.getUserById(post.author);
    if (author) {
      post.authorName = author.displayName;
    } else {
      post.authorName = 'Unknown';
    }

    // Generate signed URLs for image paths if they exist
    if (post.imagePaths) {
      const signedUrls = await Promise.all(post.imagePaths.map(async (path) => {
        const options = {
          version: 'v4',
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60, // 1 hour
        };
        const [url] = await bucket.file(path).getSignedUrl(options);
        return url;
      }));
      post.imageUrls = signedUrls;
      delete post.imagePaths; // Remove the imagePaths field
    }

    // Send a successful response with the post data
    res.status(200).json(formatResponse('Success', null, post));
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error getting post:', error);

    // Send an error response with a 500 status code and error message
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


/**
 * @function listPostsByCommunity
 * @description This function lists all posts by a specific community ID.
 *  It extracts the community ID from the request parameters, attempts to fetch the list of posts from the database, and sends a JSON response with the list of posts or an error message.
 * 
 * @param {Object} req - Express request object containing the community ID in the URL parameters.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const listPostsByCommunity = async (req, res) => {
  const { communityId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startAfter = req.query.startAfter || null;

  try {
    const posts = await PostModel.listPostsByCommunity(communityId, limit, startAfter);

    const postsWithAuthorsAndImages = await Promise.all(posts.map(async post => {
      const author = await UserModel.getUserById(post.author);
      post.authorName = author ? author.displayName : 'Unknown';

      if (post.imagePaths) {
        const signedUrls = await Promise.all(post.imagePaths.map(async (path) => {
          const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
          };
          const [url] = await bucket.file(path).getSignedUrl(options);
          return url;
        }));
        post.imageUrls = signedUrls;
        delete post.imagePaths;
      }

      post.createdAt = post.createdAt.toDate().toISOString(); // Convert Firestore timestamp to ISO string
      post.updatedAt = post.updatedAt.toDate().toISOString();

      return post;
    }));

    res.status(200).json(formatResponse('Success', null, postsWithAuthorsAndImages));
  } catch (error) {
    console.error('Error listing posts:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;

    const post = await PostModel.getPostById(postId);
    if (!post) {
      return res.status(404).json(formatResponse('Post not found'));
    }

    if (post.author !== userId) {
      return res.status(403).json(formatResponse('Not authorized to delete this post'));
    }

    await PostModel.deletePostById(postId);

    res.status(200).json(formatResponse('Post deleted successfully'));
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};




module.exports = {
  createPost,
  getPostById,
  listPostsByCommunity,
  deletePost,
};
