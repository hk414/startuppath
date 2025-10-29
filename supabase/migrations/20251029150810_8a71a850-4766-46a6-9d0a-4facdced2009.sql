-- Add video_url column to match_requests table
ALTER TABLE public.match_requests
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add video introduction column to mentor and mentee profiles
ALTER TABLE public.mentor_profiles
ADD COLUMN IF NOT EXISTS intro_video_url TEXT;

ALTER TABLE public.mentee_profiles
ADD COLUMN IF NOT EXISTS intro_video_url TEXT;

-- Create storage bucket for introduction videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('intro-videos', 'intro-videos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for intro-videos bucket
CREATE POLICY "Users can upload their own intro videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'intro-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view intro videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'intro-videos');

CREATE POLICY "Users can update their own intro videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'intro-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own intro videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'intro-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);