const groqService = require('../services/groqService');
const { supabase } = require('../config/supabaseClient');

// Helper function to handle database operations with retries
async function withRetry(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError || new Error('Max retries reached');
}

// POST /api/review
exports.handleReview = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filename = req.file.originalname;
    const content = req.file.buffer.toString('utf8');

    const llmResult = await groqService.reviewCode(content);

    // Process the LLM result
    const raw = llmResult.text || llmResult;
    let review_summary = raw;
    let suggestions = '';

    const splitMarker = /suggestions?:/i;
    if (splitMarker.test(raw)) {
      const parts = raw.split(splitMarker);
      review_summary = parts[0].trim();
      suggestions = parts.slice(1).join('Suggestions:').trim();
    }

    // Insert the review using the supabase client and associate with the user
    const userId = req.user && req.user.id ? req.user.id : null;
    const { data, error } = await withRetry(() => 
      supabase()
        .from('reviews')
        .insert({ filename, review_summary, suggestions, user_id: userId })
        .select()
        .single()
    );

    if (error) {
      console.error('Database error:', error);
      // Detect missing user_id column in reviews table (common migration mismatch)
      const msg = String(error.message || error.error || '');
      if (msg.includes("Could not find the 'user_id'") || msg.includes('PGRST204') || msg.includes('user_id')) {
        return res.status(500).json({
          error: "Database schema mismatch: 'user_id' column is missing in 'reviews' table",
          fix: "Run the SQL below in your Supabase SQL editor to add the column:",
          sql: "ALTER TABLE public.reviews ADD COLUMN user_id UUID;",
          details: process.env.NODE_ENV === 'development' ? msg : undefined
        });
      }

      return res.status(500).json({ 
        error: 'Failed to save review',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.json({
      id: data.id,
      filename: data.filename,
      review_summary: data.review_summary,
      suggestions: data.suggestions,
      created_at: data.created_at
    });

  } catch (err) {
    console.error('Error in handleReview:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : null;
    const { data, error } = await withRetry(() =>
      supabase()
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );

    if (error) {
      console.error('Database error when fetching reports:', error);
      const msg = String(error.message || error.error || '');
      if (msg.includes("Could not find the 'user_id'") || msg.includes('PGRST204') || msg.includes('user_id')) {
        return res.status(500).json({
          error: "Database schema mismatch: 'user_id' column is missing in 'reviews' table",
          fix: "Run the SQL below in your Supabase SQL editor to add the column:",
          sql: "ALTER TABLE public.reviews ADD COLUMN user_id UUID;",
          details: process.env.NODE_ENV === 'development' ? msg : undefined
        });
      }
      throw error;
    }
    res.json(data || []);
  } catch (error) {
    console.error('Error in getReports:', error);
    res.status(500).json({
      error: 'Failed to fetch reports',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && req.user.id ? req.user.id : null;
    const { data, error } = await withRetry(() =>
      supabase()
        .from('reviews')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    );

    if (error) {
      console.error('Database error when fetching report by id:', error);
      const msg = String(error.message || error.error || '');
      if (msg.includes("Could not find the 'user_id'") || msg.includes('PGRST204') || msg.includes('user_id')) {
        return res.status(500).json({
          error: "Database schema mismatch: 'user_id' column is missing in 'reviews' table",
          fix: "Run the SQL below in your Supabase SQL editor to add the column:",
          sql: "ALTER TABLE public.reviews ADD COLUMN user_id UUID;",
          details: process.env.NODE_ENV === 'development' ? msg : undefined
        });
      }
      throw error;
    }
    if (!data) return res.status(404).json({ error: 'Report not found' });

    // Ensure the authenticated user owns the report
    if (data.user_id && userId && String(data.user_id) !== String(userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in getReportById:', error);
    res.status(500).json({
      error: 'Failed to fetch report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
