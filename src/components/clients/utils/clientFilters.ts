
import { ClientData, ClientStatus } from '../types/ClientTypes';
import { differenceInWeeks, isAfter, parseISO } from 'date-fns';
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
          console.log(`Client ${client.name} has no createdAt timestamp`);
          return false;
        }
        
        const createDate = parseISO(client.createdAt);
        const weeksDiff = differenceInWeeks(now, createDate);
        const isNew = weeksDiff <= 3;
        
        console.log(`Client ${client.name} created at ${client.createdAt}, weeks diff: ${weeksDiff}, isNew: ${isNew}`);
        
        return isNew;
      });
      
      console.log(`New clients filter found ${newClients.length} clients:`, newClients.map(c => c.name));
      return newClients;
      
    case 'upcoming':
      // Clients with due dates approaching (30+ weeks pregnant)
      return userClients.filter(client => {
        if (!client.dueDateISO) return false;
        const dueDate = parseISO(client.dueDateISO);
        // If due date is in the future
        if (isAfter(dueDate, now)) {
          const weeksToDue = differenceInWeeks(dueDate, now);
          // Less than 10 weeks to due date (i.e., 30+ weeks pregnant in a 40-week pregnancy)
          return weeksToDue <= 10;
        }
        return false;
      });
      
    default:
      return userClients;
  }
}
