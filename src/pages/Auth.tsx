
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import AuthDivider from '@/components/auth/AuthDivider';
import LoginForm from '@/components/auth/LoginForm';

type AuthMode = 'login' | 'signup';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { login, loginWithGoogle, signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    form.reset();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      navigate('/onboarding');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (mode === 'login') {
        await login(data.email, data.password);
        navigate('/onboarding');
      } else {
        await signup(data.email, data.password, data.firstName, data.lastName);
        navigate('/onboarding');
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to authenticate. Please check your credentials.',
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
          {mode === 'login' ? 'Welcome to Push' : 'Join Push'}
        </h1>

        <div className="space-y-6">
          <GoogleSignInButton 
            onClick={handleGoogleLogin} 
            isLoading={isSubmitting} 
          />

          <AuthDivider />

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
