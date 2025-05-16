
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowRight, Mail, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
        <h1 className="text-4xl font-bold text-center mb-8">
          {mode === 'login' ? 'Welcome Back' : 'Join Push'}
        </h1>

        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium flex items-center justify-center gap-3"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="********" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:underline"
              type="button"
            >
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
