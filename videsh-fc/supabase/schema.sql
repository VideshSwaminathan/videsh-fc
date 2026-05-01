-- =============================================
-- Videsh FC — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILE TABLE (single row for player info)
-- =============================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Videsh',
  tagline TEXT DEFAULT 'Midfielder · Chennai',
  position TEXT DEFAULT 'Midfielder',
  club TEXT DEFAULT 'School XI',
  school TEXT DEFAULT 'Your School Name',
  jersey_number INTEGER DEFAULT 8,
  bio TEXT DEFAULT 'Passionate footballer from Chennai, playing as a central midfielder.',
  photo_url TEXT,
  city TEXT DEFAULT 'Chennai',
  born_year INTEGER DEFAULT 2011,
  started_year INTEGER DEFAULT 2020,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile row
INSERT INTO profile (name, position, club) VALUES ('Videsh', 'Midfielder', 'School XI')
ON CONFLICT DO NOTHING;

-- =============================================
-- MATCHES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  opponent TEXT NOT NULL,
  competition TEXT DEFAULT 'Friendly',
  venue TEXT DEFAULT 'Home',
  our_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  result TEXT CHECK (result IN ('W', 'D', 'L')) NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  key_passes INTEGER DEFAULT 0,
  rating NUMERIC(3,1) CHECK (rating >= 1 AND rating <= 10),
  minutes_played INTEGER DEFAULT 90,
  player_of_match BOOLEAN DEFAULT false,
  notes TEXT,
  season TEXT DEFAULT '2024-25',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRAINING SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  focus_area TEXT NOT NULL,
  intensity TEXT CHECK (intensity IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  drills TEXT DEFAULT '',
  notes TEXT,
  season TEXT DEFAULT '2024-25',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Trophy', 'Award', 'Personal Record', 'Milestone', 'Other')) DEFAULT 'Award',
  date DATE NOT NULL,
  emoji TEXT DEFAULT '🏆',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- HIGHLIGHTS (MEDIA) TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('video', 'photo')) DEFAULT 'video',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  date DATE NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) — Public can READ, nobody can write from client
-- Writes happen through API routes with service role key
-- =============================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read training" ON training_sessions FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read highlights" ON highlights FOR SELECT USING (true);

-- =============================================
-- SEED DATA — Sample records to start with
-- =============================================

INSERT INTO matches (date, opponent, competition, venue, our_score, opponent_score, result, goals, assists, key_passes, rating, minutes_played, player_of_match, season) VALUES
('2024-09-10', 'Greenfield Academy', 'School League', 'Home', 3, 1, 'W', 1, 2, 4, 8.5, 90, true, '2024-25'),
('2024-09-17', 'St. Johns FC', 'School League', 'Away', 1, 1, 'D', 0, 1, 3, 7.0, 90, false, '2024-25'),
('2024-09-24', 'Eagles United', 'District Cup', 'Home', 2, 0, 'W', 1, 0, 5, 8.0, 90, false, '2024-25'),
('2024-10-05', 'City Rovers', 'School League', 'Away', 4, 2, 'W', 2, 1, 6, 9.0, 90, true, '2024-25'),
('2024-10-15', 'Phoenix Boys', 'District Cup', 'Home', 0, 1, 'L', 0, 0, 2, 6.5, 90, false, '2024-25');

INSERT INTO achievements (title, description, category, date, emoji, featured) VALUES
('District Cup Champions', 'Won the district cup tournament — undefeated all the way', 'Trophy', '2024-03-15', '🏆', true),
('Player of the Tournament', 'Awarded best player of the inter-school tournament', 'Award', '2024-03-15', '⭐', true),
('10 Goals Milestone', 'Scored 10 career goals for the school team', 'Milestone', '2024-02-20', '⚽', false),
('Best Midfielder Award', 'Recognized as best midfielder in the school league', 'Award', '2024-01-10', '🎖️', true);

INSERT INTO training_sessions (date, duration_minutes, focus_area, intensity, drills, season) VALUES
('2024-10-18', 90, 'Passing', 'High', 'Short passes, Through balls, One-touch passing', '2024-25'),
('2024-10-16', 60, 'Dribbling', 'Medium', 'Cone drills, 1v1, Ball control', '2024-25'),
('2024-10-14', 75, 'Fitness', 'High', 'Sprints, Shuttle runs, Endurance laps', '2024-25'),
('2024-10-12', 90, 'Set Pieces', 'Medium', 'Free kicks, Corner kicks, Positioning', '2024-25'),
('2024-10-10', 60, 'Shooting', 'High', 'Long shots, Volleys, Finishing drills', '2024-25');
