export type UserRole = 'CLIENT' | 'PROFESSIONAL';

export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type DocumentType = 'ID' | 'PASSPORT' | 'DRIVING_LICENSE';

export type ServiceStatus = 'ACTIVE' | 'INACTIVE' | 'IN_REVIEW' | 'SUSPENDED';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'DELIVERING'
  | 'NOT_DELIVERED'
  | 'NOT_PAYED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'SOLVED'
  | 'REFUNDED';

export type PriceType = 'FIXED' | 'HOURLY';

export type JobType = 'PRESENCIAL';

export type QuestionType = 'TEXT' | 'BOOLEAN' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface FatumUser {
  userId: string;
  email: string;
  name: string;
  birthDate?: string;
  username: string;
  phoneNumber?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  document?: string;
  gender?: Gender;
  documentType?: DocumentType;
  addresses?: FatumAddress[];
  profileImageUrl?: string;
}

export interface FatumItem {
  id: string;
  title: string;
  description: string;
  providerId: string;
  providerName: string;
  providerUsername: string;
  basePrice: number;
  priceType: PriceType;
  isNegotiable: boolean;
  defaultEstimatedTime: number;
  jobType: JobType;
  category: string;
  fixedQuestions: FixedQuestion[];
  status: ServiceStatus;
  coverImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface FatumCategory {
  name: string;
  slug: string;
  parentSlug?: string;
  schedulingModel?: string;
  isAble: boolean;
  logoUrl?: string;
}

export interface FatumOrder {
  id: string;
  counterpartUsername: string;
  catalogItemTitle: string;
  booking?: string;
  negotiatedPrice?: number;
  estimatedTime?: number;
  startConfirmation?: boolean;
  completionConfirmation?: boolean;
  paymentConfirmation?: boolean;
  reason?: string;
  status: OrderStatus;
}

export interface FatumAddress {
  residence: string;
  alias: string;
  city: string;
  state: string;
  country: string;
  userName?: string;
}

export interface BookedSlot {
  orderId: string;
  booking: string;
  endTime: string;
  estimatedTime: number;
  status: OrderStatus;
  serviceTitle: string;
}

export interface CalendarDay {
  date: string;
  isAvailable: boolean;
  initialTime?: string;
  finalTime?: string;
  unavailableReason?: string;
  bookedSlots: BookedSlot[];
}

export interface FixedQuestion {
  question: string;
  type: QuestionType;
  options?: string[];
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
];

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: 'ID', label: 'Cédula de Ciudadanía' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'DRIVING_LICENSE', label: 'Licencia de conducción' },
];

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, string> = {
  ACTIVE: '#7FCD6C',
  INACTIVE: '#B8C2C0',
  IN_REVIEW: '#2BB6A8',
  SUSPENDED: '#2BB6A8',
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  IN_REVIEW: 'En revisión',
  SUSPENDED: 'Suspendido',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  REJECTED: 'Rechazado',
  DELIVERING: 'En entrega',
  NOT_DELIVERED: 'No entregado',
  NOT_PAYED: 'No pagado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  DISPUTED: 'En disputa',
  SOLVED: 'Resuelto',
  REFUNDED: 'Reembolsado',
};

export function formatPrice(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatEstimatedTime(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h}h ${m}m`;
}
