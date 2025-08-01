import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Baby, Clock, Heart, Droplets, Edit, FileText, Calendar, User, Download, Loader2 } from "lucide-react";
import { ClientData } from "../types/ClientTypes";
import { format } from "date-fns";
import { generateBirthReportPDF } from "../utils/pdfGenerator";
import { uploadClientDocument } from "../utils/firebaseStorage";
import { updateClient } from "../store/clientActions";
import { useToast } from "../../ui/use-toast";

interface BirthReportViewProps {
  client: ClientData;
  onEdit: () => void;
}

export const BirthReportView: React.FC<BirthReportViewProps> = ({
  client,
  onEdit
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();
  const hasAnyData = client.apgar1Min || client.apgar5Min || client.postpartumNotes || 
                     client.feedingMethod || client.babyBehaviorObservations || client.deliveryWeight ||
                     client.deliveryLength || client.deliveryHeadCircumference || client.estimatedBloodLoss ||
                     client.umbilicalCordCondition || client.parentalDeliveryPosition || client.babyBirthPosition ||
                     client.pericareNotes || client.immediatePostpartumCare || client.initialFeedingTime ||
                     client.latchQuality || client.feedingNotes;

  if (!hasAnyData) {
    return (
      <div className="text-center py-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl border border-primary/20">
        <FileText className="h-12 w-12 text-primary/60 mx-auto" />
        <div className="space-y-2 px-4">
          <h3 className="text-lg font-semibold text-primary">No Report Data</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Start by adding detailed notes to generate your comprehensive birth report.</p>
        </div>
        <Button onClick={onEdit} size="sm" className="mt-4 bg-primary hover:bg-primary/90">
          <Edit className="h-4 w-4 mr-2" />
          Add Birth Notes
        </Button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not recorded";
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Not recorded";
    try {
      return format(new Date(dateString), "p");
    } catch {
      return dateString;
    }
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

  const handleSaveAsPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate PDF
      const pdfBlob = generateBirthReportPDF(client);
      
      // Create file object
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `birth-report-${timestamp}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      // Upload to Firebase Storage
      const uploadResult = await uploadClientDocument(file, client.id, "client-forms");
      
      // Create document metadata
      const newDocument = {
        id: crypto.randomUUID(),
        name: "Birth Report",
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
        folder: "client-forms" as const,
        uploadDate: new Date().toISOString(),
        downloadURL: uploadResult.url,
        storagePath: uploadResult.path
      };
      
      // Update client with new document
      const updatedClient = {
        ...client,
        documents: [...(client.documents || []), newDocument]
      };
      
      await updateClient(updatedClient);
      
      toast({
        title: "Success",
        description: "Birth report saved as PDF to documents"
      });
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to save PDF to documents",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {/* Header */}
      <div className="text-center border-b border-border pb-3 sm:pb-4 space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-primary break-words">BIRTH REPORT</h2>
        <p className="text-sm text-muted-foreground break-words">{client.name}</p>
        {client.deliveryDate && (
          <div className="text-xs sm:text-sm font-medium text-foreground break-words">
            {formatDate(client.deliveryDate)}
          </div>
        )}
      </div>

      {/* Birth Stats - Key Metrics in Boxes */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Birth Stats</h3>
        
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <StatBox label="Time" value={client.deliveryDate ? formatTime(client.deliveryDate) : undefined} />
          <StatBox label="Weight" value={client.deliveryWeight} />
          <StatBox label="Length" value={client.deliveryLength} />
          <StatBox label="Head Circumference" value={client.deliveryHeadCircumference} />
        </div>
      </div>

      {/* Additional Birth Information */}
      {(client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss || client.umbilicalCordCondition || client.parentalDeliveryPosition || client.babyBirthPosition) && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary">Additional Birth Information</h3>
          <div className="bg-card/50 p-3 sm:p-4 rounded-lg border border-border/50 space-y-1">
            <InfoRow label="APGAR 1 Min" value={client.apgar1Min} />
            <InfoRow label="APGAR 5 Min" value={client.apgar5Min} />
            <InfoRow label="Estimated Blood Loss (EBL)" value={client.estimatedBloodLoss} />
            <InfoRow label="Umbilical Cord Condition" value={client.umbilicalCordCondition} />
            <InfoRow label="Parental Delivery Position" value={client.parentalDeliveryPosition} />
            <InfoRow label="Baby Birth Position" value={client.babyBirthPosition} />
          </div>
        </div>
      )}

      {/* Postpartum Notes */}
      {client.postpartumNotes && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary">Postpartum Notes</h3>
          <NotesSection title="General Recovery Notes" content={client.postpartumNotes} />
        </div>
      )}

      {/* Pericare + Physical Recovery */}
      {client.pericareNotes && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary">Pericare + Physical Recovery Notes</h3>
          <NotesSection title="Recovery Details" content={client.pericareNotes} />
        </div>
      )}

      {/* Immediate Postpartum Care */}
      {client.immediatePostpartumCare && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary">Immediate Postpartum Care & Recommendations</h3>
          <NotesSection title="Care Provided" content={client.immediatePostpartumCare} />
        </div>
      )}

      {/* Infant Care and Wellness */}
      {(client.feedingMethod || client.initialFeedingTime || client.latchQuality || client.feedingNotes || client.babyBehaviorObservations) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary">Infant Care and Wellness</h3>
          
          {/* Feeding Info */}
          {(client.feedingMethod || client.initialFeedingTime || client.latchQuality) && (
            <div className="bg-card/50 p-4 rounded-lg border border-border/50 space-y-1">
              <InfoRow label="Feeding Method" value={client.feedingMethod ? client.feedingMethod.charAt(0).toUpperCase() + client.feedingMethod.slice(1) : undefined} />
              <InfoRow label="Initial Feeding Time" value={client.initialFeedingTime} />
              <InfoRow label="Latch Quality/Concerns" value={client.latchQuality} />
            </div>
          )}

          {/* Feeding Notes */}
          {client.feedingNotes && (
            <NotesSection title="Feeding Notes" content={client.feedingNotes} />
          )}

          {/* Baby Behavior */}
          {client.babyBehaviorObservations && (
            <NotesSection title="Observed Baby Cues or Behaviors" content={client.babyBehaviorObservations} />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 sm:pt-4 border-t border-border space-y-2">
        <Button 
          onClick={handleSaveAsPDF} 
          variant="default" 
          size="sm" 
          className="w-full text-xs sm:text-sm"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          )}
          {isGeneratingPDF ? "Saving PDF..." : "Save as PDF to Documents"}
        </Button>
        
        <Button onClick={onEdit} variant="outline" size="sm" className="w-full text-xs sm:text-sm">
          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Edit Report
        </Button>
      </div>
    </div>
  );
};