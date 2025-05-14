import { ClientData } from '../types/ClientTypes';
import { clients, notifyClientsChanged } from './clientStore';
import { addWeeks } from 'date-fns';
import { POSTPARTUM_WEEKS } from '../utils/gestationUtils';

export const addClient = (client: ClientData) => {
  if (!client.status) client.status = "active";
  if (!client.createdAt) {
    client.createdAt = new Date().toISOString();
  }
  clients.unshift(client);
  notifyClientsChanged();
};

export const updateClient = (updatedClient: ClientData) => {
  const clientIndex = clients.findIndex(client => client.name === updatedClient.name);
  if (clientIndex !== -1) {
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
  }
};

export const updateClientStatus = (clientName: string, status: ClientData['status'], reason: string): void => {
  const clientIndex = clients.findIndex(client => client.name === clientName);
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found`);
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
  const clientIndex = clients.findIndex(client => client.name === clientName);
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found`);
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
