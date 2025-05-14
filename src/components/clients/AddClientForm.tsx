
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import { addClient } from "./clientsData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "./ImageUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PregnancyDetailsSection } from "./form-sections/PregnancyDetailsSection";
import { AdminSection } from "./form-sections/AdminSection";
import { BirthType, ClientStatus, PaymentStatus } from "./types/ClientTypes";

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
    };
    
    addClient(newClient);
    
    toast({
      title: "Success",
      description: `${fullName} has been added to your clients.`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    navigate(`/clients/${encodeURIComponent(fullName)}`);
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
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            className="bg-[#F499B7] hover:bg-[#F499B7]/90"
          >
            Add Client
          </Button>
        </div>
      </form>
    </Form>
  );
};
