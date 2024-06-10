const UserModel = require('../models/user.model.js');
const CommunityModel = require('../models/community.model.js');
const PostModel = require('../models/post.model.js');
const EventModel = require('../models/event.model.js');
const { firestore } = require('../config/firebaseAdmin.js');
const { bucket } = require('../config/gcsClient.js');
const uploadFile = require('../helpers/uploadFile.js');
const path = require('path');
const formatResponse = require('../helpers/responseFormatter.js');
const {registerUser, loginUser, generateCustomToken} = require('../services/auth.service.js');

// const { v4: uuidv4 } = require('uuid');


const getRecommendations = require('../helpers/getRecommendation');

/**
 * @function userSignup
 * @description This function handles user signup. It extracts user information from the request body, creates a new user in the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user data in the body.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const userSignup = async (req, res) => {
    const { email, password, displayName } = req.body;

    try {
        // Create the user in Firebase Authentication
        const userRecord = await registerUser(email, password);
        const userId = userRecord.uid;

        // Create the user in your database
        const user = await UserModel.createUser(userId, { email, displayName });

        // Generate a custom token for the newly registered user
        const token = await generateCustomToken(userId);

        res.status(200).json(formatResponse('Success', null, { user, token }));
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    const token = await generateCustomToken(user.uid);
    res.status(200).json(formatResponse('Success', null, { user, token }));
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json(formatResponse('Unauthorized', error.message));
  }

}

/**
 * @function getUserDetails
 * @description This function retrieves the details of the authenticated user. It extracts the user ID from the request, fetches the user data from the database, and sends a JSON response with the user details or an error message.
 * 
 * @param {Object} req - Express request object containing the user ID.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await UserModel.getUserById(userId);

        if (!user) {
            return res.status(404).json(formatResponse('User not found'));
        }

        res.status(200).json(formatResponse('Success', null, user));
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};

/**
 * @function updateUserDetails
 * @description This function updates the details of the authenticated user. It extracts the user ID from the request and the update data from the request body, updates the user in the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user ID and update data.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
// user.controller.js
const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.uid;
        const updateData = req.body;

        // await firestore.runTransaction(async (transaction) => {
            const user = await UserModel.updateUserById(userId, updateData);

            // if (updateData.displayName) {
            //     await PostModel.updateAuthorName(userId, updateData.displayName, transaction);
            //     await EventModel.updateCreatorName(userId, updateData.displayName, transaction);
            // }
        // });

        res.status(200).json(formatResponse('Success', null, user));
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};


/**
 * @function deleteUserAccount
 * @description This function deletes the authenticated user's account. It extracts the user ID from the request, deletes the user from the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user ID.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
// user.controller.js
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.uid;

        await firestore.runTransaction(async (transaction) => {
            // Get user details
            const user = await UserModel.getUserById(userId, transaction);
            if (!user) {
                throw new Error('User not found');
            }

            // Remove user from all communities they joined
            const communityIds = user.joinedCommunities || [];
            if (communityIds.length > 0) {
                await CommunityModel.removeUserFromAllCommunities(userId, communityIds, transaction);
            }

            // Check and delete all posts created by the user
            const userPostsSnapshot = await PostModel.getPostsByUser(userId, transaction);
            if (!userPostsSnapshot.empty) {
                await PostModel.deleteUserPosts(userId, transaction);
            }

            // Check and delete all events created by the user
            const userEventsSnapshot = await EventModel.getEventsByUser(userId, transaction);
            if (!userEventsSnapshot.empty) {
                await EventModel.deleteEventsByUser(userId, transaction);
            }

            // Check and remove user from all events they participated in
            const participantEventsSnapshot = await EventModel.getEventsByParticipant(userId, transaction);
            if (!participantEventsSnapshot.empty) {
                await EventModel.removeUserFromAllEvents(userId, transaction);
            }

            // Delete the user account
            await UserModel.deleteUserById(userId, transaction);
        });

        res.status(200).json(formatResponse('Success'));
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};



/**
 * @function updateUserPreference
 * @description This function updates the sports preferences of the authenticated user. It extracts the user ID from the request and the preference data from the request body, updates the preferences in the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user ID and preference data.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const updateUserPreference = async (req, res) => {
    const userId = req.user.uid;
    const {gender, age, equipment, motivation, availableTime, fitnessLevel, placePreference, socialPreference, diseaseHistory } = req.body;

    try {
        const user = await UserModel.updateUserPreference(userId, {gender, age, equipment, motivation, availableTime, fitnessLevel, placePreference, socialPreference, diseaseHistory });
        // const recommendations = await getRecommendations({ gender, age, equipment, motivation, availableTime, fitnessLevel, placePreference, socialPreference, diseaseHistory });
        res.status(200).json(formatResponse('Success', null, user));
    } catch (error) {
        console.error('Error updating preference:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
    };

/**
 * @function getProfilePhoto
 * @description This function retrieves the profile photo URL of the authenticated user. It extracts the user ID from the request, fetches the user data from the database, generates a signed URL for the profile photo, and sends a JSON response with the photo URL or an error message.
 * 
 * @param {Object} req - Express request object containing the user ID.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const getProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await UserModel.getUserById(userId);

        if (!user || !user.profilePhotoPath) {
            return res.status(404).json(formatResponse('Profile photo not found'));
        }

        // Generate signed URL for the profile photo
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
        };
        const [url] = await bucket.file(user.profilePhotoPath).getSignedUrl(options);
        console.log(`Signed URL: ${url}`);

        res.status(200).json(formatResponse('Success', null, { profilePhotoUrl: url }));
    } catch (error) {
        console.error('Error getting profile photo:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};

/**
 * @function uploadProfilePhoto
 * @description This function uploads a profile photo for the authenticated user. It extracts the user ID from the request and the file from the request body, uploads the file to the storage bucket, updates the user's profile photo path in the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user ID and the file.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const uploadProfilePhoto = async (req, res) => {
    const userId = req.user.uid;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `profile-photo/${userId}${path.extname(req.file.originalname)}`;

    try {
        const uploadedFilePath = await uploadFile(req.file, filePath);

        await UserModel.updateUserById(userId, { profilePhotoPath: uploadedFilePath });

        // Generate signed URL for the uploaded profile photo
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
        };
        const [url] = await bucket.file(uploadedFilePath).getSignedUrl(options);
        console.log(`Signed URL: ${url}`);

        res.status(200).json(formatResponse('Success', null, { profilePhotoUrl: url }));
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};

/**
 * @function joinCommunity
 * @description This function adds the authenticated user to a community. It extracts the user ID from the request and the community ID from the request body, adds the user to the community in the database, and sends a JSON response indicating success or failure.
 * 
 * @param {Object} req - Express request object containing the user ID and community ID.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
// Route: PUT /api/users/communities/:communityId/join
const joinCommunity = async (req, res) => {
    const userId = req.user.uid;
    const { communityId } = req.params;  // Get from URL parameter
  
    try {
      await CommunityModel.addMember(communityId, userId);
      const updatedUser = await UserModel.joinCommunity(userId, communityId);
      res.status(200).json(formatResponse('Success', null, updatedUser));
    } catch (error) {
      console.error('Error joining community:', error);
      const status = error.message.includes('not found') ? 404 : 500;
      const message = status === 404 ? `Community ${communityId} not found` : 'Internal Server Error';
      res.status(status).json(formatResponse(message, error.message));
    }
};

// Route: DELETE /api/users/communities/:communityId/membership
const leaveCommunity = async (req, res) => {
    const userId = req.user.uid;
    const { communityId } = req.params;  // Get from URL parameter
  
    try {
      await firestore.runTransaction(async (transaction) => {
        // Get events where the user is a participant
        const eventsSnapshot = await EventModel.getEventsByParticipant(userId, transaction);

        // Remove the user from the community members list
        await CommunityModel.removeMember(communityId, userId, transaction);
  
        // Remove the community from the user's joined communities list
        await UserModel.leaveCommunity(userId, communityId, transaction);
  
        // Filter and remove user from community events
        const eventsInCommunity = eventsSnapshot.docs.filter(event => event.data().community === communityId);
        if (eventsInCommunity.length > 0) {
          await EventModel.removeUserFromAllEventsInCommunity(userId, communityId, transaction);
        }
      });
  
      res.status(200).json(formatResponse('Success'));
    } catch (error) {
      console.error('Error leaving community:', error);
      const status = error.message.includes('not found') ? 404 : 500;
      const message = status === 404 ? `Community ${communityId} not found` : 'Internal Server Error';
      res.status(status).json(formatResponse(message, error.message));
    }
  };


/**
 * @function listJoinedCommunities
 * @description This function lists all communities joined by the authenticated user. It extracts the user ID from the request, fetches the list of joined communities from the database, and sends a JSON response with the list of communities or an error message.
 * 
 * @param {Object} req - Express request object containing the user ID.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const listJoinedCommunities = async (req, res) => {
    const userId = req.user.uid;

    try {
        // Step 1: Retrieve the list of community IDs the user has joined
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json(formatResponse('User not found'));
        }

        const communityIds = user.joinedCommunities;
        if (!communityIds || communityIds.length === 0) {
            return res.status(200).json(formatResponse('No joined communities', null, []));
        }

        // Step 2: Fetch the details of each community by its ID
        const communities = await Promise.all(
            communityIds.map(async (id) => {
                const community = await CommunityModel.getCommunityById(id);
                if (community) {
                    // eslint-disable-next-line no-unused-vars
                    const { members, ...communityWithoutMembers } = community;
                    return communityWithoutMembers;
                }
                return null;
            })
        );

        res.status(200).json(formatResponse('Success', null, communities));
    } catch (error) {
        console.error('Error listing joined communities:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
};

const saveLocation = async (req, res) => {
    try {
      const userId = req.user.uid;
      const { latitude, longitude } = req.body;
  
      if (latitude == null || longitude == null) {
        return res.status(400).json(formatResponse('Bad Request: Missing latitude or longitude'));
      }
  
      const user = await UserModel.saveLocation(userId, { latitude, longitude });
      res.status(200).json(formatResponse('Location saved successfully', null, user));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  };



module.exports = { 
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
            saveLocation};
