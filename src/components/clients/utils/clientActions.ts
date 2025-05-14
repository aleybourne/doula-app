
import { ClientData } from '../types/ClientTypes';
import { clients } from '../store/clientStore';

export function getClientInfo(clientName: string, clients: ClientData[]): ClientData | undefined {
  const decodedClientName = decodeURIComponent(clientName);
  
  // First try exact match
  let clientData = clients.find(client => client.name === decodedClientName);
  
  // If not found, try normalized version
  if (!clientData) {
    const normalizedSearchName = decodedClientName.replace(/\s+/g, ' ').trim();
    clientData = clients.find(client => {
      const normalizedClientName = client.name.replace(/\s+/g, ' ').trim();
      return normalizedClientName === normalizedSearchName;
    });
  }
  
  return clientData;
}

// Calculate gestation weeks based on due date
export function calculateGestationAndTrimester(dueDateISO: string) {
  // Current date
  const currentDate = new Date();
  // Due date
  const dueDate = new Date(dueDateISO);
  
  // Calculate difference in milliseconds
  const differenceMs = dueDate.getTime() - currentDate.getTime();
  const differenceWeeks = Math.ceil(differenceMs / (1000 * 3600 * 24 * 7));
  
  // Calculate total gestation (normally 40 weeks)
  const gestationWeeks = 40 - differenceWeeks;
  
  // Determine trimester
  let trimester = "";
  if (gestationWeeks <= 0) {
    return { 
      gestation: "Not yet pregnant", 
      trimester: "", 
      progress: 0,
      isPastDue: false 
    };
  } else if (gestationWeeks <= 13) {
    trimester = "First Trimester";
  } else if (gestationWeeks <= 26) {
    trimester = "Second Trimester";
  } else if (gestationWeeks <= 40) {
    trimester = "Third Trimester";
  } else {
    trimester = "Past Due";
  }
  
  // Calculate progress percentage (0-100)
  const progress = Math.min(Math.floor((gestationWeeks / 40) * 100), 100);
  
  // Format gestation string
  const gestation = gestationWeeks > 40 
    ? `${gestationWeeks - 40} weeks past due` 
    : `${gestationWeeks} weeks pregnant`;
  
  return {
    gestation,
    trimester,
    progress,
    isPastDue: gestationWeeks > 40
  };
}
