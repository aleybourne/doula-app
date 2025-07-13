import React from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Activity, Clock, Heart, User, Edit, FileText, Timer } from "lucide-react";
import { ClientData, ActiveLaborNote } from "../types/ClientTypes";

interface ActiveLaborReportViewProps {
  client: ClientData;
  activeLaborNote: ActiveLaborNote;
  onEdit: () => void;
}

export const ActiveLaborReportView: React.FC<ActiveLaborReportViewProps> = ({
  client,
  activeLaborNote,
  onEdit
}) => {
  const hasAnyData = activeLaborNote.admissionTime || activeLaborNote.hospitalLocation || 
                     activeLaborNote.cervicalExam || activeLaborNote.contractionPattern ||
                     activeLaborNote.clientEmotionalState || activeLaborNote.supportOffered ||
                     activeLaborNote.clientMobility || activeLaborNote.laborProgress;

  if (!hasAnyData) {
    return (
      <div className="text-center py-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl border border-primary/20">
        <FileText className="h-12 w-12 text-primary/60 mx-auto" />
        <div className="space-y-2 px-4">
          <h3 className="text-lg font-semibold text-primary">No Active Labor Notes</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Start documenting labor progress to generate your comprehensive active labor report.</p>
        </div>
        <Button onClick={onEdit} size="sm" className="mt-4 bg-primary hover:bg-primary/90">
          <Edit className="h-4 w-4 mr-2" />
          Add Labor Notes
        </Button>
      </div>
    );
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Not recorded";
    return timeString;
  };

  const formatPainManagement = (painManagement: string, otherDetails?: string) => {
    if (painManagement === 'other' && otherDetails) {
      return `Other - ${otherDetails}`;
    }
    return painManagement.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const StatBox = ({ 
    label, 
    value, 
    highlight = false 
  }: { 
    label: string; 
    value?: string; 
    highlight?: boolean;
  }) => {
    if (!value) return null;
    
    return (
      <div className={`p-2 sm:p-3 rounded-lg border text-center ${highlight ? 'bg-primary/10 border-primary/20' : 'bg-card border-border'}`}>
        <div className="text-xs text-muted-foreground font-medium break-words">{label}</div>
        <div className={`text-sm sm:text-lg font-bold mt-1 break-words ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </div>
      </div>
    );
  };

  const InfoRow = ({ 
    label, 
    value 
  }: { 
    label: string; 
    value?: string;
  }) => {
    if (!value) return null;
    
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border/30 last:border-0 gap-1 sm:gap-0">
        <span className="text-xs sm:text-sm text-muted-foreground font-medium break-words">{label}</span>
        <span className="text-xs sm:text-sm font-semibold text-foreground sm:text-right sm:max-w-[60%] break-words">
          {value}
        </span>
      </div>
    );
  };

  const NotesSection = ({ 
    title, 
    content 
  }: { 
    title: string; 
    content?: string;
  }) => {
    if (!content) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-primary border-l-3 border-primary pl-3">{title}</h4>
        <div className="bg-muted/20 p-3 rounded-lg border border-border/50">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {/* Header */}
      <div className="text-center border-b border-border pb-3 sm:pb-4 space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-primary break-words">ACTIVE LABOR REPORT</h2>
        <p className="text-sm text-muted-foreground break-words">{client.name}</p>
        {activeLaborNote.timestamp && (
          <div className="text-xs sm:text-sm font-medium text-foreground break-words">
            {new Date(activeLaborNote.timestamp).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Labor Overview Stats */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Labor Overview
        </h3>
        
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <StatBox label="Admission Time" value={formatTime(activeLaborNote.admissionTime)} highlight />
          <StatBox label="Location" value={activeLaborNote.hospitalLocation} />
          <StatBox label="Cervical Exam" value={activeLaborNote.cervicalExam} />
          <StatBox label="Pain Management" value={formatPainManagement(activeLaborNote.painManagement, activeLaborNote.painManagementOther)} />
        </div>
      </div>

      {/* Labor Progress Timeline */}
      {(activeLaborNote.contractionPattern || activeLaborNote.laborProgress) && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Labor Progress
          </h3>
          <div className="bg-card/50 p-3 sm:p-4 rounded-lg border border-border/50 space-y-1">
            <InfoRow label="Contraction Pattern" value={activeLaborNote.contractionPattern} />
          </div>
          {activeLaborNote.laborProgress && (
            <NotesSection title="Progress Over Time" content={activeLaborNote.laborProgress} />
          )}
        </div>
      )}

      {/* Support & Interventions */}
      {(activeLaborNote.supportOffered || activeLaborNote.clientMobility) && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Support & Interventions
          </h3>
          <div className="space-y-3">
            {activeLaborNote.supportOffered && (
              <NotesSection title="Doula Support Provided" content={activeLaborNote.supportOffered} />
            )}
            {activeLaborNote.clientMobility && (
              <NotesSection title="Client Mobility & Positions" content={activeLaborNote.clientMobility} />
            )}
          </div>
        </div>
      )}

      {/* Client Assessment */}
      {activeLaborNote.clientEmotionalState && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Assessment
          </h3>
          <NotesSection title="Emotional State & Coping" content={activeLaborNote.clientEmotionalState} />
        </div>
      )}

      {/* Additional Information */}
      {(activeLaborNote.staffInteractions || activeLaborNote.additionalNotes) && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary">Additional Information</h3>
          <div className="space-y-3">
            {activeLaborNote.staffInteractions && (
              <NotesSection title="Staff Interactions" content={activeLaborNote.staffInteractions} />
            )}
            {activeLaborNote.additionalNotes && (
              <NotesSection title="Additional Notes" content={activeLaborNote.additionalNotes} />
            )}
          </div>
        </div>
      )}

      {/* Edit Button */}
      <div className="pt-3 sm:pt-4 border-t border-border">
        <Button onClick={onEdit} variant="outline" size="sm" className="w-full text-xs sm:text-sm">
          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Edit Report
        </Button>
      </div>
    </div>
  );
};