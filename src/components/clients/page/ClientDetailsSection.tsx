
import React, { useState } from "react";
import { ClientData } from "../types/ClientTypes";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useInlineEdit } from "../hooks/useInlineEdit";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ContactInfoSection } from "./sections/ContactInfoSection";
import { BirthDetailsSection } from "./sections/BirthDetailsSection";
import { AdministrativeSection } from "./sections/AdministrativeSection";
import { NotesSection } from "./sections/NotesSection";
import { updateClient } from "../clientsData";
import { useToast } from "@/hooks/use-toast";

interface ClientDetailsSectionProps {
  client: ClientData;
}

const ClientDetailsSection: React.FC<ClientDetailsSectionProps> = ({ client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { editingClient, handleChange } = useInlineEdit(client);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      dueDate: client.dueDateISO ? new Date(client.dueDateISO) : new Date(),
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateClient(editingClient);
      toast({
        title: "Success",
        description: `${editingClient.name}'s profile has been updated.`,
      });
      setIsEditing(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving client details:', error);
      toast({
        title: "Error",
        description: "Failed to save client details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-4 mx-2 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <h3 className="font-semibold text-lg text-[#2b2939]">Client Details</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            {isOpen && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
            {isOpen && isEditing && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save & Close"}
              </Button>
            )}
          </div>

          <CollapsibleContent>
            <CardContent className="px-1 py-2 space-y-6">
              <ContactInfoSection
                isEditing={isEditing}
                editingClient={editingClient}
                handleChange={handleChange}
              />
              
              <BirthDetailsSection
                isEditing={isEditing}
                editingClient={editingClient}
                handleChange={handleChange}
                form={form}
              />
              
              <AdministrativeSection
                isEditing={isEditing}
                editingClient={editingClient}
                handleChange={handleChange}
              />
              
              <NotesSection
                isEditing={isEditing}
                editingClient={editingClient}
                handleChange={handleChange}
              />
            </CardContent>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
  );
};

export default ClientDetailsSection;
