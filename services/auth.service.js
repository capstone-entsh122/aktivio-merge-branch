/* eslint-disable no-useless-catch */
const { admin } = require('../config/firebaseAdmin');

async function registerUser(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });
    return userRecord;
  } catch (error) {
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

async function generateCustomToken(uid) {
  try {
    const token = await admin.auth().createCustomToken(uid);
    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  generateCustomToken
};