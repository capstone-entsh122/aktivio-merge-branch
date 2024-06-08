const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {
  createCommunity,
  getCommunityById,
  updateCommunityById,
  deleteCommunityById,
  listCommunities,
  listCommunityMembers,
} = require('../controllers/community.controller');
// Use mergeParams to ensure communityId is available in nested routes
const postRoutes = require('./post.routes.js');
const eventRoutes = require('./event.routes.js');

// Community routes
// id: communityId
router.post('/', authenticate, createCommunity);
router.get('/', authenticate, listCommunities);

router.get('/:id', authenticate, getCommunityById);
router.put('/:id', authenticate, updateCommunityById);
router.delete('/:id', authenticate, deleteCommunityById);

router.get('/:id/members', authenticate, listCommunityMembers);



router.use('/:communityId/posts', postRoutes);
router.use('/:communityId/events', eventRoutes);

module.exports = { routes: router };
