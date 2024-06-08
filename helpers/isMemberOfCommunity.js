// utils/helpers.js

const { firestore } = require('../config/firebaseAdmin');

/**
 * Checks if a user is a member of a community.
 * @param {string} communityId - The ID of the community.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} - Returns true if the user is a member of the community.
 */
const isMemberOfCommunity = async (communityId, userId) => {
    const communityRef = firestore.collection('communities').doc(communityId);
    const communityDoc = await communityRef.get();

    if (!communityDoc.exists) {
        throw new Error('Community does not exist');
    }

    const communityData = communityDoc.data();
    if (!communityData.members) {
        // If the 'members' property doesn't exist, assume the user is not a member
        return false;
    }

    return communityData.members.includes(userId);
};

module.exports = isMemberOfCommunity

