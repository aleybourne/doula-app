
import { differenceInDays, parseISO } from "date-fns";
import { ClientData } from "@/components/clients/types/ClientTypes";
import { calculateGestationAndTrimester } from "@/components/clients/utils/gestationUtils";

/**
 * Counts clients added within the last 3 weeks
 */
export const countNewClients = (clients: ClientData[]): number => {
  const today = new Date();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(today.getDate() - 21); // 3 weeks = 21 days
  
  const newClients = clients.filter(client => {
    // Skip past clients
    if (client.status === 'past') return false;
    
    // If client has a createdAt timestamp
    if (client.createdAt) {
      const createdDate = parseISO(client.createdAt);
      const dayDiff = differenceInDays(today, createdDate);
      const isNew = dayDiff <= 21;
      console.log(`Stats check: Client ${client.name} created ${dayDiff} days ago, isNew: ${isNew}`);
      return isNew;
    }
    
    // Fallback if no timestamp (consider all clients without timestamp as not new)
    console.log(`Stats check: Client ${client.name} has no createdAt timestamp, not counted as new`);
    return false;
  });
  
  console.log(`Stats: Found ${newClients.length} new clients (within last 21 days)`);
  if (newClients.length > 0) {
    console.log("New clients:", newClients.map(c => c.name));
  }
  return newClients.length;
};

/**
 * Counts clients beyond 30 weeks gestation (approaching birth)
 */
export const countUpcomingBirths = (clients: ClientData[]): number => {
  const upcomingBirths = clients.filter(client => {
    // Skip past clients
    if (client.status === 'past') {
      console.log(`Stats check: Client ${client.name} is past, not counted for upcoming births`);
      return false;
    }
    
    if (!client.dueDateISO) {
      console.log(`Stats check: Client ${client.name} has no due date, not counted for upcoming births`);
      return false;
    }
    
    // Calculate gestation
    const { gestation } = calculateGestationAndTrimester(client.dueDateISO, client.birthStage);
    
    // Parse the gestation string (format: "XXw+Yd")
    const weeks = parseInt(gestation.split('w')[0], 10);
    const isUpcoming = weeks >= 30;
    
    console.log(`Stats check: Client ${client.name} at ${gestation}, isUpcoming: ${isUpcoming}`);
    return isUpcoming;
  });
  
  console.log(`Stats: Found ${upcomingBirths.length} upcoming births (≥30 weeks)`);
  if (upcomingBirths.length > 0) {
    console.log("Upcoming birth clients:", upcomingBirths.map(c => c.name));
  }
  return upcomingBirths.length;
};

/**
 * Count total active clients
 */
export const countActiveClients = (clients: ClientData[]): number => {
  const activeClients = clients.filter(client => 
    client.status === 'active' || 
    !client.status
  );
  
  console.log(`Stats: Found ${activeClients.length} active clients`);
  return activeClients.length;
};
