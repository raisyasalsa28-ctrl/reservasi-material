export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  nip: string;
  name: string;
  role: UserRole;
  department: string;
  division: string;
  plantLocation: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export type PriorityLevel = 'EMERGENCY' | 'HIGH' | 'NORMAL' | 'LOW';

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type MaterialCategory =
  | 'MEKANIKAL'
  | 'LISTRIK_INSTRUMEN'
  | 'PIPING_VALVE'
  | 'KIMIA_KATALIS'
  | 'SAFETY_APD'
  | 'PELUMAS_GREASE'
  | 'FASTENER_GASKET';

export interface MaterialItem {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  specification: string;
  stock: number;
  safetyStock: number;
  unit: string;
  binLocation: string;
  priceEstimate: number;
  lastRestocked: string;
}

export interface MaterialReservationItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  quantityRequested: number;
  unit: string;
  availableStockSnapshot: number;
}

export interface VerificationDetails {
  verifiedBy: {
    name: string;
    nip: string;
    title: string;
  };
  verifiedAt: string;
  decision: 'APPROVED' | 'REJECTED';
  notes: string;
  pickupLocation?: string;
  pickupDeadline?: string;
  rejectionReason?: string;
}

export interface CompletionDetails {
  receivedBy: string;
  receivedAt: string;
  handoverNotes?: string;
}

export interface TimelineEntry {
  id: string;
  step: string;
  actor: string;
  timestamp: string;
  status: ReservationStatus | 'SUBMITTED' | 'PICKUP_READY';
  notes?: string;
}

export interface Reservation {
  id: string;
  workOrderNumber: string;
  requestedBy: {
    id: string;
    name: string;
    nip: string;
    department: string;
    division: string;
  };
  targetPlant: string;
  priority: PriorityLevel;
  reason: string;
  equipmentTag: string;
  items: MaterialReservationItem[];
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  verificationDetails?: VerificationDetails;
  completionDetails?: CompletionDetails;
  timeline: TimelineEntry[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  targetRole: 'user' | 'admin' | 'all';
  timestamp: string;
  read: boolean;
  reservationId?: string;
}
