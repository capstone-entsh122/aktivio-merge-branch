const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { 
  userSignup, 
  userLogin,
  getUserDetails, 
  updateUserDetails, 
  deleteUserAccount, 
  updateUserPreference, 
  getProfilePhoto, 
  uploadProfilePhoto,
  joinCommunity,
  leaveCommunity,
  listJoinedCommunities,
  saveLocation
 } = require('../controllers/user.controller.js');
const upload = require('../middlewares/upload.js'); // Multer middleware for handling file uploads
const validator = require('../middlewares/validator.js');
//TODO: Add authenticate middleware to protect routes
router.post('/signup',validator, userSignup);
router.post('/login',validator, userLogin); 

router.route('/profile')
  .get(authenticate, getUserDetails)
  .put(authenticate, updateUserDetails);

router.delete('/delete', authenticate, deleteUserAccount);

router.route('/profile/photo')
  .get(authenticate, getProfilePhoto)
  .post(authenticate, upload.single('profilePhoto'), uploadProfilePhoto);

router.route('/preference')
  .post(authenticate, updateUserPreference)
  .put(authenticate, updateUserPreference);

// Join a community
router.put('/memberships/:communityId', authenticate, joinCommunity);

// Leave a community
router.delete('/memberships/:communityId', authenticate, leaveCommunity);

// List communities joined by the user
router.get('/memberships', authenticate, listJoinedCommunities);

// Save location
router.post('/location', authenticate, saveLocation);

module.exports = {routes: router};
