# 🎮 Game Backlog Tracker

A full-stack MERN application for tracking your video game backlog — add games, monitor progress, rate completed titles, and visualize your gaming habits with a built-in stats dashboard.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **Full CRUD** — add, edit, delete, and update games in your backlog
- **Search & filters** — search by title, filter by status and platform
- **Sorting** — sort by rating, hours played, or date added
- **Status tracking** — cycle games through Not Started → In Progress → Completed → Dropped
- **Automatic cover art** — game covers are fetched automatically via Steam's store search
- **Stats dashboard** — total games, hours played, completion rate, average rating, plus charts breaking down your backlog by status and platform
- **Multi-page routing** — Dashboard, Game List, and Add Game as separate views
- **Toast notifications** — instant feedback on every action
- **Dark, custom-themed UI** — built with Chakra UI v3 and a "cartridge shelf" design concept, where each game card's colored spine reflects its status

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Chakra UI v3
- React Router
- Recharts (stats visualizations)

**Backend**
- Node.js / Express
- MongoDB (Mongoose)

**External data**
- Steam Store Search API (cover art, no API key required)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 24 recommended)
- A MongoDB database — either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier, cloud-hosted, recommended), or
  - MongoDB running locally

### 1. Clone the repo
```bash
git clone https://github.com/Kaixhin09/game-backlog-tracker.git
cd game-backlog-tracker
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
In a new terminal:
```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`, connecting to the API at `http://localhost:5000`.

## 📁 Project Structure
game-backlog/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components (forms, modals, navbar, dashboard)
│   │   ├── pages/        # Route-level pages (Dashboard, Game List, Add Game)
│   │   ├── App.css        # CSS file
│   │   └── App.jsx        # Root component, routing, and shared state
│   └── index.html
├── server/                # Express backend
│   ├── models/            # Mongoose schemas
│   ├── routes/             # API route handlers
│   └── server.js            # Entry point
└── README.md

## 🔌 API Endpoints

| Method | Endpoint              | Description             |
|--------|------------------------|--------------------------|
| GET    | `/api/games`            | Get all games            |
| GET    | `/api/games/:id`        | Get a single game        |
| POST   | `/api/games`             | Add a new game            |
| PUT    | `/api/games/:id`        | Update a game              |
| DELETE | `/api/games/:id`         | Delete a game               |
| GET    | `/api/cover-search?title=`| Search for cover art via Steam |

## 📄 License

MIT
