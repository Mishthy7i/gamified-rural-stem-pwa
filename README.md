# Smart Pathshala – A Gamified STEM Learning PWA for Rural Students

Smart Pathshala is a **Progressive Web App (PWA)** designed to bring interactive, gamified STEM learning (Science, Technology, Engineering, and Mathematics) to **rural students in grades 6–12** in India. The app is built to be **lightweight, low‑bandwidth‑friendly**, and accessible on **low‑cost Android devices**, with support for **English, Hindi, and regional languages**, as well as **voice‑based interaction**.

---

## 🎯 Project Overview

Smart Pathshala helps students:

- Learn core STEM concepts through **level‑based topics** (e.g., Fractions, Decimals, Algebra)  
- Practice with **interactive tasks** (MCQs, puzzles, story‑based problems)  
- Earn **points, stars, and badges** to stay motivated  

Teachers can:

- Create classes and generate **unique class codes**  
- Track student progress via a **simple dashboard**  
- Provide **feedback** and assign tasks  

The app follows a **mobile‑first, accessible UI**, with large touch targets, clear navigation, and minimal visual clutter, making it suitable for users with limited digital literacy.

---

## 📱 Key Features

- **Onboarding & Profiles**
  - Role selection: **Student** and **Teacher**
  - Simple student info, school selection, and class selection

- **Gamified Learning Path**
  - **Vertical level map** (Levels 1–12) with unlocked/completed states
  - Each level corresponds to a STEM topic (e.g., Fractions, Decimals, Algebra)
  - Visual progress tracking and milestone rewards

- **Interactive Learning Tasks**
  - Short topic explanations with an animated avatar
  - Three task types per topic:
    - Multiple‑choice questions (MCQs)
    - Interactive puzzles (drag‑and‑match, grids, etc.)
    - Story‑based word problems

- **Gamification System**
  - Points, stars, and badges for completing tasks and levels
  - Encourages repeated practice and concept mastery

- **AI‑Assisted Doubt Solving**
  - Chat‑style interface with **text and voice input**
  - Simple, clear responses in the user’s language

- **Teacher Management**
  - Create and manage classes with unique class codes
  - Track student progress via a **dashboard** with completion % and performance insights
  - Provide **feedback**, assign tasks, and send notifications

- **Accessibility & Low‑Cost Support**
  - Optimized for low‑bandwidth and low‑PPI devices
  - Simple layout, clear icons, and large buttons
  - Multilingual content (English, Hindi, regional languages) with voice support

---

## 🧩 Tech Stack

**Frontend**: React + Vite + Tailwind CSS  
**PWA Features**: Service Workers (offline caching), Local Storage  
**Backend**: Firebase (Firestore, Authentication, Cloud Functions)

---

## 🚀 Getting Started (Local Dev)

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/smart-pathshala.git
   cd smart-pathshala
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable **Firestore**, **Authentication**, and **Cloud Functions**
   - Copy your Firebase config to `.env.local`

4. **Environment variables**

   Create `.env.local`:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

7. **Deploy as a PWA**

   ```bash
   # Deploy to Firebase Hosting
   npm run deploy
   ```

---

## 📊 Data Model (High‑Level)

- `User` – shared base model for students and teachers  
- `Student` – extends `User` with school, class, language, and voice preferences  
- `Teacher` – extends `User` with school, subject, and class details  
- `Class` – teacher‑managed class with a unique code and grade/subject  
- `Level` – 1–12, each with a topic (e.g., Fractions, Decimals, Algebra)  
- `Task` – MCQs, puzzles, word problems grouped under a level  
- `StudentLevelProgress` – tracks unlocked/completed levels, stars, and points  
- `StudentTaskAttempt` – records scores and attempts for each task  
- `Feedback` – teacher‑to‑student feedback with assigned tasks  
- `Notification` – notification previews and status

---

## 🎨 Design Principles

- **Mobile‑first layout** with large touch targets  
- **Clean, minimal UI** – no unnecessary clutter or childish illustrations  
- **Consistent design system** – rounded cards, soft shadows, clear typography  
- **Gamification with purpose** – points, stars, and badges used to reinforce learning, not distract  
- **Offline‑friendly UX** – cached levels, tasks, and progress indicators  
- **Multilingual + voice** – supports text and voice input for low‑literacy users  

---




🚀 **Let's make STEM learning accessible and engaging for every rural student with Smart Pathshala.**
