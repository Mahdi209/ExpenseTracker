const jwt = require('jsonwebtoken');
const User = require('../model/user');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 */

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by id and token
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error('User not found');
        }

        // Add user to request object
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

// Middleware to check if user is a parent
const isParent = async (req, res, next) => {
    try {
        if (req.user.role !== 'Parent') {
            return res.status(403).json({ message: 'Access denied. Parent role required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Middleware to check if user is a family member
const isFamilyMember = async (req, res, next) => {
    try {
        if (req.user.role !== 'family_member') {
            return res.status(403).json({ message: 'Access denied. Family member role required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    auth,
    isParent,
    isFamilyMember
};
