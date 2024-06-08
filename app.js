const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const User = require('./routes/user.routes.js');
const Community = require('./routes/community.routes');
const Search = require('./routes/search.routes');
const Classify = require('./routes/classify.routes');
const SportPlan = require('./routes/sportplan.routes'); 
require('./routes/classify.routes');

const app = express();

app.use(helmet())
app.use(cors());
app.use(express.json());

// protected routes
app.use('/api/users', User.routes);
app.use('/api/communities', Community.routes);
app.use('/api/search', Search.routes);
app.use('/api/classify', Classify.routes);

app.use('/api', SportPlan);

module.exports = app;
