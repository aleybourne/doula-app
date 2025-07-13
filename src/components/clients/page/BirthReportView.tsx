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
      <div className="text-center py-8 md:py-16 space-y-4 md:space-y-6 bg-card rounded-lg md:rounded-2xl shadow-sm border">
        <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/40 mx-auto" />
        <div className="space-y-2 md:space-y-3 px-4">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">No Report Data</h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">Start by adding detailed notes to generate your comprehensive birth report.</p>
        </div>
        <Button onClick={onEdit} size="lg" className="mt-4 md:mt-6 w-full max-w-xs">
          <Edit className="h-4 w-4 mr-2" />
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
    <div className={`bg-card rounded-lg md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 shadow-sm border ${hasContent ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3 md:space-y-4">
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 px-3 md:px-4 rounded-lg bg-muted/50 border border-border/30">
        <span className="font-medium text-muted-foreground text-sm md:text-base">{label}</span>
        <span className={`text-sm md:text-base ${highlight ? 'font-semibold text-primary' : 'text-foreground'}`}>
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
      <div className="p-4 md:p-5 rounded-lg bg-muted/50 border border-border/30 space-y-2 md:space-y-3">
        <h4 className="font-semibold text-primary text-sm md:text-base">{title}</h4>
        <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-8 px-4 md:px-0">
      {/* Report Header */}
      <div className="text-center space-y-4 md:space-y-6 p-4 md:p-8 bg-card rounded-lg md:rounded-2xl shadow-sm border">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10">
            <Baby className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-primary">Birth Report</h2>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <h3 className="text-lg md:text-2xl font-semibold text-foreground">{client.name}</h3>
          {client.deliveryDate && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-base">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              <span className="break-words">Born: {formatDate(client.deliveryDate)}</span>
            </div>
          )}
        </div>

        <Button onClick={onEdit} variant="outline" size="lg" className="gap-2 mt-3 md:mt-4 w-full max-w-xs">
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
      </div>

      {/* Birth Stats Section */}
      <ReportSection 
        title="Birth Statistics" 
        icon={Droplets}
        hasContent={!!(client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss)}
      >
        <div className="space-y-3">
          <DataPoint label="APGAR at 1 minute" value={client.apgar1Min} highlight />
          <DataPoint label="APGAR at 5 minutes" value={client.apgar5Min} highlight />
          <DataPoint label="Estimated Blood Loss" value={client.estimatedBloodLoss} />
          <DataPoint label="Umbilical Cord" value={client.umbilicalCordCondition} />
          <DataPoint label="Delivery Position" value={client.parentalDeliveryPosition} />
          <DataPoint label="Baby's Birth Position" value={client.babyBirthPosition} />
        </div>
      </ReportSection>


      {/* Postpartum Recovery Section */}
      <ReportSection 
        title="Recovery & Care" 
        icon={Heart}
        hasContent={!!(client.postpartumNotes || client.pericareNotes || client.immediatePostpartumCare)}
      >
        <div className="space-y-3">
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
        </div>
      </ReportSection>

      

      {/* Infant Care Section */}
      <ReportSection 
        title="Infant Care & Feeding" 
        icon={Baby}
        hasContent={!!(client.feedingMethod || client.babyBehaviorObservations)}
      >
        <div className="space-y-3 md:space-y-4">
          {client.feedingMethod && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 md:p-4 rounded-lg bg-muted/50 border border-border/30">
              <span className="font-medium text-muted-foreground text-sm md:text-base">Feeding Method</span>
              <Badge variant="secondary" className="capitalize font-medium text-xs md:text-sm w-fit">
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
        </div>
      </ReportSection>

      {/* Footer Note */}
      <div className="text-center pt-4 md:pt-8 pb-4 px-4 md:px-0">
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          This report was generated to document the birth experience and early care observations.
          {client.createdAt && (
            <>
              <br className="hidden sm:block" />
              <span className="block sm:inline mt-1 sm:mt-0"> Report created: {formatDate(client.createdAt)}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};