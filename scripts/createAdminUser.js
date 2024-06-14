const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const createAdminUser = async () => {
    try {
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        const adminUser = new User({
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            mobile: '1234567890',
            isAdmin: true,
        });

        await adminUser.save();
        console.log('Admin user created');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
};

createAdminUser();
