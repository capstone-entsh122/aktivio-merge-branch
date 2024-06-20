
const admin = require('firebase-admin');
const { firestore } = require('../config/firebaseAdmin');
const cron = require('node-cron'); 

async function sendDailyNotification() {
  try {
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('No users found.');
      return;
    }

    const tokens = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.fcmToken) {
        tokens.push(userData.fcmToken);
      }
    });

    const message = {
      notification: {
        title: 'Good Morning!',
        body: 'Don\'t forget to check your sport plan for today!',
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent notifications:', response);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

// Schedule the task to run at 7:00 AM every day
cron.schedule('0 7 * * *', () => {
  console.log('Sending daily notifications...');
  sendDailyNotification();
}, {
  timezone: "Asia/Jakarta" 
});

module.exports = { sendDailyNotification };
