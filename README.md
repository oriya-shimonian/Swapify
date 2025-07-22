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

---

## 🤖 About AI Usage
Swapify includes a smart autofill feature to help users complete product details based on the product name only.

When a user enters the product name and clicks “Auto-fill”, the following process takes place:

Web search via SERP API – the product name is used to fetch relevant search snippets and pages from the internet (e.g., product listings, reviews, store descriptions).

Content analysis via OpenAI's GPT – the fetched data is then summarized and structured by a GPT model to extract relevant metadata such as:

Title

Description

Category

Subcategory

Extra fields based on product type (e.g., number of players for board games, author for books)

📌 Note: This process does not use image recognition and does not autofill images. The AI works solely based on the product name.

This feature reduces the effort required to fill in product forms and helps users list items more efficiently – especially for well-known games, books, and puzzles.

---

## 📄 License
MIT © 2025 Oriya
