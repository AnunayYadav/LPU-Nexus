
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University.

![Version](https://img.shields.io/badge/version-1.2.1-orange)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ⚙️ Database Fix & Setup (Supabase)

If you are seeing a "column not found" error, run this script in your **Supabase SQL Editor**:

### 1. Fix Missing Columns & Setup Tables
```sql
-- Fix: Add missing columns to 'documents' if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='uploader_id') THEN
        ALTER TABLE public.documents ADD COLUMN uploader_id UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='admin_notes') THEN
        ALTER TABLE public.documents ADD COLUMN admin_notes TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='pending_update') THEN
        ALTER TABLE public.documents ADD COLUMN pending_update JSONB;
    END IF;
END $$;

-- Create 'profiles' table (Crucial for Admin & Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create 'folders' table for the File Manager
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'semester', 'subject', 'category'
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Public Read Docs" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public Read Folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Docs Insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Folders" ON public.folders FOR ALL USING (true);
```

### 2. Auto-Profile Creation (Recommended)
Run this to automatically create a profile record when a new user signs up:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description to get an instant match score.
- **Brutal Feedback:** Leverages **Gemini 3 Flash/Pro** to provide critical phrasing advice.

### 📂 Nexus FS Registry (Content Library)
- **Hierarchical File Manager:** Semester -> Subject -> Category structure.
- **Drag & Drop:** Admins can drag files directly into folders to pre-set upload paths.

---

## 🚀 Getting Started

1. `npm install`
2. Configure `.env` with `API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. `npm run dev`

*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
