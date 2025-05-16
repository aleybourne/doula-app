
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface LoginFormProps {
  form: UseFormReturn<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>;
  onSubmit: (data: any) => Promise<void>;
  mode: 'login' | 'signup';
  isSubmitting: boolean;
  toggleMode: () => void;
}

const LoginForm = ({ form, onSubmit, mode, isSubmitting, toggleMode }: LoginFormProps) => {
  return (
    <>
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
    </>
  );
};

export default LoginForm;
