const { firestore } = require('../../config/firebaseAdmin');
const UserModel = require('../../models/user.model');
const EventModel = require('../../models/event.model');

const listenForEventEnd = () => {
  // Get the current time
  const currentTime = new Date();

  // Listen to changes in the 'events' collection where status is 'ongoing'
  firestore.collection('events').where('status', '==', 'ongoing')
    .onSnapshot(async (snapshot) => {
      // Iterate over each document change
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const event = { id: change.doc.id, ...change.doc.data() };

          // Check if the event end time is less than the current time (i.e., the event has ended)
          if (event.endTime.toDate() < currentTime) {
            const participants = event.participants || [];
            const points = event.points || 0;

            // Update the points for each participant
            const userUpdatePromises = participants.map(async (userId) => {
              const user = await UserModel.getUserById(userId);
              if (user) {
                const updatedPoints = (user.points || 0) + points;
                await UserModel.updateUserPoints(userId, updatedPoints);
              }
            });

            // Wait for all user points updates to complete
            await Promise.all(userUpdatePromises);

            // Mark the event as finished
            await EventModel.markEventAsFinished(event.id);

            console.log(`User points updated successfully for event: ${event.id}`);
          }
        }
      });
    });
};

module.exports = listenForEventEnd;
