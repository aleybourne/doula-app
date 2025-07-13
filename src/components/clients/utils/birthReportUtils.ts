import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ClientData, JournalEntry } from '../types/ClientTypes';

// Helper function to format date strings
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'PPP');
  } catch {
    return dateString;
  }
};

// Helper function to format time strings
const formatTime = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'p');
  } catch {
    return dateString;
  }
};

// Check if client has any birth data to report
export const hasAnyBirthData = (client: ClientData): boolean => {
  return !!(
    client.deliveryDate ||
    client.deliveryWeight ||
    client.deliveryLength ||
    client.deliveryHeadCircumference ||
    client.apgar1Min ||
    client.apgar5Min ||
    client.estimatedBloodLoss ||
    client.umbilicalCordCondition ||
    client.parentalDeliveryPosition ||
    client.babyBirthPosition ||
    client.postpartumNotes ||
    client.pericareNotes ||
    client.immediatePostpartumCare ||
    client.feedingMethod ||
    client.initialFeedingTime ||
    client.latchQuality ||
    client.feedingNotes ||
    client.babyBehaviorObservations
  );
};

// Format birth report for journal entry (as HTML)
export const formatBirthReportForJournal = (client: ClientData): string => {
  let content = `<h1>Birth Report for ${client.name}</h1>`;
  
  // Birth Stats Section
  const hasBirthStats = client.deliveryDate || client.deliveryWeight || client.deliveryLength || client.deliveryHeadCircumference;
  if (hasBirthStats) {
    content += `<h2>Birth Stats</h2>`;
    if (client.deliveryDate) {
      content += `<p><strong>Delivery Date & Time:</strong> ${formatDate(client.deliveryDate)} at ${formatTime(client.deliveryDate)}</p>`;
    }
    if (client.deliveryWeight) {
      content += `<p><strong>Weight:</strong> ${client.deliveryWeight}</p>`;
    }
    if (client.deliveryLength) {
      content += `<p><strong>Length:</strong> ${client.deliveryLength}</p>`;
    }
    if (client.deliveryHeadCircumference) {
      content += `<p><strong>Head Circumference:</strong> ${client.deliveryHeadCircumference}</p>`;
    }
  }

  // Additional Birth Information
  const hasAdditionalInfo = client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss || client.umbilicalCordCondition || client.parentalDeliveryPosition || client.babyBirthPosition;
  if (hasAdditionalInfo) {
    content += `<h2>Additional Birth Information</h2>`;
    if (client.apgar1Min) {
      content += `<p><strong>APGAR 1 Min:</strong> ${client.apgar1Min}</p>`;
    }
    if (client.apgar5Min) {
      content += `<p><strong>APGAR 5 Min:</strong> ${client.apgar5Min}</p>`;
    }
    if (client.estimatedBloodLoss) {
      content += `<p><strong>Estimated Blood Loss:</strong> ${client.estimatedBloodLoss}</p>`;
    }
    if (client.umbilicalCordCondition) {
      content += `<p><strong>Umbilical Cord Condition:</strong> ${client.umbilicalCordCondition}</p>`;
    }
    if (client.parentalDeliveryPosition) {
      content += `<p><strong>Parental Delivery Position:</strong> ${client.parentalDeliveryPosition}</p>`;
    }
    if (client.babyBirthPosition) {
      content += `<p><strong>Baby Birth Position:</strong> ${client.babyBirthPosition}</p>`;
    }
  }

  // Postpartum Notes
  if (client.postpartumNotes) {
    content += `<h2>Postpartum Notes</h2><p>${client.postpartumNotes}</p>`;
  }

  // Pericare Notes
  if (client.pericareNotes) {
    content += `<h2>Pericare + Physical Recovery Notes</h2><p>${client.pericareNotes}</p>`;
  }

  // Immediate Postpartum Care
  if (client.immediatePostpartumCare) {
    content += `<h2>Immediate Postpartum Care & Recommendations</h2><p>${client.immediatePostpartumCare}</p>`;
  }

  // Infant Care and Wellness
  const hasInfantCare = client.feedingMethod || client.initialFeedingTime || client.latchQuality || client.feedingNotes || client.babyBehaviorObservations;
  if (hasInfantCare) {
    content += `<h2>Infant Care and Wellness</h2>`;
    if (client.feedingMethod) {
      content += `<p><strong>Feeding Method:</strong> ${client.feedingMethod.charAt(0).toUpperCase() + client.feedingMethod.slice(1)}</p>`;
    }
    if (client.initialFeedingTime) {
      content += `<p><strong>Initial Feeding Time:</strong> ${client.initialFeedingTime}</p>`;
    }
    if (client.latchQuality) {
      content += `<p><strong>Latch Quality:</strong> ${client.latchQuality}</p>`;
    }
    if (client.feedingNotes) {
      content += `<p><strong>Feeding Notes:</strong> ${client.feedingNotes}</p>`;
    }
    if (client.babyBehaviorObservations) {
      content += `<p><strong>Baby Behavior Observations:</strong> ${client.babyBehaviorObservations}</p>`;
    }
  }

  return content;
};

// Create a journal entry for the birth report
export const createBirthReportJournalEntry = (client: ClientData): JournalEntry => {
  const currentDate = new Date().toISOString();
  const reportDate = client.deliveryDate ? formatDate(client.deliveryDate) : format(new Date(), 'PPP');
  
  return {
    id: uuidv4(),
    title: `Birth Report - ${client.name} - ${reportDate}`,
    content: formatBirthReportForJournal(client),
    timestamp: currentDate,
    isPinned: false,
    category: 'postpartum'
  };
};