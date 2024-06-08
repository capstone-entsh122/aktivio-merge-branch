const { firestore, FieldValue } = require('../config/firebaseAdmin');

/**
 * @class PostModel
 * @description This class provides methods to interact with the 'posts' collection in Firestore. It includes methods for creating, retrieving, updating, deleting, and listing posts by community.
 */
class PostModel {
  constructor() {
    this.collection = firestore.collection('posts');
  }

  /**
   * @function createPost
   * @description Creates a new post in Firestore.
   * @param {Object} postData - The data of the post to be created.
   * @returns {Promise<Object>} A promise that resolves with the created post data, including its ID.
   * @async
   */
  async createPost(postData) {
    const postRef = await this.collection.add({
      ...postData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    const postDoc = await postRef.get();
    return { id: postDoc.id, ...postDoc.data() };
  }

  /**
   * @function getPostById
   * @description Retrieves a post by its ID from Firestore.
   * @param {string} postId - The ID of the post to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the post data or null if not found.
   * @async
   */
  async getPostById(postId) {
    const postDoc = await this.collection.doc(postId).get();
    if (!postDoc.exists) {
      return null;
    }
    return { id: postDoc.id, ...postDoc.data() };
  }

  /**
   * @function updatePostById
   * @description Updates a post by its ID in Firestore.
   * @param {string} postId - The ID of the post to update.
   * @param {Object} updateData - The data to update in the post.
   * @returns {Promise<void>}
   * @async
   */
  async updatePostById(postId, updateData) {
    await this.collection.doc(postId).update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  /**
   * @function deletePostById
   * @description Deletes a post by its ID from Firestore.
   * @param {string} postId - The ID of the post to delete.
   * @returns {Promise<void>}
   * @async
   */
  async deletePostById(postId) {
    await this.collection.doc(postId).delete();
  }


  /**
 * Lists posts by community with pagination support.
 *
 * This method retrieves posts from a specific community, ordered by creation date in descending order.
 * It supports pagination through the `limit` and `startAfter` parameters.
 *
 * @param {string} communityId - The ID of the community whose posts are to be listed.
 * @param {number} limit - The maximum number of posts to retrieve.
 * @param {string} [startAfter] - The ID of the post to start after for pagination.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 * @throws {Error} - Throws an error if the starting document is not found.
 *
 * Example usage:
 * ```
 * const posts = await listPostsByCommunity('communityId123', 10);
 * ```
 * 
 * Example with pagination:
 * ```
 * const posts = await listPostsByCommunity('communityId123', 10, 'postId456');
 * ```
 */
async listPostsByCommunity(communityId, limit, startAfter) {
  // Create a query to retrieve posts by community ID, ordered by creation date.
  let query = this.collection
    .where('communityId', '==', communityId)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  // If a startAfter ID is provided, adjust the query to start after the specified document.
  if (startAfter) {
    const startAfterDoc = await this.collection.doc(startAfter).get();
    if (!startAfterDoc.exists) {
      throw new Error('Starting document not found');
    }
    query = query.startAfter(startAfterDoc);
  }

  // Execute the query and map the results to an array of post objects.
  const snapshot = await query.get();
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Return the array of posts.
  return posts;
}

async updateAuthorName(userId, newName) {
  const postsSnapshot = await this.collection.where('author', '==', userId).get();
  const updates = postsSnapshot.docs.map(doc => doc.ref.update({ authorName: newName }));
  await Promise.all(updates);
}

async deletePostsByCommunity(communityId, transaction = null) {
  const postsSnapshot = await this.getPostsByCommunity(communityId);
  const deletions = postsSnapshot.docs.map(doc => {
    if (transaction) {
      transaction.delete(doc.ref);
    } else {
      doc.ref.delete();
    }
  });
  await Promise.all(deletions);
}

 
  async getPostsByUser(userId, transaction = null) {
  const query = this.collection.where('author', '==', userId);
  return transaction ? await transaction.get(query) : await query.get();
}

async getPostsByCommunity(communityId, transaction = null) {
  const query = this.collection.where('communityId', '==', communityId);
  return transaction ? await transaction.get(query) : await query.get();
}


async deleteUserPosts(userId, transaction = null) {
  const postsSnapshot = await this.getPostsByUser(userId, transaction);
  if (!postsSnapshot.empty) {
      postsSnapshot.forEach(post => {
          transaction.delete(post.ref);
      });
  }
}

}


module.exports = new PostModel();
