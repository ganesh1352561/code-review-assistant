const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase URL or KEY is missing. Set SUPABASE_URL and SUPABASE_KEY in environment.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Function to safely query the reviews table
async function safeQuery() {
  try {
    // This will fail if the table doesn't exist
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    return { exists: true, data };
  } catch (error) {
    if (error.code === '42P01') { // Table doesn't exist
      return { exists: false };
    }
    throw error;
  }
}

// Initialize the database
async function initializeDatabase() {
  try {
    console.log('🔍 Checking database connection and table status...');
    
    // First, try to query the table
    const { exists } = await safeQuery();
    
    if (!exists) {
      console.log('ℹ️  Reviews table does not exist. Please create it manually in the Supabase dashboard.');
      console.log('\nRun this SQL in your Supabase SQL Editor (Table Editor > SQL Editor):\n');
      console.log(`CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  filename TEXT NOT NULL,
  review_summary TEXT NOT NULL,
  suggestions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`);
      console.log('\nAfter creating the table, restart the server.');
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase and verified reviews table');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    
    if (error.code === '42501') {
      console.error('Error: Permission denied. Check if your Supabase anon key has proper permissions.');
    } else if (error.code === 'PGRST201') {
      console.error('Error: Bad request. Check your SQL query syntax.');
    } else if (error.code === 'PGRST202') {
      console.error('Error: Function not found. The required database functions might not exist.');
    } else if (error.code === '42P01') {
      console.error('Error: Table does not exist. Please create it manually.');
    }
    
    console.error('\nPlease check your Supabase project settings and ensure:');
    console.error('1. The database is running');
    console.error('2. Your IP is allowed in Supabase dashboard (Settings -> API -> Project Settings)');
    console.error('3. The anon/public key has proper table permissions');
    
    process.exit(1);
  }
}

// Initialize the database when the module loads
initializeDatabase().then(() => {
  console.log('🚀 Database connection is ready');});

module.exports = { 
  supabase: () => supabase,
  initializeDatabase
};
