import { TriageNote } from '@/components/clients/types/ClientTypes';

/**
 * Formats a triage note into readable markdown content for journal entries
 */
export const formatTriageNoteForJournal = (triageNote: TriageNote): string => {
  const formatOutcome = (outcome: string): string => {
    const outcomeMap: Record<string, string> = {
      'sent-home': 'Sent Home',
      'admitted': 'Admitted',
      'no-change': 'No Change',
      'other': 'Other'
    };
    return outcomeMap[outcome] || outcome;
  };

  const sections: string[] = [];

  if (triageNote.visitTime) {
    sections.push(`**Triage Visit Time:** ${triageNote.visitTime}`);
  }

  if (triageNote.location) {
    sections.push(`**Location:** ${triageNote.location}`);
  }

  if (triageNote.cervicalExam) {
    sections.push(`**Cervical Exam:** ${triageNote.cervicalExam}`);
  }

  if (triageNote.contractionsPattern) {
    sections.push(`**Contractions Pattern:** ${triageNote.contractionsPattern}`);
  }

  if (triageNote.clientCoping) {
    sections.push(`**Client Coping / Mental State:** ${triageNote.clientCoping}`);
  }

  if (triageNote.doulaSupport) {
    sections.push(`**Doula Support Provided:** ${triageNote.doulaSupport}`);
  }

  if (triageNote.outcome) {
    sections.push(`**Outcome:** ${formatOutcome(triageNote.outcome)}`);
  }

  if (triageNote.additionalNotes) {
    sections.push(`**Additional Notes:** ${triageNote.additionalNotes}`);
  }

  return sections.join('  \n');
};

/**
 * Generates a descriptive title for a triage note journal entry
 */
export const generateTriageNoteTitle = (triageNote: TriageNote): string => {
  if (triageNote.location) {
    return `Triage Note – ${triageNote.location}`;
  }
  
  if (triageNote.visitTime) {
    return `Triage Note – ${triageNote.visitTime}`;
  }
  
  const date = new Date(triageNote.timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `Triage Note – ${timeString}`;
};

/**
 * Maps triage note fields to active labor note fields for auto-population
 */
export const mapTriageToActiveLaborFields = (triageNote: TriageNote) => {
  return {
    admissionTime: triageNote.visitTime || '',
    hospitalLocation: triageNote.location || '',
    cervicalExam: triageNote.cervicalExam || '',
    contractionPattern: triageNote.contractionsPattern || '',
    clientEmotionalState: triageNote.clientCoping || '',
    supportOffered: triageNote.doulaSupport || '',
    additionalNotes: triageNote.additionalNotes || ''
  };
};