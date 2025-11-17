# 🔄 Swapify
<p align="center">
  <img src="https://github.com/oriya-shimonian/Swapify/blob/frontend/public/logo-without%20bg.png?raw=true" width="200" alt="Swapify Logo" />
</p>


Swapify is a full-stack web platform for swapping puzzles, board games, and books. Built with a focus on simplicity, smart automation, and community-driven exchange, this project combines modern UI/UX, real-time collaboration, and AI-powered product onboarding.

# 📄 Project Overview

**Swapify** is a full-stack platform that enables users to swap puzzles, board games, and books with others in their area or community.

The platform addresses the growing need for organized item exchange communities, replacing unstructured WhatsApp groups and inefficient manual coordination.

---

### 👥 Target Audience

- Puzzle and board game enthusiasts
- Families with children who outgrow games or books
- Community organizers and local groups

---

### 🔍 Core Problems Solved

- Cluttered homes with unused games and books
- Limited access to variety due to high costs
- Lack of centralized, trusted exchange platforms

---

### 🧠 Our Approach

Swapify automates, simplifies, and enhances the exchange process with:
- Smart product onboarding using AI
- Real-time chat and notifications
- Clear and intuitive request management

# 🎯 Our Mission

At **Swapify**, our mission is to empower people to **swap smarter**, reduce waste, and **connect through shared interests**.

We believe that every puzzle, book, or game has the potential to bring joy to someone new — and that technology should make this transition simple and fun.

---

### 🌍 Values We Stand For

- 🔁 **Reuse before buy** – promoting circular use of entertainment
- 🤝 **Trust and community** – verified users and direct communication
- 🧩 **Simplicity first** – intuitive interfaces that require no manual

---

### 💡 Long-Term Vision

We aim to become a leading exchange platform for physical entertainment items, expand to other categories (e.g. toys, educational kits), and support more localized community-driven swaps.


# ✨ Key Features

Swapify combines rich functionality with a clean interface to deliver a seamless swapping experience.

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

### 📸 AI-powered Product Detection

- Uses ClipDrop API to recognize uploaded images
- Autofills fields like category, title, and description
- Saves time and improves listing accuracy

---

### 🔄 Swap Requests

- Send a request offering 1–4 products in exchange
- Accept or reject received offers
- Visual tracking of request status (Pending, Approved, Rejected)

---

### 💬 In-App Chat

- Real-time communication between matched users
- Designed for coordinating meeting details and confirming swaps

---

### 🔔 Real-Time Notifications

- Socket.IO-based alerts for new requests, approvals, and chat messages
- Unread count in navbar + notification dropdown

---

### 🗂️ Product Management

- Add, edit, delete listings
- Infinite scroll with filters by date, category, subcategory, and location

---

### 👮 Admin Tools

- Full CRUD management of meeting locations
- Internal audit log for traceability

---

Want to learn more? Go back to the [Home](./Home) page.


**Swapify** is a full-stack web platform designed for users to easily swap puzzles, board games, and books within their community. The project was built with a focus on user experience, modular architecture, and modern development practices.

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
