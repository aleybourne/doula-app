
export type ClientStatus = 'active' | 'inquiry' | 'past' | 'on-hold' | 'archived' | 'deleted' | 'delivered';
export type BirthLocationType = 'home' | 'hospital' | 'birthing-center' | 'TBD';
export type BirthType = 'vaginal' | 'c-section' | 'VBAC' | 'unsure';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface ClientData {
  id: string;  // Unique identifier
  name: string;
  dueDateISO: string;
  dueDateLabel: string;
  image: string;
  accent?: string;
  status?: ClientStatus;
  statusReason?: string;
  statusDate?: string;
  postpartumDate?: string;
  deliveryDate?: string; // New field to track when client delivered
  createdAt?: string; // Timestamp of when client was created
  userId?: string; // ID of the user who owns this client
  preferredName?: string;
  pronouns?: string;
  phone?: string;
  email?: string;
  careProvider?: string;
  birthLocation?: BirthLocationType;
  birthTypes?: BirthType[];
  packageSelected?: string;
  contractSigned?: boolean;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

export type ClientChangeListener = () => void;
