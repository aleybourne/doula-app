import jsPDF from 'jspdf';
import { ClientData, ActiveLaborNote } from '../types/ClientTypes';

export const generateActiveLaborReportPDF = (
  client: ClientData,
  activeLaborNote: ActiveLaborNote
): Blob => {
  const doc = new jsPDF();
  
  // Set up document properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 30;
  
  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, bold: boolean = false, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    doc.text(lines, margin + indent, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
    
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPosition = 30;
    }
  };
  
  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    yPosition += 5;
    addText(title, 14, true);
    yPosition += 5;
  };
  
  // Helper function to add a field with label and value
  const addField = (label: string, value?: string) => {
    if (!value || value === "Not recorded") return;
    addText(`${label}: ${value}`, 11, false, 10);
  };
  
  // Helper function to format pain management
  const formatPainManagement = (painManagement: string[], otherDetails?: string) => {
    if (!painManagement || painManagement.length === 0) {
      return "Not recorded";
    }
    
    const formatted = painManagement.map(pm => {
      if (pm === 'other' && otherDetails) {
        return `Other - ${otherDetails}`;
      }
      return pm.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    });
    
    return formatted.join(', ');
  };
  
  // Header
  addText('ACTIVE LABOR REPORT', 18, true);
  yPosition += 5;
  addText(client.name, 14, false);
  if (activeLaborNote.timestamp) {
    addText(new Date(activeLaborNote.timestamp).toLocaleDateString(), 12, false);
  }
  yPosition += 10;
  
  // Labor Overview
  addSectionHeader('Labor Overview');
  addField('Admission Time', activeLaborNote.admissionTime);
  addField('Location', activeLaborNote.hospitalLocation);
  addField('Cervical Exam', activeLaborNote.cervicalExam);
  addField('Pain Management', formatPainManagement(activeLaborNote.painManagement, activeLaborNote.painManagementOther));
  
  // Labor Progress
  if (activeLaborNote.contractionPattern || activeLaborNote.laborProgress) {
    addSectionHeader('Labor Progress');
    addField('Contraction Pattern', activeLaborNote.contractionPattern);
    
    if (activeLaborNote.laborProgress) {
      addText('Progress Over Time:', 12, true, 10);
      addText(activeLaborNote.laborProgress, 11, false, 20);
    }
  }
  
  // Support & Interventions
  if (activeLaborNote.supportOffered || activeLaborNote.clientMobility) {
    addSectionHeader('Support & Interventions');
    
    if (activeLaborNote.supportOffered) {
      addText('Doula Support Provided:', 12, true, 10);
      addText(activeLaborNote.supportOffered, 11, false, 20);
    }
    
    if (activeLaborNote.clientMobility) {
      addText('Client Mobility & Positions:', 12, true, 10);
      addText(activeLaborNote.clientMobility, 11, false, 20);
    }
  }
  
  // Client Assessment
  if (activeLaborNote.clientEmotionalState) {
    addSectionHeader('Client Assessment');
    addText('Emotional State & Coping:', 12, true, 10);
    addText(activeLaborNote.clientEmotionalState, 11, false, 20);
  }
  
  // Additional Information
  if (activeLaborNote.staffInteractions || activeLaborNote.additionalNotes) {
    addSectionHeader('Additional Information');
    
    if (activeLaborNote.staffInteractions) {
      addText('Staff Interactions:', 12, true, 10);
      addText(activeLaborNote.staffInteractions, 11, false, 20);
    }
    
    if (activeLaborNote.additionalNotes) {
      addText('Additional Notes:', 12, true, 10);
      addText(activeLaborNote.additionalNotes, 11, false, 20);
    }
  }
  
  // Return PDF as blob
  return doc.output('blob');
};

export const generateBirthReportPDF = (client: ClientData): Blob => {
  const doc = new jsPDF();
  
  // Set up document properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 30;
  
  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, bold: boolean = false, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    doc.text(lines, margin + indent, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
    
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPosition = 30;
    }
  };
  
  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    yPosition += 5;
    addText(title, 14, true);
    yPosition += 5;
  };
  
  // Helper function to add a field with label and value
  const addField = (label: string, value?: string) => {
    if (!value || value === "Not recorded") return;
    addText(`${label}: ${value}`, 11, false, 10);
  };
  
  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not recorded";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };
  
  // Helper function to format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "Not recorded";
    try {
      return new Date(dateString).toLocaleTimeString();
    } catch {
      return dateString;
    }
  };
  
  // Header
  addText('BIRTH REPORT', 18, true);
  yPosition += 5;
  addText(client.name, 14, false);
  if (client.deliveryDate) {
    addText(formatDate(client.deliveryDate), 12, false);
  }
  yPosition += 10;
  
  // Birth Stats
  addSectionHeader('Birth Stats');
  if (client.deliveryDate) {
    addField('Time', formatTime(client.deliveryDate));
  }
  addField('Weight', client.deliveryWeight);
  addField('Length', client.deliveryLength);
  addField('Head Circumference', client.deliveryHeadCircumference);
  
  // Additional Birth Information
  if (client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss || client.umbilicalCordCondition || client.parentalDeliveryPosition || client.babyBirthPosition) {
    addSectionHeader('Additional Birth Information');
    addField('APGAR 1 Min', client.apgar1Min);
    addField('APGAR 5 Min', client.apgar5Min);
    addField('Estimated Blood Loss (EBL)', client.estimatedBloodLoss);
    addField('Umbilical Cord Condition', client.umbilicalCordCondition);
    addField('Parental Delivery Position', client.parentalDeliveryPosition);
    addField('Baby Birth Position', client.babyBirthPosition);
  }
  
  // Postpartum Notes
  if (client.postpartumNotes) {
    addSectionHeader('Postpartum Notes');
    addText('General Recovery Notes:', 12, true, 10);
    addText(client.postpartumNotes, 11, false, 20);
  }
  
  // Pericare + Physical Recovery
  if (client.pericareNotes) {
    addSectionHeader('Pericare + Physical Recovery Notes');
    addText('Recovery Details:', 12, true, 10);
    addText(client.pericareNotes, 11, false, 20);
  }
  
  // Immediate Postpartum Care
  if (client.immediatePostpartumCare) {
    addSectionHeader('Immediate Postpartum Care & Recommendations');
    addText('Care Provided:', 12, true, 10);
    addText(client.immediatePostpartumCare, 11, false, 20);
  }
  
  // Infant Care and Wellness
  if (client.feedingMethod || client.initialFeedingTime || client.latchQuality || client.feedingNotes || client.babyBehaviorObservations) {
    addSectionHeader('Infant Care and Wellness');
    
    // Feeding Info
    if (client.feedingMethod) {
      addField('Feeding Method', client.feedingMethod.charAt(0).toUpperCase() + client.feedingMethod.slice(1));
    }
    addField('Initial Feeding Time', client.initialFeedingTime);
    addField('Latch Quality/Concerns', client.latchQuality);
    
    // Feeding Notes
    if (client.feedingNotes) {
      addText('Feeding Notes:', 12, true, 10);
      addText(client.feedingNotes, 11, false, 20);
    }
    
    // Baby Behavior
    if (client.babyBehaviorObservations) {
      addText('Observed Baby Cues or Behaviors:', 12, true, 10);
      addText(client.babyBehaviorObservations, 11, false, 20);
    }
  }
  
  // Return PDF as blob
  return doc.output('blob');
};