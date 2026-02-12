import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let token = '';
let testUserId = null;

async function runTests() {
    console.log('🚀 Starting Backend API Tests...\n');

    try {
        // 1. Health Check
        console.log('--- 1. Health Check ---');
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health check status:', health.data.status);

        // 2. Register a Test User
        console.log('\n--- 2. User Registration ---');
        const userData = {
            name: 'Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        };
        const register = await axios.post(`${API_URL}/auth/register`, userData);
        console.log('✅ Registered user:', register.data.email);
        token = register.data.token;
        testUserId = register.data.id;

        // 3. Login
        console.log('\n--- 3. User Login ---');
        const login = await axios.post(`${API_URL}/auth/login`, {
            email: userData.email,
            password: userData.password
        });
        console.log('✅ Logged in successfully, token received');

        // 4. Get Profile
        console.log('\n--- 4. User Profile (Protected) ---');
        const profile = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile name:', profile.data.name);

        // 5. Get Categories
        console.log('\n--- 5. Categories API ---');
        const categories = await axios.get(`${API_URL}/categories`);
        console.log('✅ Fetched categories count:', categories.data.length);

        // 6. Create Listing (Protected)
        console.log('\n--- 6. Create Listing (Protected) ---');
        const listingData = {
            title: 'Test Marketplace Item',
            price: '$99.99',
            location: 'Tech City',
            description: 'A test item for verification',
            category: 'misc',
            details: { condition: 'New', brand: 'Generic' },
            images: ['https://via.placeholder.com/150']
        };
        const listing = await axios.post(`${API_URL}/listings`, listingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Created listing ID:', listing.data.id);

        // 7. Get All Listings
        console.log('\n--- 7. Get All Listings ---');
        const listings = await axios.get(`${API_URL}/listings`);
        console.log('✅ Fetched listings count:', listings.data.length);

        // 8. Get Chat History (Protected)
        console.log('\n--- 8. Chat History (Protected) ---');
        const chats = await axios.get(`${API_URL}/chats/${listing.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Fetched chat messages count:', chats.data.length);

        console.log('\n✨ All tests passed successfully! ✨');
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runTests();
