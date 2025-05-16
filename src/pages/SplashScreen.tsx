
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
    <div 
      className="flex flex-col items-center justify-center min-h-screen" 
      style={{ backgroundColor: '#FFDEE2' }} // Soft pink background color
    >
      <div className="animate-fade-in flex flex-col items-center">
        <div 
          className="font-custom text-7xl"
          style={{ 
            color: '#9b87f5', // Primary purple
            WebkitTextStroke: '2px #7E69AB', // Secondary purple outline
            textShadow: '0px 0px 8px rgba(123, 97, 255, 0.2)'
          }}
        >
          Push
        </div>
        <div className="text-xl text-gray-600 mt-2">Your Birth Support Companion</div>
      </div>
    </div>
  );
};

export default SplashScreen;
