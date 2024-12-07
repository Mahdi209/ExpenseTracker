const FamilyGroup = require('../model/familyGroup');
const User = require('../model/user');

// Get family group details
const getFamilyGroup = async (req, res) => {
    try {
        const familyGroup = await FamilyGroup.findOne({ 
            $or: [
                { parent_id: req.user._id },
                { members: req.user._id }
            ]
        }).populate('parent_id members', 'name email role');

        if (!familyGroup) {
            return res.status(404).json({ message: 'Family group not found' });
        }

        res.json(familyGroup);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add member to family group
const addFamilyMember = async (req, res) => {
    try {
        const { memberId } = req.body;

        // Check if the user is a parent
        if (req.user.role !== 'Parent') {
            return res.status(403).json({ message: 'Only parents can add family members' });
        }

        // Find the family group
        const familyGroup = await FamilyGroup.findOne({ parent_id: req.user._id });
        if (!familyGroup) {
            return res.status(404).json({ message: 'Family group not found' });
        }

        // Check if member exists and is not already in a family
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (member.family_group_id) {
            return res.status(400).json({ message: 'User is already part of a family group' });
        }

        // Add member to family group
        if (!familyGroup.members.includes(memberId)) {
            familyGroup.members.push(memberId);
            await familyGroup.save();

            // Update member's family group reference
            member.family_group_id = familyGroup._id;
            await member.save();
        }

        // Return updated family group with populated members
        const updatedFamilyGroup = await FamilyGroup.findById(familyGroup._id)
            .populate('parent_id members', 'name email role');

        res.json({
            message: 'Family member added successfully',
            familyGroup: updatedFamilyGroup
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove member from family group
const removeFamilyMember = async (req, res) => {
    try {
        const { memberId } = req.params;

        // Check if the user is a parent
        if (req.user.role !== 'Parent') {
            return res.status(403).json({ message: 'Only parents can remove family members' });
        }

        // Find the family group
        const familyGroup = await FamilyGroup.findOne({ parent_id: req.user._id });
        if (!familyGroup) {
            return res.status(404).json({ message: 'Family group not found' });
        }

        // Remove member from family group
        familyGroup.members = familyGroup.members.filter(
            member => member.toString() !== memberId
        );
        await familyGroup.save();

        // Update member's family group reference
        await User.findByIdAndUpdate(memberId, { family_group_id: null });

        // Return updated family group with populated members
        const updatedFamilyGroup = await FamilyGroup.findById(familyGroup._id)
            .populate('parent_id members', 'name email role');

        res.json({
            message: 'Family member removed successfully',
            familyGroup: updatedFamilyGroup
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update family group name
const updateFamilyGroup = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the user is a parent
        if (req.user.role !== 'Parent') {
            return res.status(403).json({ message: 'Only parents can update family group' });
        }

        // Find and update the family group
        const familyGroup = await FamilyGroup.findOneAndUpdate(
            { parent_id: req.user._id },
            { name },
            { new: true }
        ).populate('parent_id members', 'name email role');

        if (!familyGroup) {
            return res.status(404).json({ message: 'Family group not found' });
        }

        res.json({
            message: 'Family group updated successfully',
            familyGroup
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getFamilyGroup,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyGroup
};
