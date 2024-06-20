const { firestore, FieldValue, GeoPoint } = require('../config/firebaseAdmin');
const { bucket } = require('../config/gcsClient.js');


/**
 * @class UserModel
 * @description This class provides static methods to interact with the 'users' collection in Firestore. It includes methods for creating, retrieving, updating, and deleting users, as well as updating user preferences and managing community memberships.
 */
class UserModel {
  /**
   * @function createUser
   * @description Creates a new user in Firestore.
   * @param {string} userId - The ID of the user to be created.
   * @param {Object} userData - The data of the user to be created.
   * @returns {Promise<void>}
   * @async
   */
  static async createUser(userId, userData) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId');
  }

    const userRef = firestore.collection('users').doc(userId);
    await userRef.set({
      ...userData,
      points: 0,
      dailyCalories: 0,
      joinedCommunities: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  
    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
  }


  /**
   * @function getUserById
   * @description Retrieves a user by their ID from Firestore.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the user data or null if not found.
   * @async
   */
  static async getUserById(userId, transaction = null) {
    const userRef = firestore.collection('users').doc(userId);
    const userDoc = transaction ? await transaction.get(userRef) : await userRef.get();
    return userDoc.exists ? userDoc.data() : null;
}

  /**
   * @function updateUserById
   * @description Updates a user by their ID in Firestore.
   * @param {string} userId - The ID of the user to update.
   * @param {Object} userData - The data to update in the user document.
   * @returns {Promise<void>}
   * @async
   */
  static async updateUserById(userId, updateData, transaction = null) {
    const userRef = firestore.collection('users').doc(userId);

    // Create a new object without fields that have null values
    const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData)
            .filter(([, value]) => value !== null)
    );

    if (transaction) {
        await transaction.update(userRef, filteredUpdateData);
    } else {
        await userRef.update(filteredUpdateData);
    }

    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
  }

  /**
   * @function deleteUserById
   * @description Deletes a user by their ID from Firestore.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<void>}
   * @async
   */
  static async deleteUserById(userId, transaction = null) {
    const userRef = firestore.collection('users').doc(userId);
    if (transaction) {
        await transaction.delete(userRef);
    } else {
        await userRef.delete();
    }
}

  /**
   * @function updateUserPreference
   * @description Updates the preferences of a user in Firestore.
   * @param {string} userId - The ID of the user whose preferences are to be updated.
   * @param {Object} preferences - The preference data to update.
   * @returns {Promise<void>}
   * @async
   */
  static async updateUserPreference(userId, preferences, recommendations, recommendedCaloriesNutritions) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const updateData = {
        preferences,
        sportPlan: recommendations,
        recommendedCaloriesNutritions
      };
      await userRef.set(updateData, { merge: true });
      return updateData;
    } catch (error) {
      throw new Error(`Error updating user preferences: ${error.message}`);
    }
  }


  // static async createSportPlan(sportPlanData) {
  //   try {
  //     const sportPlanRef = await firestore.collection('sportPlans').add(sportPlanData);
  //     return { id: sportPlanRef.id, ...sportPlanData };
  //   } catch (error) {
  //     throw new Error(`Error creating sport plan: ${error.message}`);
  //   }
  // }

  

  /**
   * @function joinCommunity
   * @description Adds a community to the user's joined communities in Firestore.
   * @param {string} userId - The ID of the user.
   * @param {string} communityId - The ID of the community to join.
   * @returns {Promise<void>}
   * @async
   */
  static async joinCommunity(userId, communityId, transaction = null) {
    const userRef = firestore.collection('users').doc(userId);
    
    if (transaction) {
        await transaction.update(userRef, {
            joinedCommunities: FieldValue.arrayUnion(communityId)
        });
    } else {
        await userRef.update({
            joinedCommunities: FieldValue.arrayUnion(communityId)
        });
    }
    
    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
}

static async leaveCommunity(userId, communityId, transaction = null) {
  const userRef = firestore.collection('users').doc(userId);
  if (transaction) {
      await transaction.update(userRef, {
          joinedCommunities: FieldValue.arrayRemove(communityId)
      });
  } else {
      await userRef.update({
          joinedCommunities: FieldValue.arrayRemove(communityId)
      });
  }
}

  /**
   * @function listJoinedCommunities
   * @description Lists all communities joined by a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of community data.
   * @async
   */
  static async listJoinedCommunities(userId) {
    const userRef = firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const communityIds = userData.joinedCommunities || [];
      if (communityIds.length === 0) {
        return [];
      }
      const communityRefs = communityIds.map(id => firestore.collection('communities').doc(id));
      const communityDocs = await firestore.getAll(...communityRefs);
      return communityDocs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return [];
  }

  static async updateUserLocation(userId, { latitude, longitude }) {
    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({ location: new GeoPoint(latitude, longitude) });
    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
  }
  // used in updating points for events
  static async updateUserPoints(userId, points) {
    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({ points });
  }

  static async updateUserCalories(userId, calories) {
    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({
      dailyCalories: FieldValue.increment(calories),
      lastUpdated: FieldValue.serverTimestamp()
    });
  }

  static async resetUserCalories(userId) {
    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({
      dailyCalories: 0,
      lastUpdated: FieldValue.serverTimestamp()
    });
  }

  static async resetAllUsersCalories() {
    const usersSnapshot = await firestore.collection('users').get();
    const batch = firestore.batch();

    usersSnapshot.forEach((userDoc) => {
      const userRef = userDoc.ref;
      batch.update(userRef, {
        dailyCalories: 0,
        lastUpdated: FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  }

  static async addFoodEntry(userId, foodEntry) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      await userRef.update({
        foodEntries: FieldValue.arrayUnion(foodEntry)
      });
    } catch (error) {
      throw new Error(`Error adding food entry: ${error.message}`);
    }
  }

  static async getMealHistory(userId) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      let foodEntries = userDoc.get('foodEntries') || [];

      // Generate signed URLs for all food entries
      foodEntries = await Promise.all(foodEntries.map(async (entry) => {
        if (entry.imagePath) {
          const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 15, // 15 minutes
          };
          const [url] = await bucket.file(entry.imagePath).getSignedUrl(options);
          return { ...entry, imageUrl: url };
        }
        return entry;
      }));

      return foodEntries;
    } catch (error) {
      throw new Error(`Error fetching meal history: ${error.message}`);
    }
  }

}


module.exports = UserModel;
