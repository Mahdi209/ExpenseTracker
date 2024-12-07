const User = require('../model/user');
const FamilyGroup = require('../model/familyGroup');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // If user is a Parent, create a family group
        if (role === 'Parent') {
            const familyGroup = new FamilyGroup({
                name: `${name}'s Family`,
                parent_id: user._id,
                members: []
            });
            await familyGroup.save();
            user.family_group_id = familyGroup._id;
            await user.save();
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                family_group_id: user.family_group_id
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                family_group_id: user.family_group_id
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent role and password updates through this endpoint
        delete updates.role;
        delete updates.password;

        Object.keys(updates).forEach(update => user[update] = updates[update]);
        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                family_group_id: user.family_group_id
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
