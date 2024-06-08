const admin = require('../config/firebaseAdmin');

/**
 * Middleware to authenticate users using Firebase ID tokens.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */

 
const authenticate = async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        // Skip authentication during tests and assign a mock user ID
        req.user = { uid: 'mockUserId' };
        return next();
      }
      
    // Extract the token from the Authorization header
    const idToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Attach the decoded token to the request object
        req.user = decodedToken;
        // Proceed to the next middleware function
        next();
    } catch (error) {
        console.error('Error verifying ID Token: ',error);
        
        if (error.code === 'auth/argument-error') {
            return res.status(400).send('Bad Request: Invalid token format');
        }
        return res.status(401).send('Unauthorized');
    }
}

module.exports = authenticate;