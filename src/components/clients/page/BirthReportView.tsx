import React from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Baby, Clock, Heart, Droplets, Edit, FileText, Calendar, User } from "lucide-react";
import { ClientData } from "../types/ClientTypes";
import { format } from "date-fns";

interface BirthReportViewProps {
  client: ClientData;
  onEdit: () => void;
}

export const BirthReportView: React.FC<BirthReportViewProps> = ({
  client,
  onEdit
}) => {
  const hasAnyData = client.apgar1Min || client.apgar5Min || client.postpartumNotes || 
                     client.feedingMethod || client.babyBehaviorObservations;

  if (!hasAnyData) {
    return (
      <div className="text-center py-6 md:py-8 space-y-3 md:space-y-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl border border-primary/20">
        <FileText className="h-10 w-10 md:h-12 md:w-12 text-primary/60 mx-auto" />
        <div className="space-y-2 px-4">
          <h3 className="text-base md:text-lg font-semibold text-primary">No Report Data</h3>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">Start by adding detailed notes to generate your comprehensive birth report.</p>
        </div>
        <Button onClick={onEdit} size="sm" className="mt-3 md:mt-4 bg-primary hover:bg-primary/90">
          <Edit className="h-3 w-3 md:h-4 md:w-4 mr-2" />
          Add Birth Notes
        </Button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not recorded";
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const ReportSection = ({ 
    title, 
    icon: Icon, 
    children, 
    hasContent 
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode; 
    hasContent: boolean;
  }) => (
    <div className={`bg-gradient-to-br from-card to-secondary/5 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 shadow-sm border border-primary/10 ${hasContent ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
          <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-primary">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const DataPoint = ({ 
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 py-2 px-3 rounded-md bg-gradient-to-r from-background to-secondary/20 border border-primary/5">
        <span className="font-medium text-muted-foreground text-xs md:text-sm">{label}</span>
        <span className={`text-xs md:text-sm break-words ${highlight ? 'font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full' : 'text-foreground'}`}>
          {value}
        </span>
      </div>
    );
  };

  const NarrativeNote = ({ 
    title, 
    content 
  }: { 
    title: string; 
    content?: string;
  }) => {
    if (!content) return null;
    
    return (
      <div className="p-3 rounded-md bg-gradient-to-br from-primary/5 to-secondary/10 border border-primary/10 space-y-1">
        <h4 className="font-semibold text-primary text-xs md:text-sm border-l-2 border-primary pl-2">{title}</h4>
        <p className="text-foreground text-xs md:text-sm leading-relaxed whitespace-pre-wrap pl-4">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Report Header */}
      <div className="text-center space-y-2 md:space-y-3 p-3 md:p-4 bg-gradient-to-br from-primary/10 via-card to-secondary/5 rounded-xl shadow-sm border border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-primary/20">
            <Baby className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Birth Report</h2>
        </div>
        
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-base md:text-xl font-semibold text-foreground">{client.name}</h3>
          {client.deliveryDate && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs md:text-sm">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="break-words">Born: {formatDate(client.deliveryDate)}</span>
            </div>
          )}
        </div>

        <Button onClick={onEdit} variant="outline" size="sm" className="gap-2 mt-2 border-primary/30 text-primary hover:bg-primary/10">
          <Edit className="h-3 w-3 md:h-4 md:w-4" />
          Edit Details
        </Button>
      </div>

      {/* Birth Stats Section */}
      <ReportSection 
        title="Birth Statistics" 
        icon={Droplets}
        hasContent={!!(client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss)}
      >
        <DataPoint label="APGAR at 1 minute" value={client.apgar1Min} highlight />
        <DataPoint label="APGAR at 5 minutes" value={client.apgar5Min} highlight />
        <DataPoint label="Estimated Blood Loss" value={client.estimatedBloodLoss} />
        <DataPoint label="Umbilical Cord" value={client.umbilicalCordCondition} />
        <DataPoint label="Delivery Position" value={client.parentalDeliveryPosition} />
        <DataPoint label="Baby's Birth Position" value={client.babyBirthPosition} />
      </ReportSection>

      {/* Postpartum Recovery Section */}
      <ReportSection 
        title="Recovery & Care" 
        icon={Heart}
        hasContent={!!(client.postpartumNotes || client.pericareNotes || client.immediatePostpartumCare)}
      >
        <NarrativeNote 
          title="Recovery Observations" 
          content={client.postpartumNotes} 
        />
        <NarrativeNote 
          title="Physical Care Notes" 
          content={client.pericareNotes} 
        />
        <NarrativeNote 
          title="Immediate Postpartum Support" 
          content={client.immediatePostpartumCare} 
        />
      </ReportSection>

      {/* Infant Care Section */}
      <ReportSection 
        title="Infant Care & Feeding" 
        icon={Baby}
        hasContent={!!(client.feedingMethod || client.babyBehaviorObservations)}
      >
        {client.feedingMethod && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 py-2 px-3 rounded-md bg-gradient-to-r from-primary/5 to-secondary/10 border border-primary/10">
            <span className="font-medium text-muted-foreground text-xs md:text-sm">Feeding Method</span>
            <Badge variant="secondary" className="capitalize font-medium text-xs bg-primary/20 text-primary border-primary/30 w-fit">
              {client.feedingMethod}
            </Badge>
          </div>
        )}
        
        <DataPoint label="First Feeding" value={client.initialFeedingTime} />
        <DataPoint label="Latch Assessment" value={client.latchQuality} />
        
        <NarrativeNote 
          title="Feeding Notes" 
          content={client.feedingNotes} 
        />
        <NarrativeNote 
          title="Baby's Behavior & Cues" 
          content={client.babyBehaviorObservations} 
        />
      </ReportSection>

      {/* Footer Note */}
      <div className="text-center pt-2 md:pt-3 pb-2">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          This report documents the birth experience and early care observations.
          {client.createdAt && (
            <span className="block mt-1 text-primary/70"> Report created: {formatDate(client.createdAt)}</span>
          )}
        </p>
      </div>
    </div>
  );
};