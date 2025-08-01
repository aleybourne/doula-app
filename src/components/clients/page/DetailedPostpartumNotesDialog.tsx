import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Baby, Save, FileText, Edit, Eye } from "lucide-react";
import { ClientData } from "../types/ClientTypes";
import { useToast } from "@/hooks/use-toast";
import { BirthReportView } from "./BirthReportView";

interface DetailedPostpartumNotesDialogProps {
  client: ClientData;
  onSave: (updatedClient: ClientData) => void;
  children: React.ReactNode;
}

interface FormData {
  // Birth Info
  deliveryDate: string;
  deliveryWeight: string;
  deliveryLength: string;
  deliveryHeadCircumference: string;
  
  // Birth Stats
  apgar1Min: string;
  apgar5Min: string;
  estimatedBloodLoss: string;
  umbilicalCordCondition: string;
  parentalDeliveryPosition: string;
  babyBirthPosition: string;
  
  // Postpartum Notes
  postpartumNotes: string;
  
  // Immediate Postpartum Care
  pericareNotes: string;
  immediatePostpartumCare: string;
  
  // Infant Care
  feedingMethod: 'breast' | 'pump' | 'formula' | '';
  initialFeedingTime: string;
  latchQuality: string;
  feedingNotes: string;
  babyBehaviorObservations: string;
}

