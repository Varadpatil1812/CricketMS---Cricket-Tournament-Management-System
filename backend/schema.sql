CREATE DATABASE IF NOT EXISTS cricket_db;
USE cricket_db;

-- TABLE 1: users
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','player') NOT NULL DEFAULT 'player',
  player_role ENUM('batsman','bowler','all-rounder','wicket-keeper') DEFAULT NULL,
  team_id     INT DEFAULT NULL,
  is_captain  TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: teams
CREATE TABLE teams (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  captain_id  INT DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD CONSTRAINT fk_user_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE teams ADD CONSTRAINT fk_team_captain
  FOREIGN KEY (captain_id) REFERENCES users(id) ON DELETE SET NULL;

-- TABLE 3: tournaments
CREATE TABLE tournaments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  format     ENUM('League') NOT NULL DEFAULT 'League',
  team_ids   JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 4: matches  (runs/wickets/overs instead of single score)
CREATE TABLE matches (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id   INT NOT NULL,
  teamA_id        INT NOT NULL,
  teamB_id        INT NOT NULL,
  teamA_runs      INT DEFAULT NULL,
  teamA_wickets   INT DEFAULT NULL,
  teamA_overs     DECIMAL(4,1) DEFAULT NULL,
  teamB_runs      INT DEFAULT NULL,
  teamB_wickets   INT DEFAULT NULL,
  teamB_overs     DECIMAL(4,1) DEFAULT NULL,
  winner_id       INT DEFAULT NULL,
  status          ENUM('upcoming','completed','tie') NOT NULL DEFAULT 'upcoming',
  played_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (teamA_id)      REFERENCES teams(id),
  FOREIGN KEY (teamB_id)      REFERENCES teams(id),
  FOREIGN KEY (winner_id)     REFERENCES teams(id)
);

-- Default admin (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@cricket.com',
  '$2a$10$.GtLii1hi3KHF/LobD9VYepMqD3/OUGceANvAcEc1SDP46OG.fpRa', 'admin');