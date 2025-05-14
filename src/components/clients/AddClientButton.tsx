
import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddClientForm } from "./AddClientForm";

export const AddClientButton = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#F499B7] hover:bg-[#F499B7]/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">Add New Client</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full px-6">
          <AddClientForm onSuccess={() => setOpen(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
