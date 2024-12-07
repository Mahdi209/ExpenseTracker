const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         user_id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address
 *           format: email
 *         password:
 *           type: string
 *           description: User's hashed password
 *         role:
 *           type: string
 *           enum: ['family_head', 'family_member', 'single']
 *           description: User's role in the system
 *         family_group_id:
 *           type: string
 *           description: Reference to family group (if applicable)
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['Parent', 'family_member', 'individual'],
            message: '{VALUE} is not a valid role'
        }
    },
    family_group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyGroup',
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;