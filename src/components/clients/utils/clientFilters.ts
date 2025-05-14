import { ClientData } from '../types/ClientTypes';
import { differenceInDays, parseISO } from 'date-fns';
import { calculateGestationAndTrimester } from './gestationUtils';

export function filterClientsByType(
  clients: ClientData[],
  filter?: string | null
): ClientData[] {
  if (!filter) return clients;

  const today = new Date();

  if (filter === "new") {
    return clients.filter(client => {
      if (client.status === 'archived' || client.status === 'deleted') return false;
      if (!client.createdAt) return false;

      const createdDate = parseISO(client.createdAt);
      const dayDiff = differenceInDays(today, createdDate);
      return dayDiff <= 21;
    });
  }

  if (filter === "upcoming") {
    return clients.filter(client => {
      if (
        client.status === 'archived' ||
        client.status === 'deleted' ||
        client.status === 'delivered'
      ) return false;

      if (!client.dueDateISO) return false;

      const { gestation } = calculateGestationAndTrimester(client.dueDateISO, client.status);
      const weeks = parseInt(gestation.split('w')[0], 10);
      return weeks >= 30;
    });
  }

  if (filter === "active") {
    return clients.filter(client =>
      client.status !== "archived" &&
      client.status !== "deleted" &&
      client.status !== "delivered"
    );
  }

  return clients;
}
