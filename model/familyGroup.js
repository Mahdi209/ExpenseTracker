
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     FamilyGroup:
 *       type: object
 *       required:
 *         - name
 *         - parent_id
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the family group
 *         parent_id:
 *           type: string
 *           description: Reference to the parent user (head of family)
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: Array of user IDs who are members of this family
 *        
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

const familyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Family group name is required'],
        trim: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Parent user ID is required']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        nullable: true
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const FamilyGroup = mongoose.model('FamilyGroup', familyGroupSchema);

module.exports = FamilyGroup;