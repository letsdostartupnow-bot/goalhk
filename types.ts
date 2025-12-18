
export enum UserRole {
  USER = 'USER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum TaskStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  MODE_SELECTION = 'MODE_SELECTION', // Choosing between DIY, Pro, Quick, etc.
  AWAITING_BIDS = 'AWAITING_BIDS', // NEW: Waiting for multiple providers to quote
  PROVIDER_SELECTION = 'PROVIDER_SELECTION',
  NEGOTIATING = 'NEGOTIATING', // Quoting
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ServiceMode {
  id: string;
  name: string; // e.g., "緊急維修 (Individual)", "專業公司 (Company)", "視像指導 (DIY)"
  description: string;
  estimatedPrice: string;
  estimatedTime: string;
  icon: string;
  isBidding?: boolean; // NEW: Triggers multi-bid flow
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  type: 'INDIVIDUAL' | 'COMPANY' | 'AI_AGENT';
  rating: number;
  distance: string;
  coordinates: Coordinates;
  badges: string[]; // e.g., "Verified", "Insured"
  isAvailable: boolean;
  basePrice: number;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: 'LABOR' | 'MATERIAL' | 'FEE' | 'INSURANCE';
}

export interface Quote {
  id: string;
  taskId: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string; // NEW: To show in bid card
  providerRating?: number; // NEW: To show in bid card
  items: QuoteItem[];
  total: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'PAID' | 'ESCROW_HELD';
  createdAt: string;
}

export interface TaskStep {
  id: string;
  title: string;
  status: 'PENDING' | 'ACTIVE' | 'DONE';
  action?: string; // e.g., "OPEN_CAMERA", "PAY_DEPOSIT"
}

export interface Task {
  id: string;
  userId: string;
  description: string;
  category: string; // e.g., "HOME_REPAIR", "SOCIAL", "MEDICAL"
  status: TaskStatus;
  dueDate?: Date;
  aiAnalysis: string; // The "Thinking" output
  recommendedModes: ServiceMode[];
  selectedModeId?: string;
  selectedProviderId?: string;
  steps: TaskStep[];
  currentStepIndex: number;
  quote?: Quote;
  bids?: Quote[]; // NEW: List of quotes for comparison
  hasInsurance: boolean; 
  isEscrowActive: boolean; 
}

export interface JobItem {
  id: string;
  title: string;
  description: string;
  category: 'HOME_REPAIR' | 'SOCIAL' | 'CARE' | 'EVENT' | 'OTHER';
  location: string;
  budget: number;
  isBiddingAllowed: boolean;
  postedTime: string;
  distance: string;
  requesterName: string;
  requesterRating: number;
}
