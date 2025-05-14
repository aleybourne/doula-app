import { ClientData, ClientChangeListener } from '../types/ClientTypes';

const defaultClients: ClientData[] = [
  {
    name: "Benita Mendez",
    dueDateISO: "2025-08-07",
    dueDateLabel: "August 7th, 2025",
    image: "/lovable-uploads/e9d97597-731d-448a-851d-a7aa29638d42.png",
    status: "active",
    createdAt: "2025-04-07T00:00:00.000Z",
  },
  {
    name: "Sam Williams",
    dueDateISO: "2025-10-16",
    dueDateLabel: "October 16th, 2025",
    image: "/lovable-uploads/22335ae2-dde6-4f2a-8c5e-4126a65f2590.png",
    status: "active",
    createdAt: "2025-01-14T00:00:00.000Z",
  },
  {
    name: "Julie Hill",
    dueDateISO: "2025-06-19",
    dueDateLabel: "June 19th, 2025",
    image: "/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png",
    status: "active",
    createdAt: "2025-04-15T00:00:00.000Z",
  },
  {
    name: "Jasmine Jones",
    dueDateISO: "2025-05-15",
    dueDateLabel: "May 15th, 2025",
    image: "/lovable-uploads/edc4d06e-95d5-4730-b269-d713d7bd57f1.png",
    status: "active",
    createdAt: "2025-04-01T00:00:00.000Z",
  },
  {
    name: "Jane Miller",
    dueDateISO: "2025-03-19",
    dueDateLabel: "March 19th, 2025",
    image: "/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png",
    status: "delivered",
    deliveryDate: "2025-03-19T00:00:00.000Z",
    postpartumDate: "2025-05-14T00:00:00.000Z",
    statusDate: "2025-03-19T00:00:00.000Z",
    createdAt: "2025-02-19T00:00:00.000Z",
  },
  {
    name: "Austin Leybourne",
    dueDateISO: "2025-10-24",
    dueDateLabel: "October 24th, 2025",
    image: "/lovable-uploads/eb028e8e-c38f-4206-ac0d-192b345b0b66.png",
    status: "active",
    createdAt: "2025-03-24T00:00:00.000Z",
  }
];

const testClients: ClientData[] = [
  {
    name: "Ava Thompson",
    dueDateISO: "2025-08-10",
    dueDateLabel: "August 10th, 2025",
    image: "/lovable-uploads/ava.png",
    status: "active",
    createdAt: "2025-05-14T00:00:00.000Z"
  },
  {
    name: "Maya Robinson",
    dueDateISO: "2025-06-28",
    dueDateLabel: "June 28th, 2025",
    image: "/lovable-uploads/maya.png",
    status: "active",
    createdAt: "2025-04-01T00:00:00.000Z"
  },
  {
    name: "Olivia Martinez",
    dueDateISO: "2025-10-01",
    dueDateLabel: "October 1st, 2025",
    image: "/lovable-uploads/olivia.png",
    status: "archived",
    createdAt: "2025-03-01T00:00:00.000Z"
  },
  {
    name: "Ella Parker",
    dueDateISO: "2025-09-01",
    dueDateLabel: "September 1st, 2025",
    image: "/lovable-uploads/ella.png",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z"
  }
];

const USE_TEST_CLIENTS = true;

const loadSet = USE_TEST_CLIENTS ? testClients : defaultClients;

export const initializeClients = (): ClientData[] => {
  try {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      const parsedClients = JSON.parse(savedClients);
      return parsedClients.length > 0 ? parsedClients : loadSet;
    }
  } catch (error) {
    console.error("Failed to load clients from localStorage:", error);
  }
  return [...loadSet];
};

export const clients: ClientData[] = initializeClients();

export const saveClientsToStorage = () => {
  try {
    localStorage.setItem('clients', JSON.stringify(clients));
  } catch (error) {
    console.error("Failed to save clients to localStorage:", error);
  }
};

export const clientsChangeListeners: Array<ClientChangeListener> = [];

export const notifyClientsChanged = () => {
  saveClientsToStorage();
  clientsChangeListeners.forEach(listener => listener());
};

export const subscribeToClientChanges = (callback: ClientChangeListener): (() => void) => {
  clientsChangeListeners.push(callback);
  return () => {
    const index = clientsChangeListeners.indexOf(callback);
    if (index !== -1) {
      clientsChangeListeners.splice(index, 1);
    }
  };
};


