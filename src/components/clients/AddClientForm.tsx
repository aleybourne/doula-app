
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "./ImageUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PregnancyDetailsSection } from "./form-sections/PregnancyDetailsSection";
import { AdminSection } from "./form-sections/AdminSection";
import { BirthType, ClientStatus, PaymentStatus } from "./types/ClientTypes";
import { addClient } from "./store/clientActions";
import { Loader2 } from "lucide-react";

const phoneRegex = /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  preferredName: z.string().optional(),
  pronouns: z.string(),
  phone: z.string().regex(phoneRegex, "Invalid phone number").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  careProvider: z.string().optional(),
  birthLocation: z.string().optional(),
  birthTypes: z.array(z.string()).optional(),
  clientStatus: z.string().optional(),
  packageSelected: z.string().optional(),
  contractSigned: z.boolean().optional(),
  paymentStatus: z.string().optional(),
  notes: z.string().optional(),
});

interface AddClientFormProps {
  onSuccess?: () => void;
}

export const AddClientForm = ({ onSuccess }: AddClientFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>("/placeholder.svg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferredName: "",
      pronouns: "",
      phone: "",
      email: "",
      birthTypes: [],
      clientStatus: "inquiry",
      contractSigned: false,
      paymentStatus: "unpaid",
      notes: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const imageUrl = `/lovable-uploads/client-${uniqueId}.png`;
      setSelectedImage(imageUrl);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const fullName = `${values.firstName} ${values.lastName}`;
      
      const newClient = {
        name: fullName,
        dueDateISO: values.dueDate.toISOString().split('T')[0],
        dueDateLabel: format(values.dueDate, "MMMM do, yyyy"),
        image: selectedImage,
        preferredName: values.preferredName,
        pronouns: values.pronouns,
        phone: values.phone,
        email: values.email,
        careProvider: values.careProvider,
        birthLocation: values.birthLocation as any,
        birthTypes: values.birthTypes as BirthType[],
        status: values.clientStatus as ClientStatus,
        packageSelected: values.packageSelected,
        contractSigned: values.contractSigned,
        paymentStatus: values.paymentStatus as PaymentStatus,
        notes: values.notes,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Adding new client with data:", newClient);
      await addClient(newClient);
      
      toast({
        title: "Success",
        description: `${fullName} has been added to your clients.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Small delay before navigation to ensure Firestore has time to synchronize
      setTimeout(() => {
        navigate(`/clients/${encodeURIComponent(fullName)}`);
      }, 500);
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <ImageUpload 
            selectedImage={selectedImage}
            onImageUpload={handleImageUpload}
          />
          
          <div className="space-y-4">
            <div className="text-lg font-semibold text-[#1B3F58] mb-2">Client Information</div>
            <PersonalInfoFields form={form} />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <PregnancyDetailsSection form={form} />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <AdminSection form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            className="bg-[#F499B7] hover:bg-[#F499B7]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Client"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
