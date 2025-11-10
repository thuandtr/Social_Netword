// Test script for Activity Feed Backend API
// Run with: node test-activity-api.js

import axios, { post } from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/auth';

// Test credentials - update with your actual test user
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
};

let authToken = '';
let testActivityId = '';

// Helper to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    withCredentials: true
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test 1: Login
async function testLogin() {
  console.log('\n🔑 Test 1: Login');
  try {
    const response = await post(`${BASE_URL}/user/login`, TEST_USER, {
      withCredentials: true
    });
    
    // Extract token from cookie or response
    authToken = response.data.accessToken || response.headers['set-cookie']?.[0]?.match(/access_token=([^;]+)/)?.[1];
    
    console.log('✅ Login successful');
    console.log('Token:', authToken ? 'Received' : 'Not found');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Get Activities
async function testGetActivities() {
  console.log('\n📋 Test 2: Get Activities');
  try {
    const response = await authRequest('GET', '/activities');
    console.log('✅ Activities fetched');
    console.log(`Found ${response.data.activities?.length || 0} activities`);
    
    if (response.data.activities?.length > 0) {
      testActivityId = response.data.activities[0].id;
      console.log('Sample activity:', JSON.stringify(response.data.activities[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch activities:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Create Activity
async function testCreateActivity() {
  console.log('\n➕ Test 3: Create Activity');
  try {
    const activityData = {
      activity_type: 'project_created',
      activity_data: {
        project_name: 'Test Project',
        project_description: 'A test project created via API',
        source_link: 'https://github.com/test/project',
        technologies: 'Node.js, Express, MySQL'
      }
    };
    
    const response = await authRequest('POST', '/activities', activityData);
    console.log('✅ Activity created');
    console.log('Activity ID:', response.data.activityId);
    testActivityId = response.data.activityId;
    return true;
  } catch (error) {
    console.error('❌ Failed to create activity:', error.response?.data || error.message);
    return false;
  }
}

// Test 4: Toggle Reaction
async function testToggleReaction() {
  console.log('\n👍 Test 4: Toggle Reaction');
  
  if (!testActivityId) {
    console.log('⚠️  Skipping: No activity ID available');
    return false;
  }
  
  try {
    const response = await authRequest('POST', `/activities/${testActivityId}/reaction`, {
      emoji: '🎉'
    });
    console.log('✅ Reaction toggled');
    console.log('Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to toggle reaction:', error.response?.data || error.message);
    return false;
  }
}

// Test 5: Add Comment
async function testAddComment() {
  console.log('\n💬 Test 5: Add Comment');
  
  if (!testActivityId) {
    console.log('⚠️  Skipping: No activity ID available');
    return false;
  }
  
  try {
    const response = await authRequest('POST', `/activities/${testActivityId}/comment`, {
      content: 'This is a test comment from the API test script!'
    });
    console.log('✅ Comment added');
    console.log('Comment:', response.data.comment);
    return true;
  } catch (error) {
    console.error('❌ Failed to add comment:', error.response?.data || error.message);
    return false;
  }
}

// Test 6: Request Collaboration
async function testCollaboration() {
  console.log('\n🤝 Test 6: Request Collaboration');
  
  if (!testActivityId) {
    console.log('⚠️  Skipping: No activity ID available');
    return false;
  }
  
  try {
    const response = await authRequest('POST', `/activities/${testActivityId}/collaborate`, {
      message: 'I would love to collaborate on this project!'
    });
    console.log('✅ Collaboration requested');
    console.log('Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to request collaboration:', error.response?.data || error.message);
    console.log('Note: This might fail if requesting collaboration on own project');
    return false;
  }
}

// Test 7: Get Collaboration Requests
async function testGetCollaborations() {
  console.log('\n📬 Test 7: Get Collaboration Requests');
  try {
    const response = await authRequest('GET', '/activities/collaborations?status=pending');
    console.log('✅ Collaboration requests fetched');
    console.log(`Found ${response.data.requests?.length || 0} pending requests`);
    
    if (response.data.requests?.length > 0) {
      console.log('Sample request:', JSON.stringify(response.data.requests[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch collaborations:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Activity Feed API Tests');
  console.log('=====================================');
  
  const results = {
    passed: 0,
    failed: 0
  };
  
  // Test 1: Login (required for other tests)
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('\n❌ Login failed - cannot continue with other tests');
    console.log('\nPlease ensure:');
    console.log('1. Backend server is running on http://localhost:5000');
    console.log('2. Test user exists with credentials:', TEST_USER);
    console.log('3. Database is connected and tables are created');
    return;
  }
  results.passed++;
  
  // Run remaining tests
  const tests = [
    testGetActivities,
    testCreateActivity,
    testToggleReaction,
    testAddComment,
    testCollaboration,
    testGetCollaborations
  ];
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('📊 Test Results Summary');
  console.log('=====================================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('=====================================\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});
