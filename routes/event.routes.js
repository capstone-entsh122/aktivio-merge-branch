const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../middlewares/authenticate');
const { createEvent,
    getEventById,
    updateEventById,
    deleteEventById,
    listEventsByCommunity,
    joinEvent,
    leaveEvent,
    listEventParticipants
 } = require('../controllers/event.controller');

// Define routes
router.post('/', authenticate, createEvent);
router.get('/:eventId', authenticate, getEventById);
router.put('/:eventId', authenticate, updateEventById);
router.delete('/:eventId', authenticate, deleteEventById);
router.get('/', authenticate, listEventsByCommunity);
router.post('/:eventId/join', authenticate, joinEvent);
router.post('/:eventId/leave', authenticate, leaveEvent);
router.get('/:eventId/participants', authenticate, listEventParticipants);


module.exports = router;
