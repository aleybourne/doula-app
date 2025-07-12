
export type ClientStatus = 'active' | 'past';
export type BirthLocationType = 'home' | 'hospital' | 'birthing-center' | 'TBD';
export type BirthType = 'vaginal' | 'c-section' | 'VBAC' | 'unsure';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Tag {
  id: string;
  label: string;
  description: string;
  color: string;
  checked: boolean;
}

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
  tags?: Tag[]; // Add tags field to store client-specific tags
}

export type ClientChangeListener = () => void;
