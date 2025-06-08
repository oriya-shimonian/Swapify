# 🔄 Swapify

**Swapify** is a full-stack web platform designed for users to easily swap puzzles, board games, and books within their community. The project was built with a focus on user experience, modular architecture, and modern development practices.

---

## ✨ Key Features

- 🔍 Advanced product search and filtering by category, location, date, and more
- 🧠 AI-powered image processing to autofill product details when uploading new listings
- 🔄 Swap request system: send, receive, approve, reject
- 💬 Built-in chat for coordinating swaps after approval
- 🔔 Real-time notifications using WebSocket and in-app dropdown
- 🗂️ Personalized product management with edit/delete/infinite scroll
- 👮 Admin panel for managing meeting locations
- 🕵️ Internal audit log system to track key user actions

---

## 🛠 Technologies

**Frontend:** React, TypeScript, Tailwind CSS, React Router, Socket.IO  
**Backend:** Node.js, Express, PostgreSQL, Socket.IO, JWT, Google & Facebook OAuth  
**AI & Tools:** ClipDrop API (for image understanding), Firebase (for image uploads and hosting only)

---

Set up a PostgreSQL database and configure the .env file

Run both frontend and backend using:
npm run dev
(the command `npm i` is required both frontend and backend)


🤖 About AI Usage
Swapify leverages AI-based image recognition (via the ClipDrop API) to help users fill in product details automatically based on uploaded images. This feature enhances the onboarding process and reduces friction in creating listings.

📄 License
MIT © 2025 Oriya
