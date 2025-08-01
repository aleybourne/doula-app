
import { ClientData, ClientStatus } from '../types/ClientTypes';
import { differenceInWeeks, isAfter, parseISO, isValid } from 'date-fns';
import { getCurrentUserId } from '../store/clientStore';

// Filter clients based on different criteria
export function filterClientsByType(clients: ClientData[] = [], filter?: string | null): ClientData[] {
  console.log(`=== filterClientsByType START ===`);
  console.log(`Input: ${clients?.length || 0} clients, filter: ${filter || 'none'}`);
  
  if (!clients || clients.length === 0) {
    console.log(`filterClientsByType: No clients provided, returning empty array`);
    return [];
  }
  
  const userId = getCurrentUserId();
  console.log(`filterClientsByType: Current user ID: ${userId}`);
  
  // First, filter by user ID
  const userClients = userId ? clients.filter(client => {
    const belongsToUser = client.userId === userId;
    if (!belongsToUser) {
      console.log(`Client ${client.name} belongs to ${client.userId}, not current user ${userId}`);
    }
    return belongsToUser;
  }) : [];
  
  console.log(`filterClientsByType: Found ${userClients.length} clients for user ${userId}`);
  userClients.forEach(client => {
    console.log(`User client: ${client.name} (ID: ${client.id}, status: ${client.status || 'undefined'})`);
  });
  
  if (!filter) {
    console.log(`filterClientsByType: No filter applied, returning ${userClients.length} user clients`);
    return userClients;
  }
  
  const now = new Date();
  console.log(`filterClientsByType: Applying filter "${filter}" with current date: ${now.toISOString()}`);
  
  switch (filter) {
    case 'new':
      console.log(`=== NEW CLIENTS FILTER ===`);
      // Clients added in the last week (excluding past/retired clients)
      const newClients = userClients.filter(client => {
        console.log(`Checking client ${client.name} for "new" filter:`);
        console.log(`  - createdAt: ${client.createdAt || 'undefined'}`);
        console.log(`  - status: ${client.status || 'undefined'}`);
        
        // Exclude past/retired clients
        if (client.status === 'past') {
          console.log(`  - Client is past/retired, excluding from new clients`);
          return false;
        }
        
        if (!client.createdAt) {
          console.log(`  - No createdAt timestamp, excluding from new clients`);
          return false;
        }
        
        try {
          const createDate = parseISO(client.createdAt);
          if (!isValid(createDate)) {
            console.log(`  - Invalid createdAt timestamp: ${client.createdAt}`);
            return false;
          }
          
          const weeksDiff = differenceInWeeks(now, createDate);
          const isNew = weeksDiff <= 1;
          
          console.log(`  - Created: ${client.createdAt}`);
          console.log(`  - Parsed date: ${createDate.toISOString()}`);
          console.log(`  - Weeks difference: ${weeksDiff}`);
          console.log(`  - Is new: ${isNew}`);
          
          return isNew;
        } catch (error) {
          console.error(`  - Error parsing createdAt for client ${client.name}:`, error);
          return false;
        }
      });
      
      console.log(`NEW CLIENTS RESULT: ${newClients.length} clients found`);
      newClients.forEach(client => {
        console.log(`  - ${client.name} (created: ${client.createdAt})`);
      });
      console.log(`=== NEW CLIENTS FILTER END ===`);
      return newClients;
      
    case 'upcoming':
      console.log(`=== UPCOMING BIRTHS FILTER ===`);
      // Clients with due dates approaching (30+ weeks pregnant)
      const upcomingClients = userClients.filter(client => {
        console.log(`Checking client ${client.name} for upcoming births:`);
        
        if (!client.dueDateISO) {
          console.log(`  - No due date, excluding`);
          return false;
        }
        
        try {
          const dueDate = parseISO(client.dueDateISO);
          if (!isValid(dueDate)) {
            console.log(`  - Invalid due date: ${client.dueDateISO}`);
            return false;
          }
          
          console.log(`  - Due date: ${dueDate.toISOString()}`);
          console.log(`  - Current date: ${now.toISOString()}`);
          
          // If due date is in the future
          if (isAfter(dueDate, now)) {
            const weeksToDue = differenceInWeeks(dueDate, now);
            // Less than 10 weeks to due date (i.e., 30+ weeks pregnant in a 40-week pregnancy)
            const isUpcoming = weeksToDue <= 10;
            
            console.log(`  - Weeks to due: ${weeksToDue}`);
            console.log(`  - Is upcoming: ${isUpcoming}`);
            
            return isUpcoming;
          } else {
            console.log(`  - Due date is in the past, excluding`);
            return false;
          }
        } catch (error) {
          console.error(`Error parsing due date for client ${client.name}:`, error);
          return false;
        }
      });
      
      console.log(`UPCOMING BIRTHS RESULT: ${upcomingClients.length} clients found`);
      upcomingClients.forEach(client => {
        console.log(`  - ${client.name} (due: ${client.dueDateISO})`);
      });
      console.log(`=== UPCOMING BIRTHS FILTER END ===`);
      return upcomingClients;
      
    default:
      console.log(`filterClientsByType: Unknown filter "${filter}", returning all user clients`);
      return userClients;
  }
}
