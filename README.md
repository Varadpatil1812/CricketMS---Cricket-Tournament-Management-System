# 🏏 CricketMS — Cricket Tournament Management System

A full-stack web application for managing cricket tournaments, teams, players, fixtures, and scorecards. Built with **React + Vite** on the frontend and **Node.js + Express + MySQL** on the backend, with JWT-based role authentication and a dark-mode UI.

---

## 👥 Team

| Name | Role |
|------|------|
| **Omkar Masudage** | UI/UX Designer & Frontend Developer |
| **Omkar Pimpaldohkar** | Frontend Developer & API Integration |
| **Varad Patil** | FullStack Developer |

---

## ✨ Features

### 🔐 Role-Based Access
| Role | Access |
|------|--------|
| **Admin** | Full system control — manage teams, players, tournaments, fixtures, results |
| **Player** | Personal dashboard, own team matches, own tournament standings |
| **Viewer** | Public read-only — browse all teams, players, matches, points tables |

### 🏟️ Modules
- **Landing Page** — Hero, features showcase, team info, live cricket news drawer (Cricbuzz API)
- **Authentication** — JWT login/register, player selects batting/bowling role at signup
- **Team Management** — Create teams; captain auto-assigned when player is assigned
- **Player Management** — Search by name, view auto-filled details, assign as Player or Captain
- **Tournament Management** — Create League tournaments, assign teams, view participants
- **Fixture Generation** — Auto round-robin schedule (every team plays each other once)
- **Score Entry Modal** — Enter Runs / Wickets / Overs per team; winner decided automatically
- **Auto Winner Logic** — Higher runs wins → tie on runs: fewer wickets wins → else Tie
- **Points Table** — Dynamic calculation: Win = 2pts, Tie = 1pt, Loss = 0pts
- **Match History** — Filter by tournament, shows full scorecard
- **Player Dashboard** — Profile, team, win/loss/tie stats, win rate bar
- **My Matches** — Player sees only their team's matches (colour-coded Won/Lost/Tied)
- **My Tournaments** — Player sees only tournaments their team participates in, row highlighted
- **Viewer Mode** — Dedicated viewer layout with sidebar, overview stats, all public data

---

## 🛠️ Tech Stack

### Frontend
| Tech | Version |
|------|---------|
| React | 19 |
| Vite | 8 |
| React Bootstrap | 2.10 |
| Bootstrap | 5.3 |
| React Router DOM | 7 |
| Axios | 1.7 |

### Backend
| Tech | Version |
|------|---------|
| Node.js | 18+ |
| Express | 4.18 |
| MySQL2 | 3.9 |
| JWT (jsonwebtoken) | 9 |
| bcryptjs | 2.4 |
| dotenv | 16 |

---

## 🗄️ Database — 4 Tables Only

```sql
users        → id, name, email, password, role, player_role, team_id, is_captain
teams        → id, name, captain_id
tournaments  → id, name, format, team_ids (JSON)
matches      → id, tournament_id, teamA_id, teamB_id,
               teamA_runs, teamA_wickets, teamA_overs,
               teamB_runs, teamB_wickets, teamB_overs,
               winner_id, status
```

---

## 📁 Project Structure

```
CricketMS/
├── backend/
│   ├── src/
│   │   ├── config/         db.js
│   │   ├── controllers/    auth, team, player, tournament, match, points, dashboard
│   │   ├── middleware/     auth.js (verifyToken, isAdmin)
│   │   └── routes/         one router per module
│   ├── schema.sql
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            axios.js (auto JWT header)
    │   ├── assets/         team member photos, logo
    │   ├── components/     Navbar, Sidebar, Layout, ViewerLayout,
    │   │                   CricketNews
    │   ├── context/        AuthContext.jsx
    │   └── pages/
    │       ├── LandingPage, Login, Register
    │       ├── Teams, PlayersPublic, Tournaments, Matches
    │       ├── Dashboard, PlayerMatches, PlayerTournaments
    │       ├── ViewerOverview
    │       └── admin/      ManageTeams, AssignPlayers,
    │                       ManageTournaments, FixturesResults
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CricketMS.git
cd CricketMS
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cricket_db
DB_PORT=3306
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run the database schema:

```bash
mysql -u root -p < schema.sql
```

Start the server:

```bash
node src/server.js
```

Backend runs on → `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register as player (include `player_role`) |
| POST | `/api/auth/login` | Public | Login, receive JWT |

