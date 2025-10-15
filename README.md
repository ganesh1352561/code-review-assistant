# 🚀 Code Review Assistant

## 📘 Project Explanation
Code Review Assistant is a full-stack web application designed to automate and streamline the code review process for developers and teams.  
It leverages modern technologies to provide fast, AI-powered feedback on code submissions, helping users improve code quality and accelerate development cycles.

---

## ✨ Key Features
- 🔍 **Automated Code Reviews:** Upload code files and receive instant, AI-generated review summaries and suggestions using the Groq LLaMA model.  
- 🔐 **User Authentication:** Secure sign-up and sign-in with Supabase authentication.  
- 🗂️ **Review History:** View and manage past code review reports, including detailed feedback and suggestions.  
- 💻 **Modern UI:** Responsive frontend built with React, Vite, and Tailwind CSS for a seamless user experience.  
- ⚙️ **Scalable Backend:** Node.js (Express) backend with RESTful APIs integrated with Supabase Postgres for persistent storage.  

---

## ⚡ How It Works
1️⃣ **User uploads code** via the frontend interface.  
2️⃣ **Backend processes the file** and sends it to the Groq LLaMA model for review.  
3️⃣ **AI model returns a review summary** and actionable suggestions.  
4️⃣ **Results are stored** in the Supabase database and displayed to the user.  

This project is ideal for developers, students, and teams looking to integrate AI-driven code review into their workflow or learn about building full-stack applications with modern web technologies.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite), Tailwind CSS |
| **Backend** | Node.js (Express) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI Model** | Groq LLaMA |

---

## ⚙️ Quick Start

### 1️⃣ Environment Setup
Copy `.env.example` to `.env` and fill in your Supabase and Groq keys.

---

### 2️⃣ Supabase Table SQL
Run the following in your Supabase SQL Editor:

```sql
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filename text,
  review_summary text,
  suggestions text,
  created_at timestamp with time zone default now()
);
