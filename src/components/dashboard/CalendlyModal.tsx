
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendlyUrl: string;
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ open, onOpenChange, calendlyUrl }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="p-0 max-w-xl w-[98vw] max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="flex justify-between items-center px-5 pt-4">
          Schedule via Calendly
          <DialogClose asChild>
            <button aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-hidden rounded-b-xl" style={{ height: "60vh" }}>
        <iframe
          src={calendlyUrl}
          title="Calendly Scheduling"
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "100%", minWidth: "100%" }}
          allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    </DialogContent>
  </Dialog>
);
