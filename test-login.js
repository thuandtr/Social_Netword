// Simple test to check the login functionality
const axios = require('axios');

async function testLogin() {
    try {
        console.log("Testing direct axios call to backend...");
        
        const response = await axios.post('http://localhost:5000/api/v1/auth/user/login', {
            email: 'testuserunique@test.com',
            password: 'testpass123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("Response headers:", response.headers);
        console.log("Set-Cookie headers:", response.headers['set-cookie']);
        
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
}

testLogin();