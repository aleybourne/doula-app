import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Heart, Save, Plus, Edit, Eye } from "lucide-react";
import { ClientData, ActiveLaborNote, JournalEntry } from "../types/ClientTypes";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { ActiveLaborReportView } from "./ActiveLaborReportView";

// Form validation schema
const activeLaborFormSchema = z.object({
  admissionTime: z.string().optional(),
  hospitalLocation: z.string().optional(),
  cervicalExam: z.string().optional(),
  contractionPattern: z.string().optional(),
  clientEmotionalState: z.string().optional(),
  painManagement: z.array(z.string()).optional(),
  painManagementOther: z.string().optional(),
  clientMobility: z.string().optional(),
  supportOffered: z.string().optional(),
  staffInteractions: z.string().optional(),
  laborProgress: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof activeLaborFormSchema>;

interface ActiveLaborNotesDialogProps {
  client: ClientData;
  onSave: (updatedClient: ClientData) => void;
  children: React.ReactNode;
  existingNote?: ActiveLaborNote; // Add support for editing existing notes
}

export const ActiveLaborNotesDialog: React.FC<ActiveLaborNotesDialogProps> = ({
  client,
  onSave,
  children,
  existingNote
}) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'edit' | 'report'>('edit');
  
  const form = useForm<FormData>({
    resolver: zodResolver(activeLaborFormSchema),
    defaultValues: {
      admissionTime: existingNote?.admissionTime || "",
      hospitalLocation: existingNote?.hospitalLocation || "",
      cervicalExam: existingNote?.cervicalExam || "",
      contractionPattern: existingNote?.contractionPattern || "",
      clientEmotionalState: existingNote?.clientEmotionalState || "",
      painManagement: existingNote?.painManagement || [],
      painManagementOther: existingNote?.painManagementOther || "",
      clientMobility: existingNote?.clientMobility || "",
      supportOffered: existingNote?.supportOffered || "",
      staffInteractions: existingNote?.staffInteractions || "",
      laborProgress: existingNote?.laborProgress || "",
      additionalNotes: existingNote?.additionalNotes || "",
    }
  });

  // Reset form when dialog opens or existing note changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        admissionTime: existingNote?.admissionTime || "",
        hospitalLocation: existingNote?.hospitalLocation || "",
        cervicalExam: existingNote?.cervicalExam || "",
        contractionPattern: existingNote?.contractionPattern || "",
        clientEmotionalState: existingNote?.clientEmotionalState || "",
        painManagement: existingNote?.painManagement || [],
        painManagementOther: existingNote?.painManagementOther || "",
        clientMobility: existingNote?.clientMobility || "",
        supportOffered: existingNote?.supportOffered || "",
        staffInteractions: existingNote?.staffInteractions || "",
        laborProgress: existingNote?.laborProgress || "",
        additionalNotes: existingNote?.additionalNotes || "",
      });
    }
  }, [open, existingNote, form]);

  const painManagementValues = form.watch('painManagement') || [];

  const formatActiveNotesReport = (data: FormData): string => {
    return `
## Active Labor Notes – ${data.admissionTime}

**Admission Details:**
- **Admitted to L&D:** ${data.admissionTime}
- **Location:** ${data.hospitalLocation}
- **Cervical Exam:** ${data.cervicalExam}

**Labor Progress:**
- **Contraction Pattern:** ${data.contractionPattern}
- **Pain Management:** ${data.painManagement.map(pm => pm === 'other' && data.painManagementOther ? `Other - ${data.painManagementOther}` : pm.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}

**Client Care:**
- **Emotional State:** ${data.clientEmotionalState}
- **Mobility & Positions:** ${data.clientMobility}
- **Support Offered:** ${data.supportOffered}

**Progress Over Time:**
${data.laborProgress}

${data.staffInteractions ? `**Staff Interactions:**\n${data.staffInteractions}\n` : ''}

${data.additionalNotes ? `**Additional Notes:**\n${data.additionalNotes}` : ''}

---
*Note created on ${new Date().toLocaleString()}*
    `.trim();
  };

  const onSubmit = (data: FormData) => {
    const timestamp = new Date().toISOString();
    
    // Create or update active labor note
    const activeLaborNote: ActiveLaborNote = {
      id: existingNote?.id || uuidv4(),
      timestamp: existingNote?.timestamp || timestamp,
      admissionTime: data.admissionTime || "",
      hospitalLocation: data.hospitalLocation || "",
      cervicalExam: data.cervicalExam || "",
      contractionPattern: data.contractionPattern || "",
      clientEmotionalState: data.clientEmotionalState || "",
      painManagement: data.painManagement || [],
      painManagementOther: data.painManagementOther || "",
      clientMobility: data.clientMobility || "",
      supportOffered: data.supportOffered || "",
      staffInteractions: data.staffInteractions || "",
      laborProgress: data.laborProgress || "",
      additionalNotes: data.additionalNotes || "",
    };

    // Update or create journal entry
    const journalTitle = `Active Labor Notes – ${data.admissionTime || 'Update'}`;
    const journalEntry: JournalEntry = {
      id: uuidv4(),
      title: journalTitle,
      content: formatActiveNotesReport(data),
      timestamp,
      isPinned: false,
      category: "Labor & Birth",
    };

    // Update client with data
    let updatedActiveLaborNotes: ActiveLaborNote[];
    if (existingNote) {
      // Update existing note
      updatedActiveLaborNotes = (client.activeLaborNotes || []).map(note =>
        note.id === existingNote.id ? activeLaborNote : note
      );
    } else {
      // Add new note
      updatedActiveLaborNotes = [...(client.activeLaborNotes || []), activeLaborNote];
    }

    const updatedClient: ClientData = {
      ...client,
      activeLaborNotes: updatedActiveLaborNotes,
      journalEntries: [journalEntry, ...(client.journalEntries || [])],
    };

    onSave(updatedClient);
    
    toast({
      title: existingNote ? "Active Labor Notes Updated" : "Active Labor Notes Saved",
      description: `Notes have been ${existingNote ? 'updated' : 'saved'} and added to the journal.`,
    });

    if (!existingNote) {
      form.reset();
      setOpen(false);
    }
  };

  const handleSaveAndViewReport = (data: FormData) => {
    onSubmit(data);
    setViewMode('report');
  };

  // Get the most recent active labor note for the report view
  const latestActiveLaborNote = client.activeLaborNotes && client.activeLaborNotes.length > 0 
    ? client.activeLaborNotes[client.activeLaborNotes.length - 1]
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto h-[90vh] max-h-[90vh] overflow-y-auto box-border">
        <DialogHeader className="pb-3 sm:pb-4 border-b space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary flex items-center gap-2 break-words">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="truncate">
                  {viewMode === 'edit' ? 'Active Labor Notes' : 'Active Labor Report'}
                </span>
              </DialogTitle>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('edit')}
                className="gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                Edit
              </Button>
              <Button
                variant={viewMode === 'report' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('report')}
                className="gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                Report
              </Button>
            </div>
          </div>
        </DialogHeader>

        {viewMode === 'report' ? (
          <div className="py-3 sm:py-6 px-1">
            {latestActiveLaborNote ? (
              <ActiveLaborReportView 
                client={client} 
                activeLaborNote={latestActiveLaborNote}
                onEdit={() => setViewMode('edit')} 
              />
            ) : (
              <div className="text-center py-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl border border-primary/20">
                <Heart className="h-12 w-12 text-primary/60 mx-auto" />
                <div className="space-y-2 px-4">
                  <h3 className="text-lg font-semibold text-primary">No Active Labor Notes</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">Start documenting labor progress to generate your comprehensive active labor report.</p>
                </div>
                <Button onClick={() => setViewMode('edit')} size="sm" className="mt-4 bg-primary hover:bg-primary/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Add Labor Notes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-6">
          {/* Admission Information Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Admission Information</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Initial assessment and location details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="admissionTime" className="text-xs sm:text-sm font-medium">Admitted to L&D</Label>
                <Input
                  id="admissionTime"
                  type="time"
                  {...form.register('admissionTime')}
                  className="h-10 sm:h-11 text-sm"
                />
                {form.formState.errors.admissionTime && (
                  <p className="text-sm text-destructive">{form.formState.errors.admissionTime.message}</p>
                )}
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="hospitalLocation" className="text-xs sm:text-sm font-medium">Hospital / Birth Location</Label>
                <Input
                  id="hospitalLocation"
                  {...form.register('hospitalLocation')}
                  placeholder="e.g., City Hospital, Home Birth"
                  className="h-10 sm:h-11 text-sm"
                />
                {form.formState.errors.hospitalLocation && (
                  <p className="text-sm text-destructive">{form.formState.errors.hospitalLocation.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3 sm:col-span-2">
                <Label htmlFor="cervicalExam" className="text-xs sm:text-sm font-medium">Dilation / Effacement / Station</Label>
                <Input
                  id="cervicalExam"
                  {...form.register('cervicalExam')}
                  placeholder="e.g., 4cm / 90% / -2"
                  className="h-10 sm:h-11 text-sm"
                />
                {form.formState.errors.cervicalExam && (
                  <p className="text-sm text-destructive">{form.formState.errors.cervicalExam.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Labor Progress Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Labor Progress</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Contraction patterns and pain management</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="contractionPattern" className="text-xs sm:text-sm font-medium">Contraction Pattern</Label>
                <Textarea
                  id="contractionPattern"
                  {...form.register('contractionPattern')}
                  placeholder="e.g., Every 3 minutes, lasting 60 seconds"
                  rows={3}
                  className="resize-none text-sm"
                />
                {form.formState.errors.contractionPattern && (
                  <p className="text-sm text-destructive">{form.formState.errors.contractionPattern.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-medium">Pain Management</Label>
                  <div className="space-y-3 border border-input rounded-lg p-3 bg-background/50">
                    {[
                      { value: 'unmedicated', label: 'Unmedicated' },
                      { value: 'iv-meds', label: 'IV Meds' },
                      { value: 'epidural', label: 'Epidural' },
                      { value: 'nitrous-oxide', label: 'Nitrous Oxide' },
                      { value: 'other', label: 'Other' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pain-${option.value}`}
                          checked={painManagementValues.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const current = painManagementValues;
                            if (checked) {
                              form.setValue('painManagement', [...current, option.value]);
                            } else {
                              form.setValue('painManagement', current.filter(v => v !== option.value));
                            }
                          }}
                        />
                        <Label htmlFor={`pain-${option.value}`} className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.painManagement && (
                    <p className="text-sm text-destructive">{form.formState.errors.painManagement.message}</p>
                  )}
                </div>

                {painManagementValues.includes('other') && (
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="painManagementOther" className="text-xs sm:text-sm font-medium">Other Pain Management</Label>
                    <Input
                      id="painManagementOther"
                      {...form.register('painManagementOther')}
                      placeholder="Specify other pain management"
                      className="h-10 sm:h-11 text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="laborProgress" className="text-xs sm:text-sm font-medium">Labor Progress Over Time</Label>
                <Textarea
                  id="laborProgress"
                  {...form.register('laborProgress')}
                  placeholder="Track changes in dilation, coping, or emotional tone over time"
                  rows={4}
                  className="resize-none text-sm"
                />
                {form.formState.errors.laborProgress && (
                  <p className="text-sm text-destructive">{form.formState.errors.laborProgress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client Care Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Client Care & Support</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Emotional support and physical care provided</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="clientEmotionalState" className="text-xs sm:text-sm font-medium">Client Emotional State</Label>
                <Textarea
                  id="clientEmotionalState"
                  {...form.register('clientEmotionalState')}
                  placeholder="How was the client coping emotionally and mentally?"
                  rows={3}
                  className="resize-none text-sm"
                />
                {form.formState.errors.clientEmotionalState && (
                  <p className="text-sm text-destructive">{form.formState.errors.clientEmotionalState.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="clientMobility" className="text-xs sm:text-sm font-medium">Client Mobility + Positions Used</Label>
                <Textarea
                  id="clientMobility"
                  {...form.register('clientMobility')}
                  placeholder="Any movements, rebozo, peanut ball, or position changes?"
                  rows={3}
                  className="resize-none text-sm"
                />
                {form.formState.errors.clientMobility && (
                  <p className="text-sm text-destructive">{form.formState.errors.clientMobility.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="supportOffered" className="text-xs sm:text-sm font-medium">Support Offered</Label>
                <Textarea
                  id="supportOffered"
                  {...form.register('supportOffered')}
                  placeholder="Describe doula actions, tools used, affirmations, etc."
                  rows={3}
                  className="resize-none text-sm"
                />
                {form.formState.errors.supportOffered && (
                  <p className="text-sm text-destructive">{form.formState.errors.supportOffered.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Additional Information</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Staff interactions and other observations</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="staffInteractions" className="text-xs sm:text-sm font-medium">Staff Interactions / Notable Events</Label>
                <Textarea
                  id="staffInteractions"
                  {...form.register('staffInteractions')}
                  placeholder="Any notable interactions with hospital staff or medical changes (optional)"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="additionalNotes" className="text-xs sm:text-sm font-medium">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  {...form.register('additionalNotes')}
                  placeholder="Any other observations or notes (optional)"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-none gap-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit(handleSaveAndViewReport)}
              className="flex-1 sm:flex-none gap-2"
            >
              <Eye className="h-4 w-4" />
              Save & View Report
            </Button>
            <Button
              type="submit"
              className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {existingNote ? 'Update' : 'Save'} Labor Notes
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};