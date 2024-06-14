const crypto = require('crypto');
const User = require('../models/usermodel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Create User
const createUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, mobile } = req.body;

    // Check for missing fields
    if (!firstname || !lastname || !email || !password || !mobile) {
        return res.status(400).json({ message: 'Firstname, Lastname, Email, Password, and Mobile are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    try {
        const user = new User({ firstname, lastname, email, password, mobile });
        await user.save();

        res.status(201).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists and password matches
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid Credentials' });
    }
});

// Update User
const updatedUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Block User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const blockedUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        );

        if (!blockedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User is blocked', user: blockedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unblock User
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const unblockedUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        );

        if (!unblockedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User is unblocked', user: unblockedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Password
const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(id);
        if (user) {
            user.password = password;
            const updatedPassword = await user.save();
            res.json(updatedPassword);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Forgot Password Token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set reset token and expiry on user model
        user.passwordResetToken = resetTokenHash;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

        await user.save();

        // Send reset token via email (assuming you have a sendEmail function)
        // await sendEmail(user.email, `Your password reset token is: ${resetToken}`);

        res.status(200).json({ message: 'Password reset token sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token has expired, please try again later' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Admin User
const createAdminUser = asyncHandler(async (req, res) => {
    try {
        const { firstname, lastname, email, password, mobile } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = new User({
            firstname: firstname || 'Admin',
            lastname: lastname || 'User',
            email: email || 'admin@example.com',
            password: hashedPassword,
            mobile: mobile || '1234567890',
            isAdmin: true,
        });

        await adminUser.save();
        res.status(201).json({ message: 'Admin user created' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin user', error: error.message });
    }
});

module.exports = { 
    createUser, 
    loginUserController,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    createAdminUser,
};
