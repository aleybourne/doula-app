
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ClientData } from "./types/ClientTypes";
import { PregnancyDetailsSection } from "./form-sections/PregnancyDetailsSection";
import { AdminSection } from "./form-sections/AdminSection";

const phoneRegex = /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  preferredName: z.string().optional(),
  pronouns: z.string().optional(),
  phone: z.string().regex(phoneRegex, "Invalid phone number").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dueDate: z.date({
    message: "Due date is required",
  }),
  careProvider: z.string().optional(),
  birthLocation: z.string().optional(),
  birthTypes: z.array(z.string()).optional(),
  packageSelected: z.string().optional(),
  contractSigned: z.boolean().optional(),
  paymentStatus: z.string().optional(),
  notes: z.string().optional(),
  clientStatus: z.string().optional(),
});

interface EditClientFormProps {
  client: ClientData;
  onUpdate: (updatedClient: ClientData) => void;
  onClose: () => void;
}

export const EditClientForm: React.FC<EditClientFormProps> = ({
  client,
  onUpdate,
  onClose,
}) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string>(client.image || "/placeholder.svg");
  
  // Split the full name into first and last name
  const nameParts = client.name.split(" ");
  const defaultFirstName = nameParts[0];
  const defaultLastName = nameParts.slice(1).join(" ");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      preferredName: client.preferredName || "",
      pronouns: client.pronouns || "",
      phone: client.phone || "",
      email: client.email || "",
      dueDate: client.dueDateISO ? new Date(client.dueDateISO) : new Date(),
      careProvider: client.careProvider || "",
      birthLocation: client.birthLocation || "",
      birthTypes: client.birthTypes || [],
      packageSelected: client.packageSelected || "",
      contractSigned: client.contractSigned || false,
      paymentStatus: client.paymentStatus || "unpaid",
      notes: client.notes || "",
      clientStatus: client.status || "active",
    },
  });

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const fullName = `${values.firstName} ${values.lastName}`;
    
    const updatedClient: ClientData = {
      ...client,
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
      birthTypes: values.birthTypes as any,
      packageSelected: values.packageSelected,
      contractSigned: values.contractSigned,
      paymentStatus: values.paymentStatus as any,
      notes: values.notes,
      status: values.clientStatus as any,
    };
    
    onUpdate(updatedClient);
    
    toast({
      title: "Success",
      description: `${fullName}'s profile has been updated.`,
    });
    
    onClose();
  };

  return (
    <div className="flex flex-col max-h-full">
      <DialogTitle className="text-lg font-semibold mb-4">Edit Client Details</DialogTitle>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 -mr-2">
            <ImageUpload 
              selectedImage={selectedImage}
              onImageUpload={handleImageUpload}
              clientId={client.id}
            />
            <PersonalInfoFields form={form} />
            <PregnancyDetailsSection form={form} />
            <AdminSection form={form} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-[#F499B7] hover:bg-[#F499B7]/90"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
