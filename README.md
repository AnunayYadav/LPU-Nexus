
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University. From tracking attendance to crushing placement drives with AI resume analysis, Nexus is the ultimate campus companion.

![Version](https://img.shields.io/badge/version-1.1.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description to get an instant match score.
- **Brutal Feedback:** Leverages **Gemini 3 Flash/Pro** to provide critical phrasing advice and project critiques.

### 📂 Nexus Cloud Registry (Content Library)
- **Centralized Database:** A shared repository for LPU-specific lectures, question banks, and lab manuals.
- **Supabase Powered:** Real-time persistence using Supabase Storage and PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Backend/Cloud:** Supabase (PostgreSQL & Storage)

---

## ⚙️ Backend Setup (Supabase)

To enable the **Content Library**, you must run the following SQL in your Supabase **SQL Editor**:

```sql
-- 1. Create metadata table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    storage_path TEXT NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 3. Table Policies
CREATE POLICY "Allow public read" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.documents FOR DELETE USING (true);

-- 4. Storage Policies (Bucket: 'nexus-documents')
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'nexus-documents');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nexus-documents');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'nexus-documents');
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A **Google Gemini API Key**.
- A **Supabase Project** with a public bucket named `nexus-documents`.

### Installation

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```env
   API_KEY=your_gemini_api_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run:**
   ```bash
   npm run dev
   ```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
