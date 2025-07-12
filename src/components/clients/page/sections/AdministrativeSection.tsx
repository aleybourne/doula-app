
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DisplayField } from "../shared/DisplayField";

interface AdministrativeSectionProps {
  isEditing: boolean;
  editingClient: any;
  handleChange: (field: string, value: any) => void;
}

export const AdministrativeSection = ({ isEditing, editingClient, handleChange }: AdministrativeSectionProps) => {
  if (!isEditing) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Administrative</h4>
        <DisplayField label="Package" value={editingClient.packageSelected} />
        <DisplayField label="Payment Status" value={editingClient.paymentStatus} />
        <DisplayField label="Contract" value={editingClient.contractSigned ? "Signed" : "Not Signed"} />
        <DisplayField label="Referral Source" value={editingClient.referralSource} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">Administrative</h4>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Package</Label>
          <Input
            value={editingClient.packageSelected || ''}
            onChange={(e) => handleChange('packageSelected', e.target.value)}
            placeholder="Enter package"
          />
        </div>

        <div className="grid gap-2">
          <Label>Payment Status</Label>
          <Select
            value={editingClient.paymentStatus || 'unpaid'}
            onValueChange={(value) => handleChange('paymentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Contract</Label>
          <Select
            value={editingClient.contractSigned ? "signed" : "unsigned"}
            onValueChange={(value) => handleChange('contractSigned', value === "signed")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unsigned">Not Signed</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Referral Source</Label>
          <Input
            value={editingClient.referralSource || ''}
            onChange={(e) => handleChange('referralSource', e.target.value)}
            placeholder="How did they find you?"
          />
        </div>
      </div>
    </div>
  );
};
