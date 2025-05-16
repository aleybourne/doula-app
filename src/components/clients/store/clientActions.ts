import { ClientData } from '../types/ClientTypes';
import { clients, notifyClientsChanged, getCurrentUserId } from './clientStore';
import { addWeeks } from 'date-fns';
import { POSTPARTUM_WEEKS } from '../utils/gestationUtils';

export const addClient = (client: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot add client - user not logged in");
    return;
  }
  
  // Ensure the client has the current user's ID
  if (!client.status) client.status = "active";
  if (!client.createdAt) {
    client.createdAt = new Date().toISOString();
  }
  client.userId = userId;
  
  clients.unshift(client);
  notifyClientsChanged();
};

export const updateClient = (updatedClient: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot update client - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.name === updatedClient.name && client.userId === userId
  );
  
  if (clientIndex !== -1) {
    // Ensure we keep the userId in the updated client
    clients[clientIndex] = {
      ...updatedClient,
      userId
    };
    notifyClientsChanged();
  } else {
    console.warn(`Client ${updatedClient.name} not found or doesn't belong to current user`);
  }
};

export const updateClientStatus = (clientName: string, status: ClientData['status'], reason: string): void => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot update client status - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.name === clientName && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found or doesn't belong to current user`);
    return;
  }
  
  const currentDate = new Date();
  clients[clientIndex] = {
    ...clients[clientIndex],
    status,
    statusReason: reason,
    statusDate: currentDate.toISOString(),
  };
  
  if (status === 'archived') {
    const dueDate = new Date(clients[clientIndex].dueDateISO);
    const postpartumEndDate = new Date(dueDate);
    postpartumEndDate.setDate(dueDate.getDate() + 42);
    clients[clientIndex].postpartumDate = postpartumEndDate.toISOString();
  }
  
  notifyClientsChanged();
};

export const markClientDelivered = (clientName: string, deliveryDate: Date) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot mark client delivered - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.name === clientName && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found or doesn't belong to current user`);
    return;
  }
  
  const postpartumEndDate = addWeeks(deliveryDate, POSTPARTUM_WEEKS);
  
  clients[clientIndex] = {
    ...clients[clientIndex],
    status: 'delivered',
    statusReason: 'Client has delivered',
    statusDate: new Date().toISOString(),
    deliveryDate: deliveryDate.toISOString(),
    postpartumDate: postpartumEndDate.toISOString(),
  };
  
  notifyClientsChanged();
};

export const archiveClient = (clientName: string, reason: string) => {
  updateClientStatus(clientName, 'archived', reason);
};

export const deleteClient = (clientName: string, reason: string) => {
  updateClientStatus(clientName, 'deleted', reason);
};

export const restoreClient = (clientName: string) => {
  updateClientStatus(clientName, 'active', 'Restored from archive');
};
