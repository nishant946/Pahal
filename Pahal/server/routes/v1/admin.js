const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../../models/teacher.model');

// Temporary route to create admin - REMOVE IN PRODUCTION
router.post('/create-temp-admin', async (req, res) => {
    try {
        // Check if admin already exists
        const adminExists = await Teacher.findOne({ isAdmin: true });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create admin with hardcoded credentials
        const adminData = {
            name: 'Admin User',
            email: 'admin@pahal.com',
            password: 'admin123@pahal', // This will be hashed
            isAdmin: true,
            isVerified: true
        };

        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const admin = new Teacher({
            ...adminData,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({
            message: 'Temporary admin created successfully',
            credentials: {
                email: adminData.email,
                password: adminData.password // Sending plain password only for temporary admin
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
