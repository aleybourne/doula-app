
import { ClientData } from '../types/ClientTypes';
import { differenceInDays, parseISO } from 'date-fns';
import { calculateGestationAndTrimester } from "./gestationUtils";

/**
 * Centralized client filtering function used by both stats and client list
 */
export function filterClientsByType(
  clients: ClientData[],
  filter?: string | null
): ClientData[] {
  if (!filter) {
    return clients;
  }
  
  console.log(`filterClientsByType: applying ${filter} filter to ${clients.length} clients`);
  
  const today = new Date();
  
  if (filter === "new") {
    // Filter to clients created in the last 21 days
    return clients.filter(client => {
      // Skip archived clients
      if (client.status === 'archived' || client.status === 'deleted') {
        return false;
      }
      
      if (!client.createdAt) {
        console.log(`Client ${client.name} has no createdAt date, excluding from new clients`);
        return false;
      }
      
      const createdDate = parseISO(client.createdAt);
      const dayDiff = differenceInDays(today, createdDate);
      const isNew = dayDiff <= 21;
      console.log(`Client ${client.name}: created ${dayDiff} days ago, isNew: ${isNew}`);
      return isNew;
    });
  } 
  
  if (filter === "upcoming") {
    // Filter to clients with 30+ weeks gestation
    return clients.filter(client => {
      // Skip archived and delivered clients
      if (client.status === 'archived' || client.status === 'deleted' || client.status === 'delivered') {
        return false;
      }
      
      if (!client.dueDateISO) {
        return false;
      }
      
      const { gestation } = calculateGestationAndTrimester(client.dueDateISO, client.status);
      
      // Parse the gestation string (format: "XXw+Yd")
      const weeks = parseInt(gestation.split('w')[0], 10);
      const isUpcoming = weeks >= 30;
      
      console.log(`Client ${client.name}: at ${gestation}, isUpcoming: ${isUpcoming}`);
      return isUpcoming;
    });
  }
  
  // Return all clients if filter type is not recognized
  return clients;
}
