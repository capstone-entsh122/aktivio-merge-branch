const axios = require('axios');
const FormData = require('form-data');
const UserModel = require('../models/user.model');
const formatResponse = require('../helpers/responseFormatter');
const { bucket } = require('../config/gcsClient.js');
const uploadFile = require('../helpers/uploadFile');
const path = require('path');

const classify = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const form = new FormData();
    form.append('image', req.file.buffer, req.file.originalname);

    try {
        const response = await axios.post('https://aktivio-classification-xvcqyzplqq-et.a.run.app/api/classify', form, {
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
    const { calories, nutrition, foodLabel } = req.body;

    if (!calories || !foodLabel) {
        return res.status(400).json(formatResponse('Bad Request: Missing calories or food label'));
    }

    if (!req.file) {
        return res.status(400).json(formatResponse('Bad Request', 'No image file uploaded'));
    }

    try {
        const filePath = `food_images/${userId}/${Date.now()}${path.extname(req.file.originalname)}`;
        const uploadedFilePath = await uploadFile(req.file, filePath);
        const foodEntry = {
            foodLabel: foodLabel,
            calories: calories,
            nutrition: nutrition,
            imagePath: uploadedFilePath // Store only the path
        };
        await UserModel.addFoodEntry(userId, foodEntry);
        await UserModel.updateUserCalories(userId, calories);
        // Generate a short-lived signed URL for immediate use
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
        const [signedUrl] = await bucket.file(uploadedFilePath).getSignedUrl(options);

        res.status(200).json(formatResponse('Calories and food entry updated successfully', null, { imageUrl: signedUrl }));
  
    } catch (error) {
        console.error('Error updating calories and storing image:', error);
        res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
    

}

module.exports = {classify, setCalories};