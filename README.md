
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
- **Keyword Extraction:** Identifies exactly what technical keywords are missing from your profile.

### 📂 Nexus Cloud Registry (Content Library)
- **Centralized Database:** A shared repository for LPU-specific lectures, question banks, and lab manuals.
- **Supabase Powered:** Real-time persistence using Supabase Storage and PostgreSQL—files uploaded by any node are visible to all.
- **Global Search:** Semantic search across the shared library to find exactly the resource you need.

### 📈 Academic Progress (CGPA/SGPA Calculator)
- **Hybrid Input:** Calculate your scores by either entering raw marks or final grades.
- **Cumulative Tracking:** Enter your previous records to see your projected overall CGPA.
- **Shareable Reports:** Generate a unique, encoded link to share your academic standing with peers.

### 📅 Attendance Tracker
- **Smart Analytics:** Calculates exactly how many classes you can "Safe to Skip" or "Need to Attend" to hit your 75% goal.
- **Bulk Updates:** Quickly mark multiple subjects as present/absent.
- **Local Persistence:** Your data stays in your browser's `localStorage`—private and secure.

### 🍴 Campus Navigator
- **Mess Menu 2.0:** Includes the full Week 1 & Week 2 cycle menus for North/South Indian, Continental, and Healthy options.
- **Interactive 3D Map:** A fully integrated 3D view of the LPU campus powered by iViewd.
- **Crowdsourced Reporting:** Report outdated menu data to help the community.

### 🌍 Global Gateway
- **Web-Grounded Search:** Use Google Search Grounding to find real-time info on master's programs, visa requirements, and scholarships abroad.
- **Verified Sources:** Every AI answer comes with clickable citations to official university/government websites.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Backend/Cloud:** Supabase (PostgreSQL & Storage)
- **PDF Processing:** PDF.js (Client-side extraction)
- **Visuals:** Mermaid.js (AI Flowchart generation)

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/)).
- A **Supabase Project** with a bucket named `nexus-documents` and a table `documents`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lpu-nexus.git
   cd lpu-nexus
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_gemini_api_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Privacy & Security
- **Hybrid Storage:** Academic progress (Attendance/CGPA) is stored **locally** for privacy. Shared resources (Library) are stored in the **Cloud Registry**.
- **Public Node:** The library uses an `anon` key for easy community access to public academic materials.

## 🤝 Contributing
Contributions are welcome! If you have a feature request or found a bug, please open an issue or submit a pull request. 

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*
