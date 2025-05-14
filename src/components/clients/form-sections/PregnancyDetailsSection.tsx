
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { BirthLocationType, BirthType } from "../types/ClientTypes";
import { DueDateField } from "../DueDateField";

interface PregnancyDetailsSectionProps {
  form: UseFormReturn<any>;
}

export const PregnancyDetailsSection: React.FC<PregnancyDetailsSectionProps> = ({ form }) => {
  const birthLocations: BirthLocationType[] = ['home', 'hospital', 'birthing-center', 'TBD'];
  const birthTypes: BirthType[] = ['vaginal', 'c-section', 'VBAC', 'unsure'];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-[#1B3F58] mb-2">Pregnancy Details</div>
      
      <DueDateField form={form} />

      <FormField
        control={form.control}
        name="careProvider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Care Provider / Facility</FormLabel>
            <FormControl>
              <Input placeholder="Enter care provider or facility" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Planned Birth Location</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {birthLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Planned Birth Type</FormLabel>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {birthTypes.map((type) => (
            <FormField
              key={type}
              control={form.control}
              name="birthTypes"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(type)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, type]);
                        } else {
                          field.onChange(currentValues.filter((value) => value !== type));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="!m-0">
                    {type.replace(/\b\w/g, l => l.toUpperCase())}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
