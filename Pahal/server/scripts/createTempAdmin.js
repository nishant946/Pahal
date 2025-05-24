// This is a temporary script to create an admin user
const axios = require('axios');

async function createTempAdmin() {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/admin/create-temp-admin');
        console.log('Admin created successfully!');
        console.log('Use these credentials to login:');
        console.log('Email:', response.data.credentials.email);
        console.log('Password:', response.data.credentials.password);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('Admin already exists');
        } else {
            console.error('Error creating admin:', error.message);
        }
    }
}

createTempAdmin();
