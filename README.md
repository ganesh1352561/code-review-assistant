## 📘 Project Overview

**Code Review Assistant** is a full-stack web application designed to **automate and streamline code reviews** using **AI-powered feedback**.  
Developers and teams can upload code, receive instant AI-generated suggestions, and maintain a history of reviews — all in one modern, responsive platform.

---

## ✨ Key Features

✅ **Automated Code Reviews:** Upload code files and get instant AI-generated review summaries and improvement suggestions via **Groq LLaMA**.  
🔐 **User Authentication:** Secure sign-up and sign-in powered by **Supabase Auth**.  
📜 **Review History:** Save and view past code reviews, summaries, and feedback reports.  
💻 **Modern UI:** Clean, responsive interface built with **React (Vite)** and **Tailwind CSS**.  
⚙️ **Scalable Backend:** Robust **Node.js (Express)** backend integrated with **Supabase Postgres**.  

---

## ⚡ How It Works

1. 🧑‍💻 **User uploads code** via the frontend.  
2. 🧠 **Backend processes the file** and sends it to the **Groq LLaMA** model for analysis.  
3. 💬 **AI model returns review feedback** — summaries and suggestions.  
4. 💾 **Results are stored** in the Supabase database and displayed to the user in the dashboard.  

---

## 🧩 Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React (Vite), Tailwind CSS |
| **Backend** | Node.js (Express) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI Model** | Groq LLaMA |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) |

---

## 🪄 Quick Start Guide

### 1️⃣ Setup Environment

Copy `.env.example` → `.env` and add your keys:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filename text,
  review_summary text,
  suggestions text,
  created_at timestamp with time zone default now()
);
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
