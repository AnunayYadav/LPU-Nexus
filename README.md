
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University. From tracking attendance to crushing placement drives with AI resume analysis, Nexus is the ultimate campus companion.

![Version](https://img.shields.io/badge/version-1.2.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description to get an instant match score.
- **Brutal Feedback:** Leverages **Gemini 3 Flash/Pro** to provide critical phrasing advice and project critiques.

### 📂 Nexus FS Registry (Content Library)
- **Hierarchical File Manager:** Semester -> Subject -> Category structure.
- **Dynamic Admin Folders:** Admins can create and manage the folder registry dynamically.
- **Supabase Powered:** Real-time persistence using Supabase Storage and PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Backend/Cloud:** Supabase (PostgreSQL & Storage)

---

## ⚙️ Backend Setup (Supabase)

To enable the **Content Library** and **Folder Registry**, run the following SQL:

```sql
-- 1. Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    storage_path TEXT NOT NULL,
    uploader_id UUID,
    admin_notes TEXT,
    pending_update JSONB
);

-- 2. Create folders table (New)
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'semester', 'subject', 'category'
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Public Read" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public Read Folders" ON public.folders FOR SELECT USING (true);
-- Update/Insert policies should be restricted to authenticated users in production
CREATE POLICY "Public Insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Folders" ON public.folders FOR INSERT WITH CHECK (true);
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A **Google Gemini API Key**.
- A **Supabase Project** with a public bucket named `nexus-documents`.

### Installation
1. `npm install`
2. Configure `.env` with `API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. `npm run dev`

---

## 📄 License
Distributed under the MIT License.

---
*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
