
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
import { getCurrentUserId } from "./store/clientStore";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

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
      clientStatus: "active",
      contractSigned: false,
      paymentStatus: "unpaid",
      notes: "",
    },
  });

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("🚀 === FORM SUBMISSION STARTED ===");
    setIsSubmitting(true);
    
    try {
      console.log("📝 Step 1: Form validation passed");
      console.log("📋 Form values:", values);
      
      console.log("🔐 Step 2: Getting current user ID...");
      const currentUserId = getCurrentUserId();
      console.log("👤 Current user ID result:", currentUserId);
      
      if (!currentUserId) {
        console.error("❌ No user ID found - authentication failed");
        throw new Error("User not authenticated. Please log in again.");
      }
      console.log("✅ User authenticated with ID:", currentUserId);

      const fullName = `${values.firstName} ${values.lastName}`;
      const clientId = `client-${uuidv4()}`;
      
      console.log("🏗️ Step 3: Constructing client object...");
      console.log("👤 User ID for client:", currentUserId);
      console.log("👶 Client name:", fullName);
      console.log("🆔 Generated client ID:", clientId);
      
      const newClient = {
        id: clientId,
        name: fullName,
        dueDateISO: values.dueDate.toISOString().split('T')[0],
        dueDateLabel: format(values.dueDate, "MMMM do, yyyy"),
        image: selectedImage,
        preferredName: values.preferredName || "",
        pronouns: values.pronouns || "",
        phone: values.phone || "",
        email: values.email || "",
        careProvider: values.careProvider || "",
        birthLocation: values.birthLocation as any || "",
        birthTypes: values.birthTypes as BirthType[] || [],
        status: values.clientStatus as ClientStatus || "active",
        packageSelected: values.packageSelected || "",
        contractSigned: values.contractSigned || false,
        paymentStatus: values.paymentStatus as PaymentStatus || "unpaid",
        notes: values.notes || "",
        createdAt: new Date().toISOString(),
        userId: currentUserId, // Explicitly set the userId
      };
      
      console.log("✅ Step 4: Client object constructed successfully");
      console.log("📋 Complete client data:", JSON.stringify(newClient, null, 2));
      
      console.log("💾 Step 5: Starting save process...");
      const savedClient = await addClient(newClient);
      console.log("✅ Step 5 complete: Client saved successfully");
      console.log("🎉 Saved client result:", savedClient);
      
      console.log("📢 Step 6: Showing success message...");
      toast({
        title: "Success",
        description: `${fullName} has been added to your clients.`,
      });
      
      if (onSuccess) {
        console.log("🔄 Step 7: Calling onSuccess callback...");
        onSuccess();
      }
      
      console.log("🧭 Step 8: Navigating to client page...");
      // Navigate to the client page using the ID
      navigate(`/clients/id/${savedClient.id}`);
      console.log("✅ === FORM SUBMISSION COMPLETED SUCCESSFULLY ===");
    } catch (error) {
      console.error("❌ === FORM SUBMISSION FAILED ===");
      console.error("❌ Error details:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      toast({
        title: "Error",
        description: error.message || "There was a problem adding the client. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("🏁 Step 9: Cleaning up (setting isSubmitting to false)");
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
          {onSuccess ? (
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              disabled={isSubmitting}
              onClick={() => navigate('/clients')}
            >
              Cancel
            </Button>
          )}
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
