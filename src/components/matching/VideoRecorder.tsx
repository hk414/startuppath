import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Video, Square, Play, Trash2, Upload, Loader2 } from "lucide-react";
import RecordRTC from "recordrtc";
import { supabase } from "@/integrations/supabase/client";

interface VideoRecorderProps {
  onVideoUploaded: (videoUrl: string) => void;
  maxDuration?: number; // in seconds
}

export const VideoRecorder = ({ onVideoUploaded, maxDuration = 60 }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (recorderRef.current) {
      recorderRef.current.destroy();
      recorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      const recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          setProgress((newTime / maxDuration) * 100);
          
          // Auto-stop at max duration
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        setRecordedBlob(blob);
        setIsRecording(false);
        setIsPreviewing(true);

        // Set preview video
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.muted = false;
        }

        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      });
    }
  };

  const deleteRecording = () => {
    setRecordedBlob(null);
    setIsPreviewing(false);
    setRecordingTime(0);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${Date.now()}.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from('intro-videos')
        .upload(fileName, recordedBlob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('intro-videos')
        .getPublicUrl(fileName);

      onVideoUploaded(publicUrl);
      
      toast({
        title: "Video Uploaded! 🎥",
        description: "Your introduction video has been saved.",
      });

      deleteRecording();
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-gradient-hero/5 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Video className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Video Introduction</h3>
            <p className="text-sm text-muted-foreground">
              Record a {maxDuration}s intro to showcase your personality
            </p>
          </div>
        </div>

        <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {!isRecording && !isPreviewing && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center space-y-2">
                <Video className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Start recording to introduce yourself
                </p>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="absolute top-4 left-4 right-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-white">
                <span className="flex items-center gap-2 bg-destructive px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Recording
                </span>
                <span className="bg-black/50 px-3 py-1 rounded-full">
                  {formatTime(recordingTime)} / {formatTime(maxDuration)}
                </span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isRecording && !isPreviewing && (
            <Button onClick={startRecording} className="flex-1 gap-2">
              <Video className="w-4 h-4" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" className="flex-1 gap-2">
              <Square className="w-4 h-4" />
              Stop Recording
            </Button>
          )}

          {isPreviewing && !isRecording && (
            <>
              <Button onClick={() => videoRef.current?.play()} variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                Preview
              </Button>
              <Button onClick={deleteRecording} variant="outline" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button 
                onClick={uploadVideo} 
                disabled={isUploading}
                className="flex-1 gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Use This Video
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          💡 Tip: Introduce yourself, explain your background, and share why you're excited about this connection!
        </p>
      </div>
    </Card>
  );
};
