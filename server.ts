import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const db = new Database("twa.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    status TEXT DEFAULT 'active', -- 'active', 'completed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    nickname TEXT UNIQUE,
    email TEXT UNIQUE,
    phone TEXT,
    trading_platform TEXT,
    broker TEXT,
    account_number TEXT,
    league_tier TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trader_id TEXT UNIQUE,
    return_pct REAL,
    max_drawdown REAL,
    consistency_score REAL,
    total_trades INTEGER,
    risk_score REAL,
    overall_score REAL,
    votes INTEGER DEFAULT 0,
    season_id INTEGER,
    FOREIGN KEY(season_id) REFERENCES seasons(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trader_id TEXT,
    voter_email TEXT,
    amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Ensure nickname column exists in users table
const usersColumns = db.prepare("PRAGMA table_info(users)").all() as any[];
if (!usersColumns.some(col => col.name === 'nickname')) {
  try {
    console.log("Migrating: Adding nickname to users table...");
    db.exec("ALTER TABLE users ADD COLUMN nickname TEXT UNIQUE");
    console.log("Migration successful: nickname added to users.");
  } catch (e) {
    console.error("Migration failed for nickname:", e);
  }
}

// Migration: Ensure votes and season_id columns exist in leaderboard table
const leaderboardColumns = db.prepare("PRAGMA table_info(leaderboard)").all() as any[];
if (!leaderboardColumns.some(col => col.name === 'votes')) {
  try {
    console.log("Migrating: Adding votes to leaderboard table...");
    db.exec("ALTER TABLE leaderboard ADD COLUMN votes INTEGER DEFAULT 0");
    console.log("Migration successful: votes added to leaderboard.");
  } catch (e) {
    console.error("Migration failed for votes:", e);
  }
}
if (!leaderboardColumns.some(col => col.name === 'season_id')) {
  try {
    console.log("Migrating: Adding season_id to leaderboard table...");
    db.exec("ALTER TABLE leaderboard ADD COLUMN season_id INTEGER");
    console.log("Migration successful: season_id added to leaderboard.");
  } catch (e) {
    console.error("Migration failed for season_id:", e);
  }
}

// Seed initial season if empty
const seasonCount = db.prepare("SELECT COUNT(*) as count FROM seasons").get() as { count: number };
if (seasonCount.count === 0) {
  db.prepare("INSERT INTO seasons (name, status) VALUES (?, ?)").run("Season 1", "active");
}

const currentSeason = db.prepare("SELECT id FROM seasons WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").get() as { id: number };

// Seed some mock data if empty
const rowCount = db.prepare("SELECT COUNT(*) as count FROM leaderboard").get() as { count: number };
if (rowCount.count === 0 && currentSeason) {
  const insert = db.prepare(`
    INSERT INTO leaderboard (trader_id, return_pct, max_drawdown, consistency_score, total_trades, risk_score, overall_score, season_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const mockTraders = [
    ['AlphaTrader', 42.5, 4.2, 88, 124, 92, 94.2, currentSeason.id],
    ['BullRunner', 38.2, 3.8, 91, 98, 95, 92.8, currentSeason.id],
    ['MarketMaster', 35.1, 5.1, 85, 156, 88, 89.5, currentSeason.id],
    ['PipHunter', 31.8, 2.9, 94, 82, 97, 88.2, currentSeason.id],
    ['TrendSeeker', 28.4, 4.5, 82, 210, 84, 85.1, currentSeason.id],
  ];

  for (const trader of mockTraders) {
    insert.run(...trader);
  }
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });
  const PORT = 3000;
  const ADMIN_PASSWORD = "TWA-999";

  app.use(express.json());

  // API Routes
  app.get("/api/leaderboard", (req, res) => {
    const traders = db.prepare("SELECT * FROM leaderboard ORDER BY overall_score DESC").all();
    res.json(traders);
  });

  app.get("/api/seasons", (req, res) => {
    const seasons = db.prepare("SELECT * FROM seasons ORDER BY created_at DESC").all();
    res.json(seasons);
  });

  app.post("/api/register", (req, res) => {
    const { fullName, nickname, email, phone, platform, broker, accountNumber, tier } = req.body;
    try {
      const season = db.prepare("SELECT id FROM seasons WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").get() as { id: number };
      
      db.transaction(() => {
        const info = db.prepare(`
          INSERT INTO users (full_name, nickname, email, phone, trading_platform, broker, account_number, league_tier)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(fullName, nickname, email, phone, platform, broker, accountNumber, tier);

        // Also add to leaderboard with initial stats
        db.prepare(`
          INSERT INTO leaderboard (trader_id, return_pct, max_drawdown, consistency_score, total_trades, risk_score, overall_score, season_id)
          VALUES (?, 0, 0, 0, 0, 0, 0, ?)
        `).run(nickname, season.id);
      })();

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/vote", (req, res) => {
    const { trader_id, voter_email, amount } = req.body;
    try {
      db.transaction(() => {
        db.prepare("INSERT INTO votes (trader_id, voter_email, amount) VALUES (?, ?, ?)").run(trader_id, voter_email, amount);
        db.prepare("UPDATE leaderboard SET votes = votes + 1 WHERE trader_id = ?").run(trader_id);
      })();
      
      const updatedTraders = db.prepare("SELECT * FROM leaderboard ORDER BY overall_score DESC").all();
      io.emit("leaderboard_update", updatedTraders);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin API Routes
  app.post("/api/admin/login", (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.post("/api/admin/seasons/create", (req, res) => {
    const { name } = req.body;
    try {
      db.transaction(() => {
        db.prepare("UPDATE seasons SET status = 'completed' WHERE status = 'active'").run();
        db.prepare("INSERT INTO seasons (name, status) VALUES (?, 'active')").run(name);
      })();
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/admin/leaderboard/add", (req, res) => {
    const { trader_id, return_pct, max_drawdown, consistency_score, total_trades, risk_score, overall_score } = req.body;
    try {
      db.prepare(`
        INSERT INTO leaderboard (trader_id, return_pct, max_drawdown, consistency_score, total_trades, risk_score, overall_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(trader_id, return_pct, max_drawdown, consistency_score, total_trades, risk_score, overall_score);
      
      const updatedTraders = db.prepare("SELECT * FROM leaderboard ORDER BY overall_score DESC").all();
      io.emit("leaderboard_update", updatedTraders);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/leaderboard/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM leaderboard WHERE id = ?").run(req.params.id);
      const updatedTraders = db.prepare("SELECT * FROM leaderboard ORDER BY overall_score DESC").all();
      io.emit("leaderboard_update", updatedTraders);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Real-time simulation: Update a random trader every 5 seconds
  setInterval(() => {
    const traders = db.prepare("SELECT * FROM leaderboard").all() as any[];
    if (traders.length > 0) {
      const randomIdx = Math.floor(Math.random() * traders.length);
      const trader = traders[randomIdx];
      
      // Randomly fluctuate return and score
      const change = (Math.random() - 0.4) * 2; // -0.8 to +1.2
      const newReturn = Math.max(0, parseFloat((trader.return_pct + change).toFixed(2)));
      const newScore = Math.min(100, Math.max(0, parseFloat((trader.overall_score + change / 2).toFixed(2))));
      
      db.prepare("UPDATE leaderboard SET return_pct = ?, overall_score = ? WHERE id = ?")
        .run(newReturn, newScore, trader.id);
      
      const updatedTraders = db.prepare("SELECT * FROM leaderboard ORDER BY overall_score DESC").all();
      io.emit("leaderboard_update", updatedTraders);
    }
  }, 5000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
