require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by listing all tables
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) throw error;
    
    console.log('\nConnected to Supabase successfully!');
    console.log('\nExisting tables in public schema:');
    console.table(tables.map(t => ({ 'Table Name': t.tablename })));
    
    // Try to create the reviews table directly
    console.log('\nAttempting to create reviews table...');
    const { error: createError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          filename TEXT NOT NULL,
          review_summary TEXT NOT NULL,
          suggestions TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (createError) {
      console.error('Error creating table:', createError);
    } else {
      console.log('✅ Successfully created/verified reviews table');
    }
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'PGRST301' || error.code === 'PGRST301') {
      console.error('\n⚠️  Possible issues:');
      console.error('1. Check if your Supabase URL is correct');
      console.error('2. Verify your Supabase anon/public key is correct');
      console.error('3. Ensure your database is running in Supabase');
      console.error('4. Check if your IP is allowed in Supabase dashboard (Settings -> API)');
    }
  }
}

testConnection();
