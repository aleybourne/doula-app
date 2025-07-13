import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSelect } from '@/components/dashboard/TimeSelect';
import { TriageNote } from '../types/ClientTypes';

const triageNoteSchema = z.object({
  visitTime: z.string().min(1, 'Visit time is required'),
  location: z.string().min(1, 'Location is required'),
  cervicalExam: z.string(),
  contractionsPattern: z.string(),
  clientCoping: z.string(),
  doulaSupport: z.string(),
  outcome: z.enum(['sent-home', 'admitted', 'no-change', 'other']),
  additionalNotes: z.string(),
});

type TriageNoteFormData = z.infer<typeof triageNoteSchema>;

interface TriageNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (triageNote: TriageNote) => void;
  clientName?: string;
}

export const TriageNoteModal: React.FC<TriageNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientName = 'Client',
}) => {
  const form = useForm<TriageNoteFormData>({
    resolver: zodResolver(triageNoteSchema),
    defaultValues: {
      visitTime: '',
      location: '',
      cervicalExam: '',
      contractionsPattern: '',
      clientCoping: '',
      doulaSupport: '',
      outcome: 'sent-home',
      additionalNotes: '',
    },
  });

  const handleSubmit = (data: TriageNoteFormData) => {
    const triageNote: TriageNote = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      visitTime: data.visitTime,
      location: data.location,
      cervicalExam: data.cervicalExam,
      contractionsPattern: data.contractionsPattern,
      clientCoping: data.clientCoping,
      doulaSupport: data.doulaSupport,
      outcome: data.outcome,
      additionalNotes: data.additionalNotes,
    };
    onSave(triageNote);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Triage Note - {clientName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Triage Visit Time</FormLabel>
                    <FormControl>
                      <TimeSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Hospital, home, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cervicalExam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cervical Exam (Dilation / Effacement / Station)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 3cm / 50% / -2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractionsPattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractions Pattern</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe frequency, intensity, duration..."
                      className="min-h-[3rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientCoping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Coping / Mental State</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe client's emotional state, coping mechanisms..."
                      className="min-h-[3rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doulaSupport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doula Support Provided</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe support techniques, interventions provided..."
                      className="min-h-[3rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sent-home">Sent Home</SelectItem>
                      <SelectItem value="admitted">Admitted</SelectItem>
                      <SelectItem value="no-change">No Change</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Any additional observations or notes..."
                      className="min-h-[4rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Save Triage Note
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};