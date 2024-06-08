const app = require('./app');
const initListeners = require('./helpers/initListener');
require('./services/scheduler.service');

// Initialize the event listener
initListeners();


const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') { 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
}

module.exports = app;
