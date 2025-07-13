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