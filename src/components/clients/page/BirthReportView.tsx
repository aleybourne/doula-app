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
    <div className="space-y-2 p-3 max-h-screen overflow-y-auto">
      {/* Key Stats Grid - Mobile First */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {client.deliveryWeight && (
          <div className="bg-card p-2 rounded border text-center">
            <div className="text-xs text-muted-foreground">Weight</div>
            <div className="text-sm font-semibold">{client.deliveryWeight}</div>
          </div>
        )}
        {client.deliveryLength && (
          <div className="bg-card p-2 rounded border text-center">
            <div className="text-xs text-muted-foreground">Length</div>
            <div className="text-sm font-semibold">{client.deliveryLength}</div>
          </div>
        )}
        {client.apgar1Min && (
          <div className="bg-primary/10 p-2 rounded border text-center">
            <div className="text-xs text-muted-foreground">APGAR 1min</div>
            <div className="text-sm font-semibold text-primary">{client.apgar1Min}</div>
          </div>
        )}
        {client.apgar5Min && (
          <div className="bg-primary/10 p-2 rounded border text-center">
            <div className="text-xs text-muted-foreground">APGAR 5min</div>
            <div className="text-sm font-semibold text-primary">{client.apgar5Min}</div>
          </div>
        )}
      </div>

      {/* Time & Details */}
      {client.deliveryDate && (
        <div className="bg-card p-2 rounded border">
          <div className="text-xs text-muted-foreground">Delivery Time</div>
          <div className="text-sm font-medium">{formatDate(client.deliveryDate)}</div>
        </div>
      )}

      {/* Additional Stats in Compact Format */}
      <div className="space-y-1">
        {client.deliveryHeadCircumference && (
          <div className="flex justify-between py-1 text-sm border-b border-border/50">
            <span className="text-muted-foreground">Head Circumference</span>
            <span className="font-medium">{client.deliveryHeadCircumference}</span>
          </div>
        )}
        {client.estimatedBloodLoss && (
          <div className="flex justify-between py-1 text-sm border-b border-border/50">
            <span className="text-muted-foreground">Blood Loss</span>
            <span className="font-medium">{client.estimatedBloodLoss}</span>
          </div>
        )}
        {client.umbilicalCordCondition && (
          <div className="flex justify-between py-1 text-sm border-b border-border/50">
            <span className="text-muted-foreground">Umbilical Cord</span>
            <span className="font-medium">{client.umbilicalCordCondition}</span>
          </div>
        )}
        {client.feedingMethod && (
          <div className="flex justify-between py-1 text-sm border-b border-border/50">
            <span className="text-muted-foreground">Feeding</span>
            <Badge variant="outline" className="text-xs h-5">{client.feedingMethod}</Badge>
          </div>
        )}
      </div>

      {/* Compact Notes - Only if they exist */}
      {(client.postpartumNotes || client.babyBehaviorObservations) && (
        <div className="space-y-2 mt-3">
          {client.postpartumNotes && (
            <div className="bg-muted/30 p-2 rounded border">
              <div className="text-xs font-medium text-muted-foreground mb-1">Recovery Notes</div>
              <div className="text-xs leading-relaxed">{client.postpartumNotes}</div>
            </div>
          )}
          {client.babyBehaviorObservations && (
            <div className="bg-muted/30 p-2 rounded border">
              <div className="text-xs font-medium text-muted-foreground mb-1">Baby Observations</div>
              <div className="text-xs leading-relaxed">{client.babyBehaviorObservations}</div>
            </div>
          )}
        </div>
      )}

      {/* Edit Button */}
      <Button onClick={onEdit} variant="outline" size="sm" className="w-full mt-3">
        <Edit className="h-3 w-3 mr-2" />
        Edit Report
      </Button>
    </div>
  );
};