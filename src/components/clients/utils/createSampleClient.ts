import { saveClientToFirestore } from '../store/firebase/firebaseUtils';
import { ClientData, Tag, BirthStage, ClientStatus } from '../types/ClientTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * CLIENT STATUS vs BIRTH STAGE CLARIFICATION:
 * 
 * status: "active" | "past" 
 * - Controls whether client appears in your active client list
 * - "active" = currently working with this client
 * - "past" = no longer working with this client (archived)
 * 
 * birthStage: "pregnant" | "active-labor" | "delivered"
 * - Tracks pregnancy/birth progress for active clients
 * - Used for dashboard stats and client progress tracking
 * - Independent of client management status
 */

export const createSampleClient = async (userId: string): Promise<ClientData> => {
  const clientId = `client-f33ee714-4e52-4683-a754-34fd1aa3f9de`;
  
  const sampleClient: ClientData = {
    id: clientId,
    userId: userId,
    name: "Sarah Johnson",
    dueDateISO: "2024-03-15T00:00:00.000Z",
    dueDateLabel: "March 15, 2024",
    image: "",
    email: "sarah.johnson@email.com", 
    phone: "(555) 123-4567",
    status: "active" as ClientStatus,
    birthStage: "pregnant" as BirthStage,
    notes: "First-time mother, very excited and nervous about the delivery process.",
    tags: [
      {
        id: "first-time-mom",
        label: "First Time Mom",
        description: "First pregnancy",
        color: "blue",
        checked: true
      },
      {
        id: "low-risk",
        label: "Low Risk",
        description: "Low risk pregnancy",
        color: "green", 
        checked: true
      }
    ] as Tag[],
    createdAt: new Date().toISOString()
  };

  console.log(`📝 Creating sample client with ID: ${clientId}`);
  console.log(`👤 User ID: ${userId}`);
  
  try {
    await saveClientToFirestore(sampleClient);
    console.log(`✅ Sample client created successfully`);
    return sampleClient;
  } catch (error) {
    console.error(`❌ Failed to create sample client:`, error);
    throw error;
  }
};

export const createMultipleSampleClients = async (userId: string): Promise<ClientData[]> => {
  const clients: ClientData[] = [
    {
      id: `client-f33ee714-4e52-4683-a754-34fd1aa3f9de`,
      userId,
      name: "Sarah Johnson",
      dueDateISO: "2024-03-15T00:00:00.000Z",
      dueDateLabel: "March 15, 2024",
      image: "",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      status: "active" as ClientStatus,
      birthStage: "pregnant" as BirthStage,
      notes: "First-time mother, very excited about delivery.",
      tags: [
        {
          id: "first-time-mom",
          label: "First Time Mom", 
          description: "First pregnancy",
          color: "blue",
          checked: true
        },
        {
          id: "low-risk",
          label: "Low Risk",
          description: "Low risk pregnancy", 
          color: "green",
          checked: true
        }
      ] as Tag[],
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId,
      name: "Maria Garcia",
      dueDateISO: "2024-04-20T00:00:00.000Z",
      dueDateLabel: "April 20, 2024",
      image: "",
      email: "maria.garcia@email.com", 
      phone: "(555) 234-5678",
      status: "active" as ClientStatus,
      birthStage: "active-labor" as BirthStage,
      laborStartTime: new Date().toISOString(),
      notes: "Second pregnancy, currently in active labor.",
      tags: [
        {
          id: "second-pregnancy",
          label: "Second Pregnancy",
          description: "Has given birth before",
          color: "purple",
          checked: true
        },
        {
          id: "gestational-diabetes",
          label: "Gestational Diabetes",
          description: "Controlled gestational diabetes",
          color: "orange",
          checked: true
        }
      ] as Tag[],
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId,
      name: "Emily Chen",
      dueDateISO: "2024-02-10T00:00:00.000Z",
      dueDateLabel: "February 10, 2024",
      image: "",
      email: "emily.chen@email.com",
      phone: "(555) 345-6789", 
      status: "active" as ClientStatus, // FIXED: Changed from "past" to "active" so all clients appear in active list
      birthStage: "delivered" as BirthStage, // birthStage tracks pregnancy progress separately
      deliveryTime: "2024-02-08T14:30:00Z",
      deliveryWeight: "7 lbs 3 oz",
      deliveryLength: "19 inches",
      deliveryHeadCircumference: "13.5 inches",
      notes: "Healthy delivery, recovering well postpartum.",
      tags: [
        {
          id: "delivered",
          label: "Delivered",
          description: "Successfully delivered",
          color: "green",
          checked: true
        },
        {
          id: "healthy-delivery",
          label: "Healthy Delivery",
          description: "No complications during delivery",
          color: "emerald",
          checked: true
        }
      ] as Tag[],
      createdAt: new Date().toISOString()
    }
  ];

  console.log(`📝 Creating ${clients.length} sample clients for user: ${userId}`);
  
  try {
    const savedClients = [];
    for (const client of clients) {
      await saveClientToFirestore(client);
      savedClients.push(client);
      console.log(`✅ Created client: ${client.name} (${client.birthStage})`);
    }
    
    console.log(`🎉 All sample clients created successfully`);
    return savedClients;
  } catch (error) {
    console.error(`❌ Failed to create sample clients:`, error);
    throw error;
  }
};