export const DetailedPostpartumNotesDialog: React.FC<DetailedPostpartumNotesDialogProps> = ({
  client,
  onSave,
  children
}) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'edit' | 'report'>('edit');
  
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      deliveryDate: client.deliveryDate || '',
      deliveryWeight: client.deliveryWeight || '',
      deliveryLength: client.deliveryLength || '',
      deliveryHeadCircumference: client.deliveryHeadCircumference || '',
      apgar1Min: client.apgar1Min || '',
      apgar5Min: client.apgar5Min || '',
      estimatedBloodLoss: client.estimatedBloodLoss || '',
      umbilicalCordCondition: client.umbilicalCordCondition || '',
      parentalDeliveryPosition: client.parentalDeliveryPosition || '',
      babyBirthPosition: client.babyBirthPosition || '',
      postpartumNotes: client.postpartumNotes || '',
      pericareNotes: client.pericareNotes || '',
      immediatePostpartumCare: client.immediatePostpartumCare || '',
      feedingMethod: client.feedingMethod || '',
      initialFeedingTime: client.initialFeedingTime || '',
      latchQuality: client.latchQuality || '',
      feedingNotes: client.feedingNotes || '',
      babyBehaviorObservations: client.babyBehaviorObservations || '',
    }
  });

  React.useEffect(() => {
    if (open) {
      reset({
        deliveryDate: client.deliveryDate || '',
        deliveryWeight: client.deliveryWeight || '',
        deliveryLength: client.deliveryLength || '',
        deliveryHeadCircumference: client.deliveryHeadCircumference || '',
        apgar1Min: client.apgar1Min || '',
        apgar5Min: client.apgar5Min || '',
        estimatedBloodLoss: client.estimatedBloodLoss || '',
        umbilicalCordCondition: client.umbilicalCordCondition || '',
        parentalDeliveryPosition: client.parentalDeliveryPosition || '',
        babyBirthPosition: client.babyBirthPosition || '',
        postpartumNotes: client.postpartumNotes || '',
        pericareNotes: client.pericareNotes || '',
        immediatePostpartumCare: client.immediatePostpartumCare || '',
        feedingMethod: client.feedingMethod || '',
        initialFeedingTime: client.initialFeedingTime || '',
        latchQuality: client.latchQuality || '',
        feedingNotes: client.feedingNotes || '',
        babyBehaviorObservations: client.babyBehaviorObservations || '',
      });
    }
  }, [open, client, reset]);

  const onSubmit = (data: FormData) => {
    const updatedClient: ClientData = {
      ...client,
      deliveryDate: data.deliveryDate,
      deliveryWeight: data.deliveryWeight,
      deliveryLength: data.deliveryLength,
      deliveryHeadCircumference: data.deliveryHeadCircumference,
      apgar1Min: data.apgar1Min,
      apgar5Min: data.apgar5Min,
      estimatedBloodLoss: data.estimatedBloodLoss,
      umbilicalCordCondition: data.umbilicalCordCondition,
      parentalDeliveryPosition: data.parentalDeliveryPosition,
      babyBirthPosition: data.babyBirthPosition,
      postpartumNotes: data.postpartumNotes,
      pericareNotes: data.pericareNotes,
      immediatePostpartumCare: data.immediatePostpartumCare,
      feedingMethod: data.feedingMethod as 'breast' | 'pump' | 'formula' | undefined,
      initialFeedingTime: data.initialFeedingTime,
      latchQuality: data.latchQuality,
      feedingNotes: data.feedingNotes,
      babyBehaviorObservations: data.babyBehaviorObservations,
    };

    onSave(updatedClient);
    
    toast({
      title: "Notes Saved",
      description: "Detailed postpartum notes have been saved successfully.",
    });
  };

  const handleSaveAndViewReport = (data: FormData) => {
    onSubmit(data);
    setViewMode('report');
  };

  const feedingMethodValue = watch('feedingMethod');

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
                <Baby className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="truncate">
                  {viewMode === 'edit' ? 'Detailed Birth Notes' : 'Birth Report'}
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
            <BirthReportView 
              client={client} 
              onEdit={() => setViewMode('edit')} 
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-6">
          {/* Delivery Information Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Delivery Information</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Basic delivery details and measurements</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="deliveryDate" className="text-xs sm:text-sm font-medium">Delivery Date & Time</Label>
                <Input
                  id="deliveryDate"
                  type="datetime-local"
                  {...register('deliveryDate')}
                  className="h-10 sm:h-11 text-sm"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="deliveryWeight" className="text-sm font-medium">Weight</Label>
                <Input
                  id="deliveryWeight"
                  {...register('deliveryWeight')}
                  placeholder="e.g., 7 lbs 8 oz"
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="deliveryLength" className="text-sm font-medium">Length</Label>
                <Input
                  id="deliveryLength"
                  {...register('deliveryLength')}
                  placeholder="e.g., 20 inches"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="deliveryHeadCircumference" className="text-sm font-medium">Head Circumference</Label>
                <Input
                  id="deliveryHeadCircumference"
                  {...register('deliveryHeadCircumference')}
                  placeholder="e.g., 14 inches"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Birth Stats Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Birth Stats</h3>
                <p className="text-sm text-muted-foreground">Birth-related measurements and observations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="apgar1Min" className="text-sm font-medium">APGAR 1 Min</Label>
                <Input
                  id="apgar1Min"
                  {...register('apgar1Min')}
                  placeholder="e.g., 8"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="apgar5Min" className="text-sm font-medium">APGAR 5 Min</Label>
                <Input
                  id="apgar5Min"
                  {...register('apgar5Min')}
                  placeholder="e.g., 9"
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="estimatedBloodLoss" className="text-sm font-medium">Estimated Blood Loss (EBL)</Label>
                <Input
                  id="estimatedBloodLoss"
                  {...register('estimatedBloodLoss')}
                  placeholder="e.g., 250ml"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="umbilicalCordCondition" className="text-sm font-medium">Umbilical Cord Condition</Label>
                <Input
                  id="umbilicalCordCondition"
                  {...register('umbilicalCordCondition')}
                  placeholder="e.g., Normal, 3 vessels"
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="parentalDeliveryPosition" className="text-sm font-medium">Parental Delivery Position</Label>
                <Input
                  id="parentalDeliveryPosition"
                  {...register('parentalDeliveryPosition')}
                  placeholder="e.g., Semi-reclined, Side-lying"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="babyBirthPosition" className="text-sm font-medium">Baby Birth Position</Label>
                <Input
                  id="babyBirthPosition"
                  {...register('babyBirthPosition')}
                  placeholder="e.g., Vertex, ROA"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Postpartum Notes Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Postpartum Notes</h3>
                <p className="text-sm text-muted-foreground">General recovery observations and notes</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="postpartumNotes" className="text-sm font-medium">General Postpartum Notes</Label>
              <Textarea
                id="postpartumNotes"
                {...register('postpartumNotes')}
                placeholder="General observations, recovery progress, any concerns..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Immediate Postpartum Care Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Immediate Postpartum Care & Recommendations</h3>
                <p className="text-sm text-muted-foreground">Immediate care provided and recovery recommendations</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="pericareNotes" className="text-sm font-medium">Pericare + Physical Recovery Notes</Label>
                <Textarea
                  id="pericareNotes"
                  {...register('pericareNotes')}
                  placeholder="Gently note any perineal tearing, sutures, or physical birth outcomes relevant to mom's healing journey..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="immediatePostpartumCare" className="text-sm font-medium">Immediate Postpartum Care & Recommendations</Label>
                <Textarea
                  id="immediatePostpartumCare"
                  {...register('immediatePostpartumCare')}
                  placeholder="Any support offered, postpartum procedures, or observations shared with the mother (e.g., skin-to-skin, latching, emotional state)..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Infant Care Section */}
          <div className="bg-card/30 rounded-xl border border-border/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Infant Care and Wellness</h3>
                <p className="text-sm text-muted-foreground">Feeding, behavior, and infant care observations</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="feedingMethod" className="text-sm font-medium">Feeding Method</Label>
                  <Select
                    value={feedingMethodValue}
                    onValueChange={(value) => setValue('feedingMethod', value as 'breast' | 'pump' | 'formula')}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select feeding method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breast">Breast</SelectItem>
                      <SelectItem value="pump">Pump</SelectItem>
                      <SelectItem value="formula">Formula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="initialFeedingTime" className="text-sm font-medium">Initial Feeding Time</Label>
                  <Input
                    id="initialFeedingTime"
                    {...register('initialFeedingTime')}
                    placeholder="e.g., 30 minutes after birth"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="latchQuality" className="text-sm font-medium">Latch Quality / Concerns</Label>
                <Input
                  id="latchQuality"
                  {...register('latchQuality')}
                  placeholder="e.g., Good latch, shallow latch, nipple shield used"
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="feedingNotes" className="text-sm font-medium">Feeding Notes</Label>
                <Textarea
                  id="feedingNotes"
                  {...register('feedingNotes')}
                  placeholder="Additional feeding observations and notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="babyBehaviorObservations" className="text-sm font-medium">Observed Baby Cues or Behaviors</Label>
                <Textarea
                  id="babyBehaviorObservations"
                  {...register('babyBehaviorObservations')}
                  placeholder="Alert periods, crying patterns, rooting, early feeding cues, bonding observations..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end border-t border-border pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto text-xs sm:text-sm h-10 sm:h-11"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="outline"
              className="w-full sm:w-auto gap-1 sm:gap-2 text-xs sm:text-sm h-10 sm:h-11"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              Save
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmit(handleSaveAndViewReport)}
              className="w-full sm:w-auto gap-1 sm:gap-2 text-xs sm:text-sm h-10 sm:h-11 bg-primary hover:bg-primary/90"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Save & View Report</span>
              <span className="sm:hidden">Save & View</span>
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};