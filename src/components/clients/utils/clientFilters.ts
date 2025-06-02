
import { ClientData, ClientStatus } from '../types/ClientTypes';
import { differenceInWeeks, isAfter, parseISO, isValid } from 'date-fns';
import { getCurrentUserId } from '../store/clientStore';

// Filter clients based on different criteria
export function filterClientsByType(clients: ClientData[] = [], filter?: string | null): ClientData[] {
  if (!clients || clients.length === 0) {
    return [];
  }
  
  const userId = getCurrentUserId();
  
  // First, filter by user ID
  const userClients = userId ? clients.filter(client => client.userId === userId) : [];
  
  console.log(`filterClientsByType: Processing ${userClients.length} clients for user ${userId || 'unknown'} with filter: ${filter || 'none'}`);
  
  if (!filter) return userClients;
  
  const now = new Date();
  
  switch (filter) {
    case 'new':
      // Clients added in the last 3 weeks
      const newClients = userClients.filter(client => {
        if (!client.createdAt) {
          console.log(`Client ${client.name} has no createdAt timestamp, checking if recently added`);
          // If no createdAt, assume it's an old client
          return false;
        }
        
        try {
          const createDate = parseISO(client.createdAt);
          if (!isValid(createDate)) {
            console.log(`Client ${client.name} has invalid createdAt timestamp: ${client.createdAt}`);
            return false;
          }
          
          const weeksDiff = differenceInWeeks(now, createDate);
          const isNew = weeksDiff <= 3;
          
          console.log(`Client ${client.name} created at ${client.createdAt}, weeks diff: ${weeksDiff}, isNew: ${isNew}`);
          
          return isNew;
        } catch (error) {
          console.error(`Error parsing createdAt for client ${client.name}:`, error);
          return false;
        }
      });
      
      console.log(`New clients filter found ${newClients.length} clients:`, newClients.map(c => ({ name: c.name, createdAt: c.createdAt })));
      return newClients;
      
    case 'upcoming':
      // Clients with due dates approaching (30+ weeks pregnant)
      return userClients.filter(client => {
        if (!client.dueDateISO) return false;
        
        try {
          const dueDate = parseISO(client.dueDateISO);
          if (!isValid(dueDate)) return false;
          
          // If due date is in the future
          if (isAfter(dueDate, now)) {
            const weeksToDue = differenceInWeeks(dueDate, now);
            // Less than 10 weeks to due date (i.e., 30+ weeks pregnant in a 40-week pregnancy)
            return weeksToDue <= 10;
          }
          return false;
        } catch (error) {
          console.error(`Error parsing due date for client ${client.name}:`, error);
          return false;
        }
      });
      
    default:
      return userClients;
  }
}
