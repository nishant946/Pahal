const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../../models/teacher.model');
const temp_admin = require('../../config/temp_admin');

// Temporary route to create admin - REMOVE IN PRODUCTION
router.post('/setup-temp-admin', async (req, res) => {
    try {
        // Check if admin already exists
        const adminExists = await Teacher.findOne({ isAdmin: true });
        if (adminExists) {
            return res.status(400).json({ 
                message: 'Admin already exists',
                loginCredentials: {
                    email: temp_admin.email,
                    password: temp_admin.password
                }
            });
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash(temp_admin.password, 10);
        const admin = new Teacher({
            ...temp_admin,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({
            message: 'Temporary admin created successfully',
            loginCredentials: {
                email: temp_admin.email,
                password: temp_admin.password
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
