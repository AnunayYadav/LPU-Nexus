
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University.

![Version](https://img.shields.io/badge/version-1.4.1-orange)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ⚙️ Database Setup (Supabase)

If files are not showing up, you **MUST** run these scripts in your **Supabase SQL Editor**:

### 1. Core Profile Setup
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    username TEXT UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    program TEXT,
    batch TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

### 2. Content Library (Crucial for Files)
```sql
-- Folders for hierarchy
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- semester, subject, category
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    semester TEXT,
    type TEXT,
    size TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    storage_path TEXT NOT NULL,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Library
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Admins can manage folders" ON public.folders ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Anyone can view approved documents" ON public.documents FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (uploader_id = auth.uid());
CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Users can upload documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
```

### 3. User History & Records
```sql
CREATE TABLE IF NOT EXISTS public.user_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- cgpa_snapshot, resume_audit, etc.
    label TEXT,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON public.user_history ALL USING (auth.uid() = user_id);
```

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description.
- **Brutal Feedback:** Leverages **Gemini 3 Pro** for critical phrasing advice.

### 📂 Nexus FS Registry (Content Library)
- **Hierarchy:** Semester -> Subject -> Category.
- **Moderation:** Files stay in 'Pending' until a Verto Admin approves them.

*Disclaimer: LPU-Nexus is an independent student-led project.*
