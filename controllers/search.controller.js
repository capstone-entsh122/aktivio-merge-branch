const index = require('../config/algoliaConfig');
const UserModel = require('../models/user.model');
const formatResponse = require('../helpers/responseFormatter');

const searchCommunities = async (req, res) => {
    const query = req.query.q;
    const userId = req.user.uid;
    const radius = req.query.radius || 10000; // Default radius to 10 km if not provided
  
    try {
      // Get the user's location
      const user = await UserModel.getUserById(userId);
      if (!user || !user.location) {
        return res.status(400).json(formatResponse('User location not found'));
      }
      const { latitude, longitude } = user.location;
  
      const searchParams = {
        aroundLatLng: `${latitude}, ${longitude}`,
        aroundRadius: radius,
      };
  
      const results = await index.search(query, searchParams);
      if (results.hits.length > 0) {
        res.status(200).json(formatResponse('Success', null, results.hits));
      } else {
        res.status(200).json(formatResponse('No communities found within the search radius'));
      }
    } catch (error) {
      console.error('Error searching communities:', error);
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  };

module.exports = {
    searchCommunities
};