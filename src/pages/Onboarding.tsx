
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      location: '',
      experience: '',
      specialties: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await updateUserProfile({
        ...data,
        profileComplete: true,
      });
      
      toast({
        title: 'Profile Complete',
        description: 'Your profile has been saved successfully!',
      });

      // Navigate to home after successful submission
      navigate('/home');
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6 pt-16">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Ovella!</h1>
        <p className="text-gray-600 mb-8">Let's set up your doula profile</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City, State" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 3" type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties (comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Prenatal, Postpartum" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              Complete Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
