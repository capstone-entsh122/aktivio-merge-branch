const cron = require('node-cron');
const UserModel = require('../models/user.model');

// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', async () => {
  try {
    await UserModel.resetAllUsersCalories();
    console.log('Daily calories reset for all users');
  } catch (error) {
    console.error('Error resetting daily calories:', error);
  }
});

module.exports = {};
