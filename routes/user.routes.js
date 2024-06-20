const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');


const { 
  updateFcmTokenController,
  userSignup, 
  getUserDetails, 
  updateUserDetails, 
  deleteUserAccount, 
  updateUserPreference, 
  getProfilePhoto, 
  uploadProfilePhoto,
  joinCommunity,
  leaveCommunity,
  listJoinedCommunities,
 } = require('../controllers/user.controller.js');
const upload = require('../middlewares/upload.js'); // Multer middleware for handling file uploads

//TODO: Add authenticate middleware to protect routes
router.post('/signup', authenticate, userSignup);

router.route('/profile')
  .get(authenticate, getUserDetails)
  .put(authenticate, updateUserDetails);

router.delete('/delete', authenticate, deleteUserAccount);

router.route('/profile/photo')
  .get(authenticate, getProfilePhoto)
  .post(authenticate, upload.single('profilePhoto'), uploadProfilePhoto);

router.route('/preferences')
  .post(authenticate, updateUserPreference)
  .put(authenticate, updateUserPreference);

// Join a community
router.put('/memberships/:communityId', authenticate, joinCommunity);

// Leave a community
router.delete('/memberships/:communityId', authenticate, leaveCommunity);

// List communities joined by the user
router.get('/memberships', authenticate, listJoinedCommunities);

router.post('/update-token', updateFcmTokenController);


module.exports = {routes: router};
