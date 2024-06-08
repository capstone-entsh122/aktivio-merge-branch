const listenForEventEnd = require('./firestoreListener/eventListener');

const initListeners = () => {
    listenForEventEnd();
    console.log('Event listener initialized');
  };
  
  module.exports = initListeners;