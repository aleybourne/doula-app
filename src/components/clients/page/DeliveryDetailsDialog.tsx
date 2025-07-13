import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";

const deliveryDetailsSchema = z.object({
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  deliveryWeight: z.string().min(1, "Weight is required"),
  deliveryLength: z.string().min(1, "Length is required"),
  deliveryHeadCircumference: z.string().min(1, "Head circumference is required"),
});

type DeliveryDetailsFormData = z.infer<typeof deliveryDetailsSchema>;

interface DeliveryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeliveryDetailsFormData) => void;
  defaultDate?: string;
  defaultTime?: string;
}

const DeliveryDetailsDialog: React.FC<DeliveryDetailsDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultDate,
  defaultTime,
}) => {
  const form = useForm<DeliveryDetailsFormData>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: {
      deliveryDate: defaultDate || new Date().toISOString().split('T')[0], // Date only (YYYY-MM-DD)
      deliveryTime: defaultTime || new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }), // Time only (HH:MM)
      deliveryWeight: "",
      deliveryLength: "",
      deliveryHeadCircumference: "",
    },
  });

  const handleSubmit = (data: DeliveryDetailsFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-green-500" />
            Delivery Details
          </DialogTitle>
          <DialogDescription>
            Please enter the delivery details for this client.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (e.g., "7 lbs 3 oz" or "3.2 kg")</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter baby's weight"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (e.g., "20 inches" or "51 cm")</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter baby's length"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryHeadCircumference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Circumference (e.g., "14 inches" or "35.5 cm")</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter head circumference"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Delivery Details
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetailsDialog;