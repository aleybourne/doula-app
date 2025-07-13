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
      <div className="text-center py-16 space-y-6 bg-muted/30 rounded-2xl">
        <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto" />
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">No Report Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">Start by adding detailed notes to generate your comprehensive birth report.</p>
        </div>
        <Button onClick={onEdit} size="lg" className="mt-6">
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
    <div className={`bg-muted/30 rounded-2xl p-6 space-y-6 ${hasContent ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">
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
      <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-background/80 border border-border/50">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className={`text-right max-w-[60%] ${highlight ? 'font-semibold text-primary' : 'text-foreground'}`}>
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
      <div className="p-5 rounded-xl bg-background/80 border border-border/50 space-y-3">
        <h4 className="font-semibold text-primary">{title}</h4>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="text-center space-y-6 p-8 bg-muted/30 rounded-2xl">
        <div className="flex items-center justify-center gap-4">
          <div className="p-3 rounded-xl bg-primary/15">
            <Baby className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Birth Report</h2>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-foreground">{client.name}</h3>
          {client.deliveryDate && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>Born: {formatDate(client.deliveryDate)}</span>
            </div>
          )}
        </div>

        <Button onClick={onEdit} variant="outline" size="lg" className="gap-2 mt-4">
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
        <div className="space-y-3">
          {client.feedingMethod && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/50">
              <span className="font-medium text-muted-foreground">Feeding Method</span>
              <Badge variant="secondary" className="capitalize font-medium">
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
      <div className="text-center pt-8 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This report was generated to document the birth experience and early care observations.
          {client.createdAt && (
            <>
              <br />Report created: {formatDate(client.createdAt)}
            </>
          )}
        </p>
      </div>
    </div>
  );
};