-- Create enums for mentor-mentee matching system (only if they don't exist)
DO $$ BEGIN
  CREATE TYPE public.expertise_area AS ENUM ('product', 'marketing', 'sales', 'fundraising', 'operations', 'tech', 'hr', 'legal', 'design');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.match_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.mentorship_status AS ENUM ('active', 'paused', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.session_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Mentor profiles table
CREATE TABLE public.mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  company TEXT,
  bio TEXT,
  expertise_areas expertise_area[] NOT NULL DEFAULT '{}',
  industries TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER,
  availability TEXT,
  timezone TEXT,
  linkedin_url TEXT,
  preferred_communication TEXT,
  max_mentees INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentee profiles table
CREATE TABLE public.mentee_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_name TEXT,
  startup_stage startup_stage NOT NULL,
  industry TEXT NOT NULL,
  goals TEXT[] NOT NULL DEFAULT '{}',
  challenges TEXT[] NOT NULL DEFAULT '{}',
  preferred_mentor_traits TEXT[] NOT NULL DEFAULT '{}',
  timezone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Match requests table
CREATE TABLE public.match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES public.mentee_profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentee_id, mentor_id)
);

-- Active matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES public.mentee_profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  status mentorship_status NOT NULL DEFAULT 'active',
  shared_goals TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentee_id, mentor_id)
);

-- Match messages table
CREATE TABLE public.match_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentorship sessions table
CREATE TABLE public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  notes TEXT,
  status session_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Session feedback table
CREATE TABLE public.session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.mentorship_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  continue_mentorship BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentor_profiles
CREATE POLICY "Mentor profiles are viewable by everyone"
  ON public.mentor_profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert their own mentor profile"
  ON public.mentor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentor profile"
  ON public.mentor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mentee_profiles
CREATE POLICY "Mentee profiles are viewable by mentors"
  ON public.mentee_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own mentee profile"
  ON public.mentee_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentee profile"
  ON public.mentee_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for match_requests
CREATE POLICY "Users can view their own match requests"
  ON public.match_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.mentee_profiles WHERE id = mentee_id
      UNION
      SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id
    )
  );

CREATE POLICY "Mentees can create match requests"
  ON public.match_requests FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.mentee_profiles WHERE id = mentee_id)
  );

CREATE POLICY "Mentors can update match request status"
  ON public.match_requests FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id)
  );

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.mentee_profiles WHERE id = mentee_id
      UNION
      SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id
    )
  );

CREATE POLICY "System can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Matched users can update match status"
  ON public.matches FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.mentee_profiles WHERE id = mentee_id
      UNION
      SELECT user_id FROM public.mentor_profiles WHERE id = mentor_id
    )
  );

-- RLS Policies for match_messages
CREATE POLICY "Matched users can view messages"
  ON public.match_messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE m.id = match_id
      UNION
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE m.id = match_id
    )
  );

CREATE POLICY "Matched users can send messages"
  ON public.match_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE m.id = match_id
      UNION
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE m.id = match_id
    )
  );

-- RLS Policies for mentorship_sessions
CREATE POLICY "Matched users can view sessions"
  ON public.mentorship_sessions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE m.id = match_id
      UNION
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE m.id = match_id
    )
  );

CREATE POLICY "Matched users can create sessions"
  ON public.mentorship_sessions FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE m.id = match_id
      UNION
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE m.id = match_id
    )
  );

CREATE POLICY "Matched users can update sessions"
  ON public.mentorship_sessions FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE m.id = match_id
      UNION
      SELECT mp.user_id FROM public.matches m
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE m.id = match_id
    )
  );

-- RLS Policies for session_feedback
CREATE POLICY "Users can view feedback for their sessions"
  ON public.session_feedback FOR SELECT
  USING (
    auth.uid() IN (
      SELECT mp.user_id FROM public.mentorship_sessions ms
      JOIN public.matches m ON ms.match_id = m.id
      JOIN public.mentee_profiles mp ON m.mentee_id = mp.id
      WHERE ms.id = session_id
      UNION
      SELECT mp.user_id FROM public.mentorship_sessions ms
      JOIN public.matches m ON ms.match_id = m.id
      JOIN public.mentor_profiles mp ON m.mentor_id = mp.id
      WHERE ms.id = session_id
    )
  );

CREATE POLICY "Users can create their own feedback"
  ON public.session_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentee_profiles_updated_at
  BEFORE UPDATE ON public.mentee_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_match_requests_updated_at
  BEFORE UPDATE ON public.match_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
  BEFORE UPDATE ON public.mentorship_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create match from accepted request
CREATE OR REPLACE FUNCTION public.create_match_from_request()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO public.matches (mentee_id, mentor_id, status)
    VALUES (NEW.mentee_id, NEW.mentor_id, 'active');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_match_request_accepted
  AFTER UPDATE ON public.match_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_match_from_request();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_messages;