# VibeForge AI 🚀

An AI-powered multi-agent application builder that translates ideas, sketches, and screenshots into production-ready full-stack applications with an interactive live preview.

## 🛠️ Tech Stack & Key Features

- **Frontend**: React 18 with Vite, Tailwind CSS, Lucide Icons, and Framer Motion.
- **Backend**: Express.js server router block supporting JSON generation.
- **AI Core**: Advanced Google Gemini Integration utilizing:
  - **Dynamic Robust Model Fallback**: Handles high load gracefully by rotating through `gemini-3.5-flash`, `gemini-2.5-flash`, `gemini-2.0-flash`, and `gemini-1.5-flash`.
  - **JSON Rescue Engine**: Automatically cleans Markdown code fences, intercepts unescaped multi-line code blocks, and repairs raw string values to guarantee bug-free syntax parsing.
- **Interactive Sandbox**: Let users preview, inspect, edit, and experiment with generated UI, schemas, backend routes, and unit tests directly in the browser.

## 🚀 Local Installation & Setup

1. **Clone the Repository**
   Keep all your projects in a regular directory (e.g., `C:\projects\vibeforge`) instead of active cloudfolders like OneDrive to prevent syncing locks.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your APIs:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## 📦 Production Deployment & Building

Compile and bundle the frontend and backend server files for production:
```bash
npm run build
npm start
```

---

## 🚀 Future Improvements

I'm continuously working to make VibeForge AI more powerful and developer-friendly. Planned enhancements include:

* 🎨 Screenshot to App Generation
* ✏️ Hand Sketch to Functional UI Conversion
* 🎤 Voice-to-App Creation
* 🔗 One-Click GitHub Repository Generation
* 📱 Support for Flutter and React Native
* ⚡ Automated CI/CD Pipeline Generation
* 🧠 Advanced Agent Collaboration & Memory
* ☁️ Direct Deployment to Multiple Cloud Providers
* 🐞 AI-Powered Code Debugging & Optimization
* 👥 Real-time Collaborative Workspace

My vision is to make software development as simple as describing an idea.

## ❤️ Made By Tanya Garg

Powered by:

* Google Gemini
* Google Cloud
* React
* Express.js
* Firebase
* Tailwind CSS

✨ VibeForge AI — From Idea → Code → Deploy
