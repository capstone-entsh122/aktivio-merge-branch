// utils/responseFormatter.js

/**
 * Formats the API response in a consistent structure.
 * 
 * @param {string} message - The success message.
 * @param {string} [error=null] - The error message, if any.
 * @param {Object} [data=null] - The data to return.
 * @returns {Object} The formatted response.
 */
const formatResponse = (message, error = null, data = null) => {
    const response = { message, data };
    if (error) {
        response.error = error;
    }
    return response;
};

module.exports = formatResponse;
