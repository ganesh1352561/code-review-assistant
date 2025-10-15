
# Code Review Assistant

## Project Explanation

Code Review Assistant is a full-stack web application designed to automate and streamline the code review process for developers and teams. It leverages modern technologies to provide fast, AI-powered feedback on code submissions, helping users improve code quality and accelerate development cycles.

### Key Features
- **Automated Code Reviews:** Upload code files and receive instant, AI-generated review summaries and suggestions using the Groq LLaMA model.
- **User Authentication:** Secure sign-up and sign-in with Supabase authentication.
- **Review History:** View and manage past code review reports, including detailed feedback and suggestions.
- **Modern UI:** Responsive frontend built with React, Vite, and Tailwind CSS for a seamless user experience.
- **Scalable Backend:** Node.js (Express) backend with RESTful APIs, integrated with Supabase Postgres for persistent storage.

### How It Works
1. **User uploads code** via the frontend interface.
2. **Backend processes the file** and sends it to the Groq LLaMA model for review.
3. **AI model returns a review summary** and actionable suggestions.
4. **Results are stored** in the Supabase database and displayed to the user.

This project is ideal for developers, students, and teams looking to integrate AI-driven code review into their workflow or learn about building full-stack applications with modern tools.

Full-stack project: React (Vite + Tailwind) frontend, Node.js (Express) backend, Supabase Postgres database, and Groq LLaMA model for automated code reviews.

Quick start

1. Copy `.env.example` to `.env` and fill in your Supabase and Groq keys.
2. Create the `reviews` table in your Supabase database (SQL below).
3. Install dependencies and run both servers.

Supabase table SQL:

```sql
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filename text,
  review_summary text,
  suggestions text,
  created_at timestamp with time zone default now()
);
```

Run locally

Install in backend and frontend:

```powershell
cd backend; npm install
cd ../frontend; npm install
```

Start backend and frontend (or use the root concurrently script):

```powershell
# Start backend
cd backend; npm run dev
# In another terminal, start frontend
cd frontend; npm run dev
```

Notes

- Set `GROQ_API_KEY` to your Groq API key. The backend will call Groq's chat completions endpoint.
- The project contains minimal error handling for demo purposes. Treat production secrets carefully.
