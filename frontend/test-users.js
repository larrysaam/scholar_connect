// Test script to check users in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUsers() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Count all users
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Count error:', countError);
      return;
    }
    
    console.log('Total users count:', totalUsers);
    
    // Test 2: Get all users with roles
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .limit(10);
      
    if (usersError) {
      console.error('Users fetch error:', usersError);
      return;
    }
    
    console.log('Users sample:', users);
    
    // Test 3: Count by roles
    const roleBreakdown = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Role breakdown from sample:', roleBreakdown);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testUsers();
