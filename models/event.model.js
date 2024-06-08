// models/event.model.js

const { firestore, FieldValue } = require('../config/firebaseAdmin');

class EventModel {
  constructor() {
    this.collection = firestore.collection('events');
  }

  async createEvent(data) {
    const eventRef = await this.collection.add({
      ...data,
      status: 'ongoing',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const eventDoc = await eventRef.get();
    return { id: eventDoc.id, ...eventDoc.data() };
  }

  async getEventById(eventId) {
    const eventDoc = await this.collection.doc(eventId).get();
    if (!eventDoc.exists) {
      throw new Error('Event not found');
    }
    return { id: eventDoc.id, ...eventDoc.data() };
  }

  async updateEventById(eventId, data) {
    const eventRef = this.collection.doc(eventId);
    await eventRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    const eventDoc = await eventRef.get();
    return { id: eventDoc.id, ...eventDoc.data() };
  }

  async deleteEventById(eventId) {
    await this.collection.doc(eventId).delete();
  }

  async listEventsByCommunity(communityId, limit = 10, startAfter) {
    let query = this.collection
      .where('community', '==', communityId)
      .orderBy('startTime', 'asc')
      .limit(limit);

    if (startAfter) {
      const startAfterDoc = await this.collection.doc(startAfter).get();
      if (!startAfterDoc.exists) {
        throw new Error('Starting document not found');
      }
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return events;
  }

  async joinEvent(eventId, userId) {
    const eventRef = this.collection.doc(eventId);
    await eventRef.update({
      participants: FieldValue.arrayUnion(userId),
    });
    const eventDoc = await eventRef.get();
    return { id: eventDoc.id, ...eventDoc.data() };
  }

  async leaveEvent(eventId, userId) {
    const eventRef = this.collection.doc(eventId);
    await eventRef.update({
      participants: FieldValue.arrayRemove(userId),
    });
    const eventDoc = await eventRef.get();
    return { id: eventDoc.id, ...eventDoc.data() };
  }

  // Fetch events that have ended
  async getPastEvents(currentTime) {
    return await this.collection.where('endTime', '<', currentTime).get();
  }

  async markEventAsFinished(eventId) {
    const eventRef = this.collection.doc(eventId);
    await eventRef.update({
      status: 'finished',
      updatedAt: FieldValue.serverTimestamp(),
    });
    const updatedEvent = await eventRef.get();
    return { id: eventId, ...updatedEvent.data() };
  }

  async getOngoingEvents() {
    return await this.collection.where('status', '==', 'ongoing').get();
  }

  async listEventParticipants(eventId) {
    const eventDoc = await this.collection.doc(eventId).get();
    if (!eventDoc.exists) {
      throw new Error('Event not found');
    }
    return eventDoc.data().participants || [];
  }

  async updateCreatorName(userId, newName) {
    const eventsSnapshot = await this.collection.where('creator', '==', userId).get();
    const updates = eventsSnapshot.docs.map(doc => doc.ref.update({ creatorName: newName }));
    await Promise.all(updates);
}

async deleteEventsByUser(userId) {
    const eventsSnapshot = await this.collection.where('creator', '==', userId).get();
    const deletions = eventsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletions);
}

async deleteEventsByCommunity(communityId, transaction = null) {
  const eventsSnapshot = await this.getEventsByCommunity(communityId);
  const deletions = eventsSnapshot.docs.map(doc => {
    if (transaction) {
      transaction.delete(doc.ref);
    } else {
      doc.ref.delete();
    }
  });
  await Promise.all(deletions);
}
// for removing user from all events
async removeUserFromAllEvents(userId) {
    const eventsSnapshot = await this.collection.where('participants', 'array-contains', userId).get();
    const updates = eventsSnapshot.docs.map(doc => doc.ref.update({
        participants: FieldValue.arrayRemove(userId)
    }));
    await Promise.all(updates);
}
// for getting events by user where user is creator
async getEventsByUser(userId, transaction = null) {
  const query = this.collection.where('creator', '==', userId);
  return transaction ? await transaction.get(query) : await query.get();
}
// for getting events by user where user is participant
async getEventsByParticipant(userId, transaction = null) {
  const query = this.collection.where('participants', 'array-contains', userId);
  return transaction ? await transaction.get(query) : await query.get();
}

async getEventsByCommunity(communityId, transaction = null) {
  const query = this.collection.where('community', '==', communityId);
  return transaction ? await transaction.get(query) : await query.get();
}

async removeUserFromAllEventsInCommunity(userId, communityId) {
  const eventsSnapshot = await this.collection
      .where('community', '==', communityId)
      .where('participants', 'array-contains', userId)
      .get();
  const updates = eventsSnapshot.docs.map(doc => doc.ref.update({
      participants: FieldValue.arrayRemove(userId)
  }));
  await Promise.all(updates);
}



}

module.exports = new EventModel();
