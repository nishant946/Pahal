import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {
    console.log("Request body:", req.body);
    
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
    }
    
    const { firstName, lastName, username, email, password } = req.body;
    
    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ 
            message: 'Missing required fields',
            required: ['firstName', 'lastName', 'username', 'email', 'password'],
            received: req.body
        });
    }
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, expiresIn: '1h', user: { id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



