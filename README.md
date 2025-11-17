<p align="center"> <img src="https://github.com/oriya-shimonian/Swapify/blob/frontend/public/logo-without%20bg.png?raw=true" width="200" alt="Swapify Logo" /> </p> <h1 align="center">🧩 Swapify — Swap Smarter. Play More.</h1> <p align="center"> 🔗 <strong>Live Demo:</strong> <a href="https://swapify-6f271.web.app/" target="_blank">https://swapify-6f271.web.app/</a> </p>

# 🧩 Swapify — Swap Smarter. Play More.

**Swapify** is a full-stack web platform that enables users to **swap puzzles, board games, and books** within their community.
The platform replaces unstructured WhatsApp groups and manual coordination with a **smart, organized, and user-friendly experience**.

---

## 📄 Project Overview

Swapify was built to solve the growing need for a **centralized and trusted exchange system** for physical entertainment items.

Today, many communities rely on chaotic message groups and inefficient manual logistics.
Swapify simplifies this process through automation, clear workflows, and real-time communication.

---

## 🎯 Mission

To help people **swap smarter**, reduce waste, and **connect through shared interests** — turning unused items into new experiences.

We believe every puzzle, book, or game deserves a second life, and technology should make that transition effortless and enjoyable.

---

## 👥 Target Audience

* Puzzle & board game enthusiasts
* Families with children who outgrow books or games
* Community organizers & local swap groups
* Sustainable-living and minimalism communities

---

## 🔍 Core Problems We Solve

| Without Swapify             | With Swapify                            |
| --------------------------- | --------------------------------------- |
| Disorganized WhatsApp posts | Structured swap request system          |
| Hard to find relevant items | Advanced search & filtering             |
| Manual coordination chaos   | Built-in chat & real-time notifications |
| High costs of new games     | Free exchanges with neighbors           |

---

## 🌍 Values We Stand For

* 🔁 **Reuse before buy** – encouraging circular use
* 🤝 **Community & trust** – verified users & transparent requests
* 🧩 **Simplicity first** – intuitive UI that works without tutorials

---

## 💡 Long-Term Vision

Expand beyond games & books into:

* Toys
* Educational kits & hobby gear
* Community swap events & local pickup hubs

---

# ✨ Key Features

### 🔍 Powerful Search & Filtering

Search products by category, subcategory, location, date range, availability, and keyword — with infinite scrolling.

### 🧠 AI-Assisted Product Onboarding

* Autofills details from product **name only**
* Uses SERP API for search + GPT for structured summarization
* Extracts metadata like title, description, category, author, number of players, etc.

> *Note: AI does not upload or detect images — based only on text and search results.*

### 🔄 Smart Swap Request System

* Offer **1–4 products** for a swap
* Approve or reject offers
* Clear status flow (Pending / Approved / Rejected)
* Automatic rejection if items become unavailable

### 💬 Built-In Real-Time Chat

Coordinate meeting details immediately after request approval.

### 🔔 Real-Time Notifications

* WebSocket-based updates
* Notification bell + unread counter + dropdown preview

### 🗂️ Product Management

Add, edit, delete & filter personal listings with smooth infinite scroll.

### 👮 Admin Tools

* CRUD for meeting location suggestions
* Internal audit log for monitoring critical user actions

---

# 🤖 How AI Is Used

When a user clicks **Auto-Fill** after entering a product name:

1. Search runs via SERP API
2. Relevant public data is collected
3. GPT processes & structures the extracted information
4. The form auto-completes fields such as:

   * Title
   * Description
   * Category & subcategory
   * Extra type-specific fields (e.g., author, player count)

This significantly reduces the time and cognitive effort needed to add new items.

---

# 🛠 Technologies

### Frontend

React • TypeScript • Tailwind CSS • React Router • Socket.IO

### Backend

Node.js • Express • PostgreSQL • JWT • Socket.IO
Google & Facebook OAuth

### Tools & Services

ClipDrop API • SerpAPI • OpenAI GPT • Firebase Hosting & Storage

---

🌐 Try Swapify Live

🔗 Live Demo:
https://swapify-6f271.web.app/

No installation needed — sign up with Google/Facebook or email and start swapping.

---

# 💻 Running Locally

```bash
# Install dependencies
npm i          # Run in both frontend and backend folders

# Start development
npm run dev
```

Configure PostgreSQL credentials in `.env` before running.

---



# 📄 License

MIT © 2025 Oriya Shimonian

--- 
