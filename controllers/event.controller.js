// controllers/event.controller.js

const EventModel = require('../models/event.model');
const UserModel = require('../models/user.model');
const formatResponse = require('../helpers/responseFormatter');
const isMemberOfCommunity = require('../helpers/isMemberOfCommunity');



const createEvent = async (req, res) => {
  const { name, description, creator, startTime, endTime, points } = req.body;
  const { communityId } = req.params;
  const userId = req.user.uid;

  try {
    // Check if user is a member of the community
    const isMember = await isMemberOfCommunity(communityId, userId);
    if (!isMember) {
      return res.status(403).json(formatResponse('User is not a member of the community'));
    }

    const eventData = {
      name,
      description,
      creator,
      community: communityId,
      startTime,
      endTime,
      points,
      participants: []
    };
    const event = await EventModel.createEvent(eventData);
    res.status(201).json(formatResponse('Event created successfully', null, event));
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.getEventById(eventId);

    // If the event is found, fetch the creator details
    if (event) {
      const creator = await UserModel.getUserById(event.creator);
      if (creator) {
        event.creatorName = creator.displayName;
      } else {
        event.creatorName = 'Unknown';
      }
    }

    res.status(200).json(formatResponse('Success', null, event));
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


const updateEventById = async (req, res) => {
  const { communityId, eventId } = req.params;
  const data = req.body;
  const userId = req.user.uid;

  try {
    
    const isMember = await isMemberOfCommunity(communityId, userId);
    if (!isMember) {
      return res.status(403).json(formatResponse('User is not a member of the community'));
    }

    const updatedEvent = await EventModel.updateEventById(eventId, data);
    res.status(200).json(formatResponse('Event updated successfully', null, updatedEvent));
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const deleteEventById = async (req, res) => {
  const { communityId, eventId } = req.params;
  const userId = req.user.uid;
  

  try {
    const isMember = await isMemberOfCommunity(communityId, userId);
    if (!isMember) {
      return res.status(403).json(formatResponse('User is not a member of the community'));
    }
    await EventModel.deleteEventById(eventId);
    res.status(204).json(formatResponse('Event deleted successfully'));
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const listEventsByCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { limit = 10, startAfter } = req.query;

  try {
    const events = await EventModel.listEventsByCommunity(communityId, parseInt(limit, 10), startAfter);

    const eventsWithCreators = await Promise.all(events.map(async event => {
      const creator = await UserModel.getUserById(event.creator);
      event.creatorName = creator ? creator.displayName : 'Unknown';
      return event;
    }));

    res.status(200).json(formatResponse('Success', null, eventsWithCreators));
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


const joinEvent = async (req, res) => {
  const { communityId } = req.params;
  const { eventId } = req.params;
  
  const userId = req.user.uid;

  try {
    // Check if the user is a member of the community
    const isMember = await isMemberOfCommunity(communityId, userId);
    if (!isMember) {
        return res.status(403).json(formatResponse('User is not a member of the community'));
    }

    const event = await EventModel.getEventById(eventId);
    // Check if the event has already finished
    if (new Date(event.endTime) < new Date()) {
      return res.status(400).json(formatResponse('Cannot join a past event'));
    }

    const updatedEvent = await EventModel.joinEvent(eventId, userId);
    res.status(200).json(formatResponse('User joined the event successfully', null, updatedEvent));
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const leaveEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.uid;

  try {

    const updatedEvent = await EventModel.leaveEvent(eventId, userId);
    res.status(200).json(formatResponse('User left the event successfully', null, updatedEvent));
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

const listEventParticipants = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.getEventById(eventId);
    const participantIds = event.participants || [];
    const participants = await Promise.all(participantIds.map(async id => {
      const participant = await UserModel.getUserById(id);
      return {
        id: id,
        displayName: participant ? participant.displayName : 'Unknown'
      };
    }));

    res.status(200).json(formatResponse('Success', null, participants));
  } catch (error) {
    console.error('Error listing event participants:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};


module.exports = {
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  listEventsByCommunity,
  joinEvent,
  leaveEvent,
  listEventParticipants
};
