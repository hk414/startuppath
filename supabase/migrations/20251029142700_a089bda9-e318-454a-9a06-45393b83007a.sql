-- Create enum for startup stages
CREATE TYPE public.startup_stage AS ENUM (
  'idea',
  'validation',
  'building',
  'testing',
  'launch',
  'growth',
  'scaling'
);

-- Create journey timeline table
CREATE TABLE public.journey_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage startup_stage NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journey_timeline ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own journey"
ON public.journey_timeline
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey entries"
ON public.journey_timeline
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey entries"
ON public.journey_timeline
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey entries"
ON public.journey_timeline
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_journey_timeline_updated_at
BEFORE UPDATE ON public.journey_timeline
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a table to track current stage
CREATE TABLE public.user_current_stage (
  user_id UUID PRIMARY KEY,
  current_stage startup_stage NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on current stage table
ALTER TABLE public.user_current_stage ENABLE ROW LEVEL SECURITY;

-- Create policies for current stage
CREATE POLICY "Users can view their own current stage"
ON public.user_current_stage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own current stage"
ON public.user_current_stage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own current stage"
ON public.user_current_stage
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for timestamp updates
CREATE TRIGGER update_user_current_stage_updated_at
BEFORE UPDATE ON public.user_current_stage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();