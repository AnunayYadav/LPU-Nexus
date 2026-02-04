
# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University.

![Version](https://img.shields.io/badge/version-1.4.0-orange)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)
![Cloud](https://img.shields.io/badge/Database-Supabase-emerald)

---

## ⚙️ Database Setup (Supabase)

If you are seeing "Connection failed" or "Identity protocol failure," you must run these scripts in your **Supabase SQL Editor**:

### 1. Core Profile Setup
```sql
-- Create 'profiles' table
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, is_admin)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 2. Social Hub & Messaging Setup (CRITICAL FOR MESSAGING)
Run this to fix the "Unable to establish communication link" error:

```sql
-- Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT, -- Null for DMs
    is_group BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(conversation_id, user_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Global Lounge Messages
CREATE TABLE IF NOT EXISTS public.social_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id),
    sender_name TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Friend Request System
CREATE TABLE IF NOT EXISTS public.friend_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id),
    receiver_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending', -- pending, accepted, declined
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(sender_id, receiver_id)
);

-- RPC Function to find existing DMs (Fixes the "Message" button)
CREATE OR REPLACE FUNCTION get_dm_between_users(user1 UUID, user2 UUID)
RETURNS SETOF conversations AS $$
BEGIN
  RETURN QUERY
  SELECT c.*
  FROM conversations c
  JOIN conversation_members cm1 ON c.id = cm1.conversation_id
  JOIN conversation_members cm2 ON c.id = cm2.conversation_id
  WHERE c.is_group = false
    AND cm1.user_id = user1
    AND cm2.user_id = user2
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Messaging RLS Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own conversations" ON conversations FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = id AND user_id = auth.uid()));
CREATE POLICY "Create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "View members" ON conversation_members FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_members sub WHERE sub.conversation_id = conversation_id AND sub.user_id = auth.uid()));
CREATE POLICY "Join conversations" ON conversation_members FOR INSERT WITH CHECK (true);
CREATE POLICY "View messages" ON messages FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "View Lounge" ON social_messages FOR SELECT USING (true);
CREATE POLICY "Post Lounge" ON social_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "View Requests" ON friend_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Manage Requests" ON friend_requests FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
```

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description to get an instant match score.
- **Brutal Feedback:** Leverages **Gemini 3 Pro** to provide critical phrasing advice.

### 📂 Nexus FS Registry (Content Library)
- **Hierarchical File Manager:** Semester -> Subject -> Category structure.
- **Contribution:** Students can upload notes for peer verification.

### 💬 Verto Social Hub
- **Lounge:** Real-time campus-wide chat.
- **Squads:** Encrypted group messaging for sections or study groups.
- **Directory:** Find and message any Verto on campus.

*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
