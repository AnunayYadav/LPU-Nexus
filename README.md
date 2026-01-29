# 🚀 LPU-Nexus

**LPU-Nexus** is a comprehensive, AI-powered student utility platform designed specifically for the students of Lovely Professional University. From tracking attendance to crushing placement drives with AI resume analysis, Nexus is the ultimate campus companion.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203-red)

---

## ✨ Key Features

### 👔 The Placement Prefect (AI Resume Analyzer)
- **ATS Matching:** Upload your resume (PDF) and paste a Job Description to get an instant match score.
- **Brutal Feedback:** Leverages **Gemini 3 Flash/Pro** to provide critical phrasing advice and project critiques.
- **Keyword Extraction:** Identifies exactly what technical keywords are missing from your profile.

### 📈 Academic Progress (CGPA/SGPA Calculator)
- **Hybrid Input:** Calculate your scores by either entering raw marks or final grades.
- **Cumulative Tracking:** Enter your previous records to see your projected overall CGPA.
- **LPU Specific:** Calibrated with the LPU 10-point scale and relative grading advisory.

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

### 🎒 Freshers' Survival Kit
- **Essential Checklist:** A curated list of documents, hostel essentials, and electronics for new joiners.
- **Buy Links:** Quick links to essential survival gear on Amazon.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **PDF Processing:** PDF.js (Client-side extraction)
- **Visuals:** Mermaid.js (AI Flowchart generation)
- **Icons:** Lucide-inspired SVG components

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/)).

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
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── components/          # Modular UI components (Attendance, CGPA, etc.)
├── services/            # API & PDF processing logic
├── types.ts             # Global TypeScript interfaces & enums
├── App.tsx              # Main routing & layout logic
├── index.html           # Entry point with CDN loads
└── README.md            # You are here!
```

---

## 🛡️ Privacy & Security
- **No Backend:** LPU-Nexus does not store your academic data on any server. Everything (Attendance, Grades) is stored in your browser's `localStorage`.
- **API Safety:** Gemini API calls are made directly using your provided API key.

## 🤝 Contributing
Contributions are welcome! If you have a feature request or found a bug, please open an issue or submit a pull request. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Disclaimer: LPU-Nexus is an independent student-led project and is not officially affiliated with Lovely Professional University.*