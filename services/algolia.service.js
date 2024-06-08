const index = require('../config/algoliaConfig');

const saveCommunityToAlgolia = async (community) => {
    try {
        community.objectID = community.id;
        if (community.location) {
            community._geoloc = { lat: community.location.latitude, lng: community.location.longitude };
          }
        await index.saveObject(community);
        console.log('Community indexed in Algolia:', community);
    } catch (error) {
        console.error('Error indexing community in Algolia:', error);
    }
};

const deleteCommunityFromAlgolia = async (communityId) => {
    try {
        await index.deleteObject(communityId);
        console.log('Community deleted from Algolia:', communityId);
    } catch (error) {
        console.error('Error deleting community from Algolia:', error);
    }
};

module.exports = {
    saveCommunityToAlgolia,
    deleteCommunityFromAlgolia
};
