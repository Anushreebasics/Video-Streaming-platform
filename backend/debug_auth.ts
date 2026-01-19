
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

async function testAuth() {
    try {
        console.log('Testing Registration...');
        try {
            const regRes = await axios.post(`${API_URL}/register`, {
                username: 'debuguser',
                email: 'debug@test.com',
                password: 'password123',
                role: 'editor',
                organizationId: 'debug-org'
            });
            console.log('Registration Success:', regRes.data);
        } catch (e: any) {
            console.error('Registration Failed:', e.response?.status, e.response?.data);
        }

        console.log('\nTesting Login...');
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: 'debug@test.com',
                password: 'password123'
            });
            console.log('Login Success:', loginRes.data);
        } catch (e: any) {
            console.error('Login Failed:', e.response?.status, e.response?.data);
        }

    } catch (e) {
        console.error('Test Error:', e);
    }
}

testAuth();
