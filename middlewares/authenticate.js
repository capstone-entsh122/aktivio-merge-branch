const {admin }= require('../config/firebaseAdmin.js');

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
        req.user = { uid: 'test-uid' };
        return next();
      }
      
    // Extract the token from the Authorization header
    const idToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    console.log('ID Token:', idToken);

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
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

module.exports = authenticate;