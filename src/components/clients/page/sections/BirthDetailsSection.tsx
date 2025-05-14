
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { DueDateField } from "../../DueDateField";
import { UseFormReturn } from "react-hook-form";
import { DisplayField } from "../shared/DisplayField";

interface BirthDetailsSectionProps {
  isEditing: boolean;
  editingClient: any;
  handleChange: (field: string, value: any) => void;
  form: UseFormReturn<any>;
}

export const BirthDetailsSection = ({ isEditing, editingClient, handleChange, form }: BirthDetailsSectionProps) => {
  if (!isEditing) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Birth Details</h4>
        <DisplayField label="Due Date" value={editingClient.dueDateLabel} />
        <DisplayField label="Care Provider" value={editingClient.careProvider} />
        <DisplayField label="Birth Location" value={editingClient.birthLocation} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">Birth Details</h4>
      <div className="grid gap-4">
        <Form {...form}>
          <DueDateField form={form} />
        </Form>

        <div className="grid gap-2">
          <Label>Care Provider</Label>
          <Input
            value={editingClient.careProvider || ''}
            onChange={(e) => handleChange('careProvider', e.target.value)}
            placeholder="Enter care provider"
          />
        </div>

        <div className="grid gap-2">
          <Label>Birth Location</Label>
          <Select
            value={editingClient.birthLocation || ''}
            onValueChange={(value) => handleChange('birthLocation', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select birth location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="birthing-center">Birthing Center</SelectItem>
              <SelectItem value="TBD">TBD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
