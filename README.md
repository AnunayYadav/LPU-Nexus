
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University.

![Version](https://img.shields.io/badge/version-1.3.0-orange)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ⚙️ Database Fix & Setup (Supabase)

If you are seeing a "column not found" error or usernames are not appearing, run this script in your **Supabase SQL Editor**:

### 1. Unified Setup (Run This First)
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

-- Create 'profiles' table with all required fields
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    username TEXT UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    program TEXT,
    batch TEXT,
    bio TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR SELECT USING (is_public = true OR auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

### 2. Correct Auto-Profile Trigger
This script ensures that when a user signs up via the app, their `username` (sent in the metadata) is automatically pulled into the `profiles` table.
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, is_admin)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username', -- Extracts from app signup options
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger to ensure it uses the latest function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
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

### 💬 Verto Social Hub
- **Lounge:** Real-time campus-wide chat.
- **Squads:** Encrypted group messaging for sections or study groups.

---

## 🚀 Getting Started

1. `npm install`
2. Configure `.env` with `API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. `npm run dev`

*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
