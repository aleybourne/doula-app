
export type ClientStatus = 'active' | 'past';
export type BirthLocationType = 'home' | 'hospital' | 'birthing-center' | 'TBD';
export type BirthType = 'vaginal' | 'c-section' | 'VBAC' | 'unsure';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type BirthStage = 'pregnant' | 'active-labor' | 'delivered';

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
  pregnancyStatus?: 'pregnant' | 'postpartum'; // Specific pregnancy status for dashboard view
  birthStage?: BirthStage; // Current birth stage for live status tracking
  laborStartTime?: string; // Timestamp when active labor stage begins
  deliveryTime?: string; // Timestamp when delivery is completed
  deliveryWeight?: string; // Baby's weight at delivery
  deliveryLength?: string; // Baby's length at delivery
  deliveryHeadCircumference?: string; // Baby's head circumference at delivery
  // Detailed Postpartum Notes
  apgar1Min?: string;
  apgar5Min?: string;
  babyInterventions?: string;
  estimatedBloodLoss?: string;
  umbilicalCordCondition?: string;
  parentalDeliveryPosition?: string;
  babyBirthPosition?: string;
  postpartumNotes?: string;
  pericareNotes?: string;
  immediatePostpartumCare?: string;
  feedingMethod?: 'breast' | 'pump' | 'formula';
  initialFeedingTime?: string;
  latchQuality?: string;
  feedingNotes?: string;
  babyBehaviorObservations?: string;
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
  referralSource?: string;
  notes?: string;
  tags?: Tag[]; // Add tags field to store client-specific tags
}

export type ClientChangeListener = () => void;
