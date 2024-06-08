const { firestore, FieldValue } = require('../config/firebaseAdmin');

class ReplyPostModel {
  constructor() {
    this.collection = firestore.collection('replyPosts');
  }

  // Create a new reply post
  async replyPosts(postData) {
    const postRef = await this.collection.add({
      ...postData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    const postDoc = await postRef.get();
    return { id: postDoc.id, ...postDoc.data() };
  }

  // Get a reply post by ID
  async getReplyPostById(replyPostId) {
    const postDoc = await this.collection.doc(replyPostId).get();
    if (!postDoc.exists) {
      return null;
    }
    return { id: postDoc.id, ...postDoc.data() };
  }

  // Update a reply post by ID
  async updateReplyPostById(replyPostId, updateData) {
    await this.collection.doc(postId).update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  // Delete a reply post by ID
  async deleteReplyPostById(replyPostId) {
    await this.collection.doc(replyPostId).delete();
  }

  // List all reply posts for a specific post
  async listReplyPostsByPost(postId) {
    const snapshot = await this.collection.where('postId', '==', postId).orderBy('createdAt').get();
    const replyPosts = [];
    snapshot.forEach(doc => {
      replyPosts.push({ id: doc.id, ...doc.data() });
    });
    return replyPosts;
  }
}

module.exports = new ReplyPostModel();
