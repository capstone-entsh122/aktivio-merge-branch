const axios = require('axios');
const FormData = require('form-data');
const UserModel = require('../models/user.model');
const formatResponse = require('../helpers/responseFormatter');

const classify = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const form = new FormData();
    form.append('image', req.file.buffer, req.file.originalname);

    try {
        const response = await axios.post('http://localhost:5000/classify', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Send Flask response back to the client
        res.json(formatResponse('Success', null, response.data));
    } catch (error) {
        console.error('Error classifying image:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }

}

const setCalories = async (req, res) => {
    const userId = req.user.uid;
    const { calories } = req.body;

    if (!calories) {
        return res.status(400).json(formatResponse('Bad Request: Missing calories value'));
    }

    try {
        await UserModel.updateUserCalories(userId, calories);
        res.status(200).json(formatResponse('Calories updated successfully'));
    } catch (error) {
        console.error('Error updating calories:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }

}

module.exports = {classify, setCalories};