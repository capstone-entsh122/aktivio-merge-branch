const { firestore, FieldValue, GeoPoint } = require('../config/firebaseAdmin');

/**
 * @class CommunityModel
 * @description This class provides methods to interact with the 'communities' collection in Firestore. It includes methods for creating, retrieving, updating, deleting, and listing communities, as well as adding and listing members.
 */
class CommunityModel {
  constructor() {
    this.collection = firestore.collection('communities');
  }

  /**
   * @function createCommunity
   * @description Creates a new community in Firestore.
   * @param {Object} data - The data of the community to be created.
   * @returns {Promise<Object>} A promise that resolves with the created community data, including its ID.
   * @async
   */
  async createCommunity(data) {
    const latitude = typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude;
    const longitude = typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude;

    const communityRef = await this.collection.add({
      name: data.name,
      description: data.description,
      members: [],
      location: new GeoPoint(latitude, longitude),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const communityDoc = await communityRef.get();
    return { id: communityDoc.id, ...communityDoc.data() };
  }

  /**
   * @function getCommunityById
   * @description Retrieves a community by its ID from Firestore.
   * @param {string} communityId - The ID of the community to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the community data or null if not found.
   * @async
   */
   async getCommunityById(communityId, transaction = null) {
    const communityRef = this.collection.doc(communityId);
    const communityDoc = transaction ? await transaction.get(communityRef) : await communityRef.get();
    return communityDoc.exists ? { id: communityId, ...communityDoc.data() } : null;
}

  /**
   * @function updateCommunityById
   * @description Updates a community by its ID in Firestore.
   * @param {string} communityId - The ID of the community to update.
   * @param {Object} updateData - The data to update in the community.
   * @returns {Promise<void>}
   * @async
   */
  async updateCommunityById(communityId, updateData, transaction = null) {
    const communityRef = this.collection.doc(communityId);
    const communityDoc = await communityRef.get();

    if (!communityDoc.exists) {
        throw new Error('Community not found');
    }

    // Preserve existing location if not provided in the update
    const existingData = communityDoc.data();
    const updatedData = {
        ...updateData,
        location: updateData.latitude && updateData.longitude
            ? new GeoPoint(updateData.latitude, updateData.longitude)
            : existingData.location,
        updatedAt: FieldValue.serverTimestamp(),
    };

    if (transaction) {
        await transaction.update(communityRef, updatedData);
    } else {
        await communityRef.update(updatedData);
    }

    const updatedCommunity = await communityRef.get();
    return { id: communityId, ...updatedCommunity.data() };
}


  /**
   * @function deleteCommunityById
   * @description Deletes a community by its ID from Firestore.
   * @param {string} communityId - The ID of the community to delete.
   * @returns {Promise<void>}
   * @async
   */
  async deleteCommunityById(communityId, transaction = null) {
    const communityRef = this.collection.doc(communityId);
    const doc = await (transaction ? transaction.get(communityRef) : communityRef.get());
    if (!doc.exists) {
      throw new Error('Community not found');
    }
    if (transaction) {
      await transaction.delete(communityRef);
    } else {
      await communityRef.delete();
    }
  }

  /**
   * @function listCommunities
   * @description Lists all communities in Firestore, ordered by creation date.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of community data.
   * @async
   */
  async listCommunities() {
    const snapshot = await this.collection.orderBy('createdAt').get();
    const communities = [];
    snapshot.forEach(doc => {
      communities.push({ id: doc.id, ...doc.data() });
    });
    return communities;
  }

  /**
   * @function addMember
   * @description Adds a member to a community in Firestore.
   * @param {string} communityId - The ID of the community.
   * @param {string} userId - The ID of the user to add as a member.
   * @returns {Promise<void>}
   * @async
   */
   async addMember(communityId, userId, transaction = null) {
    const communityRef = this.collection.doc(communityId);
    const doc = await communityRef.get();
    if (!doc.exists){
        throw new Error('Community not found');
    }
    if (transaction) {
        await transaction.update(communityRef, {
            members: FieldValue.arrayUnion(userId)
        });
    } else {
        await communityRef.update({
            members: FieldValue.arrayUnion(userId)
        });
    }
}
// for removing member from community
async removeMember(communityId, userId, transaction = null) {
  const communityRef = this.collection.doc(communityId);
  if (transaction) {
      await transaction.update(communityRef, {
          members: FieldValue.arrayRemove(userId)
      });
  } else {
      await communityRef.update({
          members: FieldValue.arrayRemove(userId)
      });
  }
};

  /**
   * @function listMembers
   * @description Lists the members of a community in Firestore.
   * @param {string} communityId - The ID of the community.
   * @returns {Promise<Array<string>|null>} A promise that resolves with an array of member IDs or null if the community does not exist.
   * @async
   */
  async listMembers(communityId) {
    const communityDoc = await this.collection.doc(communityId).get();
    if (!communityDoc.exists) {
      return null; // Community not found
    }
  
    const members = communityDoc.data().members || [];
    if (members.length === 0) {
      return []; // No members in the community
    }
  
    const memberDocsPromises = members.map(id => firestore.collection('users').doc(id).get());
    const memberDocs = await Promise.all(memberDocsPromises);
  
    return memberDocs.map(doc => {
      if (doc.exists) {
        const { displayName } = doc.data() || {};
        return { id: doc.id, displayName: displayName || 'Unknown' };
      } else {
        return { id: doc.id, displayName: 'Unknown' }; // Handle the case where the user document does not exist
      }
    });
  }

  // for removing user from all communities
  async removeUserFromAllCommunities(userId, communityIds, transaction = null) {
    for (const communityId of communityIds) {
        await this.removeMember(communityId, userId, transaction);
    }
}
// for getting communities by user where user is member
  async removeCommunityFromUsers(communityId, transaction) {
    const usersSnapshot = await firestore.collection('users').where('joinedCommunities', 'array-contains', communityId).get();
    const userUpdates = usersSnapshot.docs.map(userDoc => {
      return transaction.update(userDoc.ref, {
        joinedCommunities: FieldValue.arrayRemove(communityId)
      });
  });
  await Promise.all(userUpdates);
}
}

module.exports = new CommunityModel();
