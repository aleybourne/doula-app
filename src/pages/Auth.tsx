
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import LoginForm from '@/components/auth/LoginForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AuthMode = 'login' | 'signup';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      if (!user.profileComplete) {
        navigate('/onboarding');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setAuthError(null);
    form.reset();
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      if (mode === 'login') {
        await login(data.email, data.password);
        // Navigation will be handled by useEffect after user state updates
      } else {
        await signup(data.email, data.password, data.firstName, data.lastName);
        // Navigation will be handled by useEffect after user state updates
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = error?.message || 'Authentication failed. Please check your credentials.';
      setAuthError(errorMessage);
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-6 pt-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-custom text-center mb-8">
          {mode === 'login' ? 'Welcome to Ovella' : 'Join Ovella'}
        </h1>

        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {authError}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <LoginForm 
            form={form}
            onSubmit={onSubmit}
            mode={mode}
            isSubmitting={isSubmitting}
            toggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