### Teams
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/teams` | Public | All teams |
| GET | `/api/teams/:id/players` | Public | Players in a team |
| POST | `/api/teams` | Admin | Create team |

### Players
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/players` | Admin | All players |
| GET | `/api/players/search?q=name` | Admin | Search player by name |
| PUT | `/api/players/:id/assign` | Admin | Assign to team as `captain` or `player` |

### Tournaments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tournaments` | Public | All tournaments |
| GET | `/api/tournaments/:id/teams` | Public | Teams in tournament |
| POST | `/api/tournaments` | Admin | Create tournament |
| POST | `/api/tournaments/:id/add-teams` | Admin | Assign teams |

### Matches
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/matches/history` | Public | Completed matches (optional `?tournament_id=`) |
| GET | `/api/matches/player-history` | Player | Own team matches (requires `?team_id=`) |
| GET | `/api/matches/tournament/:id` | Public | All matches in a tournament |
| POST | `/api/matches/generate/:id` | Admin | Generate round-robin fixtures |
| PUT | `/api/matches/:id/result` | Admin | Enter score — winner auto-decided |

### Points & Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/points/:tournamentId` | Public | Dynamic points table |
| GET | `/api/player/dashboard` | Player | Profile, team, stats |

---

## ⚡ Auto Winner Logic

When admin enters a match score (Runs / Wickets / Overs), the winner is decided **automatically** — no manual selection:

```
1. Higher runs          →  winner
2. Equal runs           →  fewer wickets lost wins
3. Equal runs & wickets →  TIE
```

Example:
```
MI:  185 / 4  (20.0 ov)   →  MI wins
CSK: 181 / 6  (20.0 ov)

MI:  150 / 3  (20.0 ov)   →  MI wins (fewer wickets)
CSK: 150 / 7  (20.0 ov)

MI:  165 / 5  (20.0 ov)   →  TIE
CSK: 165 / 5  (20.0 ov)
```

---

## 🗺️ Route Map

```
/                    Landing page
/viewer              Viewer overview (no login)
  /viewer/teams
  /viewer/players
  /viewer/matches
  /viewer/tournaments

/login               Login
/register            Register (choose playing role)

/teams               Public teams list
/players-pub         Public players by team
/tournaments         Public tournaments + points table
/matches             Public match history

/dashboard           Player: profile + stats          [player only]
/my-matches          Player: own team matches          [player only]
/my-tournaments      Player: own team tournaments      [player only]

/admin/teams         Create teams                      [admin only]
/admin/players       Assign players to teams           [admin only]
/admin/tournaments   Manage tournaments                [admin only]
/admin/fixtures      Generate fixtures + enter scores  [admin only]
```

---

## 🔄 Admin Workflow

```
1. Login as admin
2. Create Teams          →  /admin/teams
3. Assign Players        →  /admin/players  (search by name → assign as Player or Captain)
4. Create Tournament     →  /admin/tournaments
5. Add Teams to Tour     →  /admin/tournaments  (select teams)
6. Generate Fixtures     →  /admin/fixtures  (auto round-robin)
7. Enter Match Scores    →  /admin/fixtures  (Runs / Wickets / Overs → winner auto-decided)
8. View Points Table     →  /tournaments or /viewer/tournaments
```

---

## 🎨 UI Highlights

- **Dark mode** throughout — custom CSS variables, no flicker
- **Animations** — fade-up, slide-in, pop, stagger on all lists and cards
- **Score Modal** — styled like a cricket scoring app (two-column layout matching reference design)
- **Live winner preview** — updates in real-time as admin types scores
- **Player row highlight** — player's own team highlighted in points table
- **Viewer badge** — dedicated Viewer Mode layout with public sidebar
- **Cricket News drawer** — live headlines from Cricbuzz via RapidAPI (with fallback)
- **Rajdhani + Inter** fonts for that sports-app feel

---

## 📝 Environment Variables

```env
# Backend (.env)
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cricket_db
JWT_SECRET=
```

---

> 🏏 Built with ❤️ by Omkar Masudage, Omkar Pimpaldohkar & Varad Patil — CDAC Mumbai, 2026
