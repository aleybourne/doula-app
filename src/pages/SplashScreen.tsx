import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Wait for splash screen animation and auth state to load
    const timeout = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          // If user exists but profile is not complete, go to onboarding
          if (!user.profileComplete) {
            navigate('/onboarding');
          } else {
            // Otherwise go to main app
            navigate('/home');
          }
        } else {
          // If no user, go to auth screen
          navigate('/auth');
        }
      }
    }, 2000); // 2 seconds delay for splash screen

    return () => clearTimeout(timeout);
  }, [navigate, user, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-fade-in flex flex-col items-center">
        <div className="text-7xl font-bold text-blue-600 mb-4">Push</div>
        <div className="text-xl text-gray-600">Your Birth Support Companion</div>
      </div>
    </div>
  );
};

export default SplashScreen;
