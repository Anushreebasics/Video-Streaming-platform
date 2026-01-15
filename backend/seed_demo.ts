
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const API_URL = 'http://localhost:5001/api';
const ORG_ID = 'Demo_Corp';

const users = [
    { username: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin', organizationId: ORG_ID },
    { username: 'Editor User', email: 'editor@demo.com', password: 'password123', role: 'editor', organizationId: ORG_ID },
    { username: 'Viewer User', email: 'viewer@demo.com', password: 'password123', role: 'viewer', organizationId: ORG_ID },
];

async function seed() {
    try {
        console.log('🌱 Starting Seed...');

        // 1. Register Users
        for (const user of users) {
            try {
                await axios.post(`${API_URL}/auth/register`, user);
                console.log(`✅ Registered: ${user.role}`);
            } catch (e) {
                console.log(`⚠️  ${user.role} might already exist`);
            }
        }

        // 2. Login as Editor to Upload
        const editor = users[1];
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email: editor.email, password: editor.password });
        const token = loginRes.data.token;
        console.log('🔑 Editor Logged In for Upload');

        // 3. Upload Dummy Video
        // Create dummy file if not exists
        if (!fs.existsSync('demo_video.mp4')) {
            fs.writeFileSync('demo_video.mp4', 'dummy video content');
        }

        const formData = new FormData();
        formData.append('video', fs.createReadStream('demo_video.mp4'));
        formData.append('title', 'Project Demo Launch v1');

        await axios.post(`${API_URL}/videos`, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('📹 Demo Video Uploaded');

    } catch (error: any) {
        console.error('❌ Seed Failed:', error.message || error);
    }
}

seed();
