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

// Format birth report for journal entry
export const formatBirthReportForJournal = (client: ClientData): string => {
  let content = `# Birth Report for ${client.name}\n\n`;
  
  // Birth Stats Section
  const hasBirthStats = client.deliveryDate || client.deliveryWeight || client.deliveryLength || client.deliveryHeadCircumference;
  if (hasBirthStats) {
    content += `## Birth Stats\n\n`;
    if (client.deliveryDate) {
      content += `**Delivery Date & Time:** ${formatDate(client.deliveryDate)} at ${formatTime(client.deliveryDate)}\n\n`;
    }
    if (client.deliveryWeight) {
      content += `**Weight:** ${client.deliveryWeight}\n\n`;
    }
    if (client.deliveryLength) {
      content += `**Length:** ${client.deliveryLength}\n\n`;
    }
    if (client.deliveryHeadCircumference) {
      content += `**Head Circumference:** ${client.deliveryHeadCircumference}\n\n`;
    }
  }

  // Additional Birth Information
  const hasAdditionalInfo = client.apgar1Min || client.apgar5Min || client.estimatedBloodLoss || client.umbilicalCordCondition || client.parentalDeliveryPosition || client.babyBirthPosition;
  if (hasAdditionalInfo) {
    content += `## Additional Birth Information\n\n`;
    if (client.apgar1Min) {
      content += `**APGAR 1 Min:** ${client.apgar1Min}\n\n`;
    }
    if (client.apgar5Min) {
      content += `**APGAR 5 Min:** ${client.apgar5Min}\n\n`;
    }
    if (client.estimatedBloodLoss) {
      content += `**Estimated Blood Loss:** ${client.estimatedBloodLoss}\n\n`;
    }
    if (client.umbilicalCordCondition) {
      content += `**Umbilical Cord Condition:** ${client.umbilicalCordCondition}\n\n`;
    }
    if (client.parentalDeliveryPosition) {
      content += `**Parental Delivery Position:** ${client.parentalDeliveryPosition}\n\n`;
    }
    if (client.babyBirthPosition) {
      content += `**Baby Birth Position:** ${client.babyBirthPosition}\n\n`;
    }
  }

  // Postpartum Notes
  if (client.postpartumNotes) {
    content += `## Postpartum Notes\n\n${client.postpartumNotes}\n\n`;
  }

  // Pericare Notes
  if (client.pericareNotes) {
    content += `## Pericare + Physical Recovery Notes\n\n${client.pericareNotes}\n\n`;
  }

  // Immediate Postpartum Care
  if (client.immediatePostpartumCare) {
    content += `## Immediate Postpartum Care & Recommendations\n\n${client.immediatePostpartumCare}\n\n`;
  }

  // Infant Care and Wellness
  const hasInfantCare = client.feedingMethod || client.initialFeedingTime || client.latchQuality || client.feedingNotes || client.babyBehaviorObservations;
  if (hasInfantCare) {
    content += `## Infant Care and Wellness\n\n`;
    if (client.feedingMethod) {
      content += `**Feeding Method:** ${client.feedingMethod.charAt(0).toUpperCase() + client.feedingMethod.slice(1)}\n\n`;
    }
    if (client.initialFeedingTime) {
      content += `**Initial Feeding Time:** ${client.initialFeedingTime}\n\n`;
    }
    if (client.latchQuality) {
      content += `**Latch Quality:** ${client.latchQuality}\n\n`;
    }
    if (client.feedingNotes) {
      content += `**Feeding Notes:** ${client.feedingNotes}\n\n`;
    }
    if (client.babyBehaviorObservations) {
      content += `**Baby Behavior Observations:** ${client.babyBehaviorObservations}\n\n`;
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