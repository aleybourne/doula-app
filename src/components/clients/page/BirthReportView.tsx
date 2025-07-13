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
      <div className="text-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">No Report Data</h3>
          <p className="text-sm text-muted-foreground">Start by adding detailed notes to generate a report.</p>
        </div>
        <Button onClick={onEdit} className="mt-4">
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
    <div className={`space-y-4 ${hasContent ? '' : 'opacity-50'}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="ml-13 space-y-3">
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
      <div className="flex justify-between items-start py-2 px-3 rounded-lg bg-card/30 border border-border/30">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-sm text-right max-w-[60%] ${highlight ? 'font-semibold text-primary' : 'text-foreground'}`}>
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
      <div className="p-4 rounded-lg bg-card/20 border border-border/30 space-y-2">
        <h4 className="text-sm font-semibold text-primary">{title}</h4>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="text-center space-y-4 pb-6 border-b">
        <div className="flex items-center justify-center gap-3">
          <Baby className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Birth Report</h2>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{client.name}</h3>
          {client.deliveryDate && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Born: {formatDate(client.deliveryDate)}</span>
            </div>
          )}
        </div>

        <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
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
        <div className="grid gap-2">
          <DataPoint label="APGAR at 1 minute" value={client.apgar1Min} highlight />
          <DataPoint label="APGAR at 5 minutes" value={client.apgar5Min} highlight />
          <DataPoint label="Estimated Blood Loss" value={client.estimatedBloodLoss} />
          <DataPoint label="Umbilical Cord" value={client.umbilicalCordCondition} />
          <DataPoint label="Delivery Position" value={client.parentalDeliveryPosition} />
          <DataPoint label="Baby's Birth Position" value={client.babyBirthPosition} />
        </div>
      </ReportSection>

      <Separator className="my-6" />

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

      <Separator className="my-6" />

      {/* Infant Care Section */}
      <ReportSection 
        title="Infant Care & Feeding" 
        icon={Baby}
        hasContent={!!(client.feedingMethod || client.babyBehaviorObservations)}
      >
        <div className="space-y-3">
          {client.feedingMethod && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/20 border border-border/30">
              <span className="text-sm font-medium text-muted-foreground">Feeding Method:</span>
              <Badge variant="secondary" className="capitalize">
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
      <div className="text-center pt-6 border-t">
        <p className="text-xs text-muted-foreground">
          This report was generated to document the birth experience and early care observations.
          {client.createdAt && (
            <> • Report created: {formatDate(client.createdAt)}</>
          )}
        </p>
      </div>
    </div>
  );
};