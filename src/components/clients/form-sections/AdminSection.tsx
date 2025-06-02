
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientStatus, PaymentStatus } from "../types/ClientTypes";

interface AdminSectionProps {
  form: UseFormReturn<any>;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ form }) => {
  const clientStatuses: ClientStatus[] = ['active', 'past'];
  const paymentStatuses: PaymentStatus[] = ['unpaid', 'partial', 'paid'];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-[#1B3F58] mb-2">Administrative Details</div>

      <FormField
        control={form.control}
        name="clientStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clientStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="packageSelected"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package Selected</FormLabel>
            <FormControl>
              <Input placeholder="Enter package details" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contractSigned"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="!m-0">Contract Signed</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="paymentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Initial Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any initial notes or first impressions"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
