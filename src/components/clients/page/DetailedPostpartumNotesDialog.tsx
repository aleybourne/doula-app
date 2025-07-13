import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Baby, Save, FileText } from "lucide-react";
import { ClientData } from "../types/ClientTypes";
import { useToast } from "@/hooks/use-toast";

interface DetailedPostpartumNotesDialogProps {
  client: ClientData;
  onSave: (updatedClient: ClientData) => void;
  children: React.ReactNode;
}

interface FormData {
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
  
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
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
    setOpen(false);
    
    toast({
      title: "Notes Saved",
      description: "Detailed postpartum notes have been saved successfully.",
    });
  };

  const feedingMethodValue = watch('feedingMethod');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-green-600" />
            Detailed Postpartum & Birth Notes - {client.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Birth Stats Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
              <FileText className="h-4 w-4" />
              Birth Stats
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apgar1Min">APGAR 1 Min</Label>
                <Input
                  id="apgar1Min"
                  {...register('apgar1Min')}
                  placeholder="e.g., 8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apgar5Min">APGAR 5 Min</Label>
                <Input
                  id="apgar5Min"
                  {...register('apgar5Min')}
                  placeholder="e.g., 9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedBloodLoss">Estimated Blood Loss (EBL)</Label>
                <Input
                  id="estimatedBloodLoss"
                  {...register('estimatedBloodLoss')}
                  placeholder="e.g., 250ml"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="umbilicalCordCondition">Umbilical Cord Condition</Label>
                <Input
                  id="umbilicalCordCondition"
                  {...register('umbilicalCordCondition')}
                  placeholder="e.g., Normal, 3 vessels"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentalDeliveryPosition">Parental Delivery Position</Label>
                <Input
                  id="parentalDeliveryPosition"
                  {...register('parentalDeliveryPosition')}
                  placeholder="e.g., Semi-reclined, Side-lying"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="babyBirthPosition">Baby Birth Position</Label>
                <Input
                  id="babyBirthPosition"
                  {...register('babyBirthPosition')}
                  placeholder="e.g., Vertex, ROA"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Postpartum Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
              <FileText className="h-4 w-4" />
              Postpartum Notes
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postpartumNotes">General Postpartum Notes</Label>
              <Textarea
                id="postpartumNotes"
                {...register('postpartumNotes')}
                placeholder="General observations, recovery progress, any concerns..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Immediate Postpartum Care Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
              <FileText className="h-4 w-4" />
              Immediate Postpartum Care & Recommendations
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pericareNotes">Pericare + Physical Recovery Notes</Label>
              <Textarea
                id="pericareNotes"
                {...register('pericareNotes')}
                placeholder="Gently note any perineal tearing, sutures, or physical birth outcomes relevant to mom's healing journey..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediatePostpartumCare">Immediate Postpartum Care & Recommendations</Label>
              <Textarea
                id="immediatePostpartumCare"
                {...register('immediatePostpartumCare')}
                placeholder="Any support offered, postpartum procedures, or observations shared with the mother (e.g., skin-to-skin, latching, emotional state)..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Infant Care Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
              <Baby className="h-4 w-4" />
              Infant Care and Wellness
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedingMethod">Feeding Method</Label>
                <Select
                  value={feedingMethodValue}
                  onValueChange={(value) => setValue('feedingMethod', value as 'breast' | 'pump' | 'formula')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feeding method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breast">Breast</SelectItem>
                    <SelectItem value="pump">Pump</SelectItem>
                    <SelectItem value="formula">Formula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialFeedingTime">Initial Feeding Time</Label>
                <Input
                  id="initialFeedingTime"
                  {...register('initialFeedingTime')}
                  placeholder="e.g., 30 minutes after birth"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="latchQuality">Latch Quality / Concerns</Label>
              <Input
                id="latchQuality"
                {...register('latchQuality')}
                placeholder="e.g., Good latch, shallow latch, nipple shield used"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedingNotes">Feeding Notes</Label>
              <Textarea
                id="feedingNotes"
                {...register('feedingNotes')}
                placeholder="Additional feeding observations and notes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="babyBehaviorObservations">Observed Baby Cues or Behaviors</Label>
              <Textarea
                id="babyBehaviorObservations"
                {...register('babyBehaviorObservations')}
                placeholder="Alert periods, crying patterns, rooting, early feeding cues, bonding observations..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Detailed Notes
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};