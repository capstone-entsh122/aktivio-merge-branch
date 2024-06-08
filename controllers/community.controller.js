const CommunityModel = require('../models/community.model');
const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const EventModel = require('../models/event.model')
const { firestore } = require('../config/firebaseAdmin');
const formatResponse = require('../helpers/responseFormatter');
const { saveCommunityToAlgolia, deleteCommunityFromAlgolia } = require('../services/algolia.service.js')

/**
 * @function createCommunity
 * @description This function handles the creation of a new community. 
 * It extracts community data from the request body, attempts to create a new community using the CommunityModel, and sends a JSON response with the created community or an error message.
 * 
 * @param {Object} req - Express request object containing the community data in the body.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const createCommunity = async (req, res) => {
  try {
    // Extract community data from the request body
    const data = req.body;

    // Attempt to create a new community with the provided data
    const community = await CommunityModel.createCommunity(data);

    // Index the community in Algolia
    await saveCommunityToAlgolia(community);

    // Send a successful response with the created community
    res.status(201).json(formatResponse('Success', null, community));
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating community:', error);

    // Send an error response with a 500 status code and error message
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


/**
 * @function getCommunityById
 * @description This function retrieves a community by its ID. 
 * It extracts the community ID from the request parameters, attempts to fetch the community from the database, and sends a JSON response with the community data or an error message.
 * 
 * @param {Object} req - Express request object containing the community ID in the URL parameters.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const getCommunityById = async (req, res) => {
  try {
    // Extract community ID from request parameters
    const communityId = req.params.id;

    // Attempt to fetch the community by ID
    const community = await CommunityModel.getCommunityById(communityId);

    // If the community is not found, send a 404 response
    if (!community) {
      return res.status(404).json(formatResponse('Community not found'));
    }

    // Send a successful response with the community data
    res.status(200).json(formatResponse('Success', null, community));
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error getting community:', error);

    // Send an error response with a 500 status code and error message
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

/**
 * @function updateCommunityById
 * @description This function updates a community by its ID. 
 * It extracts the community ID from the request parameters and the update data from the request body, attempts to update the community in the database, and sends a JSON response with a success message or an error message.
 * 
 * @param {Object} req - Express request object containing the community ID in the URL parameters and update data in the body.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const updateCommunityById = async (req, res) => {
  try {
      const communityId = req.params.id;
      const updateData = req.body;

      
      const updatedCommunity = await CommunityModel.updateCommunityById(communityId, updateData);

          // if (updateData.name) {
          //     await PostModel.updateCommunityName(communityId, updateData.name, transaction);
          //     await EventModel.updateCommunityName(communityId, updateData.name, transaction);
          // }
      await saveCommunityToAlgolia(updatedCommunity);
    
      
      
      res.status(200).json(formatResponse('Success',null,updatedCommunity));
      
  } catch (error) {
      console.error('Error updating community:', error);
      res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

/**
 * @function deleteCommunityById
 * @description This function deletes a community by its ID. 
 * It extracts the community ID from the request parameters, attempts to delete the community from the database, and sends a JSON response with a success message or an error message.
 * 
 * @param {Object} req - Express request object containing the community ID in the URL parameters.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
// community.controller.js
const deleteCommunityById = async (req, res) => {
  try {
    const communityId = req.params.id;

    // Step 1: Perform all read operations outside the transaction
    const communityDoc = await CommunityModel.getCommunityById(communityId);
    if (!communityDoc) {
      return res.status(404).json(formatResponse('Community not found'));
    }

    const postsSnapshot = await PostModel.getPostsByCommunity(communityId);
    const eventsSnapshot = await EventModel.getEventsByCommunity(communityId);

    // Step 2: Execute all write operations within the transaction
    await firestore.runTransaction(async (transaction) => {
      // Delete all posts in the community
      if (!postsSnapshot.empty) {
        await PostModel.deletePostsByCommunity(communityId, transaction);
      }

      // Delete all events in the community
      if (!eventsSnapshot.empty) {
        await EventModel.deleteEventsByCommunity(communityId, transaction);
      }

      // Remove the community from users' joinedCommunities list
      await CommunityModel.removeCommunityFromUsers(communityId, transaction);

      // Delete the community itself
      const communityRef = CommunityModel.collection.doc(communityId);
      transaction.delete(communityRef);

      // Remove community from Algolia index
      await deleteCommunityFromAlgolia(communityId);
    });

    res.status(204).json(formatResponse('Success'));
  } catch (error) {
    console.error('Error deleting community:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

/**
 * @function listCommunities
 * @description This function retrieves a list of all communities. 
 * It attempts to fetch the list from the database and sends a JSON response with the list of communities or an error message.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
// TODO: need pagination?
const listCommunities = async (req, res) => {
  try {
    // Attempt to fetch the list of communities
    const communities = await CommunityModel.listCommunities();

    // Send a successful response with the list of communities
    res.status(200).json(formatResponse('Success', null, communities));
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error listing communities:', error);

    // Send an error response with a 500 status code and error message
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

/**
 * @function listCommunityMembers
 * @description This function retrieves a list of members for a specific community by its ID. 
 * It extracts the community ID from the request parameters, attempts to fetch the members from the database, and sends a JSON response with the list of members or an error message.
 * 
 * @param {Object} req - Express request object containing the community ID in the URL parameters.
 * @param {Object} res - Express response object used to send back the appropriate HTTP response.
 * 
 * @returns {void}
 * 
 * @async
 */
const listCommunityMembers = async (req, res) => {
  const communityId = req.params.id;

  try {
    // Step 1: Retrieve the list of member IDs from the community document
    const community = await CommunityModel.getCommunityById(communityId);
    if (!community) {
      // If the community is not found, return a 404 response
      return res.status(404).json(formatResponse('Community not found'));
    }

    const memberIds = community.members;
    if (!memberIds || memberIds.length === 0) {
      // If there are no members in the community, return a 200 response with an empty array
      return res.status(200).json(formatResponse('No members in the community', null, []));
    }

    // Step 2: Fetch the details of each member by their ID
    const members = await Promise.all(
      memberIds.map(async (id) => {
        // Fetch the user details from the UserModel
        const member = await UserModel.getUserById(id);
        // Return only the specific fields: id and displayName
        return {
          id: id,
          displayName: member ? member.displayName : 'Unknown'
        };
      })
    );

    // Step 3: Send the response with the list of members
    res.status(200).json(formatResponse('Success', null, members));
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error listing community members:', error);
    // Return a 500 response with the error message
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


module.exports = {
  createCommunity,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
  listCommunities,
  listCommunityMembers,
};
