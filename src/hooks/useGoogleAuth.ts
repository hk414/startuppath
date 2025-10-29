import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export const useGoogleAuth = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkGoogleConnection();
  }, []);

  const checkGoogleConnection = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.provider_token && session?.provider_refresh_token) {
      setGoogleAccessToken(session.provider_token);
      setIsGoogleConnected(true);
    }
  };

  const connectGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: `openid email profile ${GOOGLE_CALENDAR_SCOPE}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error('Error connecting to Google:', error);
      throw error;
    }

    return data;
  };

  return {
    isGoogleConnected,
    googleAccessToken,
    connectGoogle,
    checkGoogleConnection,
  };
};