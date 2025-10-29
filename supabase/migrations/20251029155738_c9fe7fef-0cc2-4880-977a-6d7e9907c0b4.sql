-- Create enums for challenge system
CREATE TYPE challenge_type AS ENUM ('idea_generator', 'problem_solver', 'startup_simulation');
CREATE TYPE user_level AS ENUM ('seed', 'growth', 'unicorn');

-- Table to track user challenge stats
CREATE TABLE user_challenge_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  level user_level DEFAULT 'seed' NOT NULL,
  challenges_completed INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table to store challenge attempts
CREATE TABLE challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_type challenge_type NOT NULL,
  xp_earned INTEGER NOT NULL,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table for weekly scenarios
CREATE TABLE problem_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL,
  week_starting DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE user_challenge_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_challenge_stats
CREATE POLICY "Users can view all stats for leaderboard"
  ON user_challenge_stats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own stats"
  ON user_challenge_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_challenge_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for challenge_attempts
CREATE POLICY "Users can view their own attempts"
  ON challenge_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts"
  ON challenge_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for problem_scenarios
CREATE POLICY "Anyone can view scenarios"
  ON problem_scenarios FOR SELECT
  TO authenticated
  USING (true);

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_xp >= 500 THEN
    NEW.level = 'unicorn';
  ELSIF NEW.total_xp >= 200 THEN
    NEW.level = 'growth';
  ELSE
    NEW.level = 'seed';
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_level
  BEFORE INSERT OR UPDATE OF total_xp ON user_challenge_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

CREATE TRIGGER update_challenge_stats_updated_at
  BEFORE UPDATE ON user_challenge_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample scenarios
INSERT INTO problem_scenarios (problem_text, options, correct_option_index, week_starting) VALUES
(
  'Your app''s user retention is dropping. What would you do?',
  '[
    {"text": "Lower the price to attract more users", "explanation": "While this may attract new users, it doesn''t address why existing users are leaving. You need to understand the root cause first."},
    {"text": "Add more features quickly", "explanation": "Adding features without understanding user needs can make the app more complex and worsen retention. Focus on what users actually want."},
    {"text": "Talk to churned users and analyze their behavior", "explanation": "Correct! Understanding why users leave is crucial. Use surveys, interviews, and analytics to identify pain points before making changes."},
    {"text": "Invest heavily in marketing", "explanation": "Marketing brings new users but won''t fix retention issues. First solve why users are leaving, then scale acquisition."}
  ]'::jsonb,
  2,
  DATE_TRUNC('week', CURRENT_DATE)
),
(
  'You have limited budget. What should you prioritize?',
  '[
    {"text": "Spend everything on advertising", "explanation": "All-in on ads is risky. Without product-market fit or retention, you''re burning money acquiring users who won''t stay."},
    {"text": "Build a minimum viable product first", "explanation": "Correct! Start lean, validate your assumptions, and iterate based on real user feedback. This conserves resources while learning."},
    {"text": "Hire a large team immediately", "explanation": "A big team early on creates overhead and communication challenges. Start small, prove the concept, then scale the team."},
    {"text": "Perfect the product before launch", "explanation": "Perfectionism delays learning. Ship early, get feedback, and improve iteratively rather than building in isolation."}
  ]'::jsonb,
  1,
  DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week'
);