
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DisplayField } from "../shared/DisplayField";

interface ContactInfoSectionProps {
  isEditing: boolean;
  editingClient: any;
  handleChange: (field: string, value: any) => void;
}

export const ContactInfoSection = ({ isEditing, editingClient, handleChange }: ContactInfoSectionProps) => {
  if (!isEditing) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
        <DisplayField label="Preferred Name" value={editingClient.preferredName} />
        <DisplayField label="Pronouns" value={editingClient.pronouns} />
        <DisplayField label="Email" value={editingClient.email} />
        <DisplayField label="Phone" value={editingClient.phone} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Preferred Name</Label>
          <Input
            value={editingClient.preferredName || ''}
            onChange={(e) => handleChange('preferredName', e.target.value)}
            placeholder="Enter preferred name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Pronouns</Label>
          <Select
            value={editingClient.pronouns || ''}
            onValueChange={(value) => handleChange('pronouns', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="she/her">she/her</SelectItem>
              <SelectItem value="he/him">he/him</SelectItem>
              <SelectItem value="they/them">they/them</SelectItem>
              <SelectItem value="custom">custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={editingClient.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="grid gap-2">
          <Label>Phone</Label>
          <Input
            type="tel"
            value={editingClient.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  );
};
