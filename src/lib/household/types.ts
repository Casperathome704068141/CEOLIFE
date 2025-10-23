export type MemberRelation = "brother" | "parent" | "guest" | "other";

export interface Member {
  id: string;
  name: string;
  relation: MemberRelation;
  phone?: string;
  notes?: string;
  roleLabel?: "Admin" | "Family" | "Guest" | string;
}

export interface CareProfileFlags {
  phi?: boolean;
}

export interface CareProfile {
  id: string;
  memberId?: string;
  name: string;
  phone?: string;
  tz?: string;
  flags?: CareProfileFlags;
}

export type MedicationForm = "tab" | "cap" | "liq";
export type MedicationScheduleType = "fixed" | "interval";

export interface MedicationSchedule {
  type: MedicationScheduleType;
  times?: string[];
  intervalHours?: number;
  daysOfWeek?: number[];
}

export interface MedicationAlerts {
  critical?: boolean;
  bypassQuietHours?: boolean;
}

export interface Medication {
  id: string;
  careProfileId: string;
  name: string;
  strengthMg?: number;
  form?: MedicationForm;
  dosage: {
    unitsPerDose: number;
  };
  schedule: MedicationSchedule;
  pillsOnHand: number;
  refillPackSize: number;
  lowStockThreshold: number;
  refillsRemaining?: number;
  alerts?: MedicationAlerts;
  linkedDocs?: string[];
}

export type DoseStatus = "due" | "taken" | "missed" | "snoozed" | "skipped";

export interface Dose {
  id: string;
  medId: string;
  scheduledAt: string;
  takenAt?: string;
  status: DoseStatus;
  notes?: string;
}

export interface Appointment {
  id: string;
  careProfileId: string;
  title: string;
  type: string;
  start: string;
  end: string;
  location: string;
  provider?: string;
  notes?: string;
  linkedDocs?: string[];
}

export type AssetCategory =
  | "appliance"
  | "furniture"
  | "vehicle"
  | "electronics"
  | "tool"
  | "other";

export type AssetCondition = "new" | "good" | "fair" | "poor";

export interface AssetMaintenance {
  next?: string;
  cadenceDays?: number;
  history?: { performedAt: string; note?: string }[];
}

export interface Asset {
  id: string;
  category: AssetCategory;
  name: string;
  serial?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition: AssetCondition;
  warrantyEnd?: string;
  receiptDocId?: string;
  photos?: string[];
  maintenance?: AssetMaintenance;
}

export interface Apartment {
  id: string;
  address?: string;
  rentDueDay?: number;
  meterTypes?: ("power" | "water" | "gas")[];
}

export interface MeterReading {
  id: string;
  apartmentId: string;
  type: "power" | "water" | "gas" | "other";
  reading: number;
  unit: "kWh" | "m³" | "L" | "other";
  takenAt: string;
  photoDocId?: string;
  note?: string;
}

export type TicketType = "repair" | "cleaning" | "improvement";
export type TicketSeverity = "low" | "med" | "high";
export type TicketStatus = "open" | "in_progress" | "closed";

export interface Ticket {
  id: string;
  apartmentId: string;
  title: string;
  type: TicketType;
  severity: TicketSeverity;
  status: TicketStatus;
  notes?: string;
  photos?: string[];
  due?: string;
  assignee?: string;
}

export interface ShoppingItem {
  id: string;
  label: string;
  qty?: string;
  recurring?: boolean;
  priority: "low" | "med" | "high";
  priceTarget?: number;
  isChecked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

export interface LedgerEntry {
  id: string;
  label: string;
  amount: number;
  currency: string;
  date: string;
  payer: string;
  links?: { billId?: string };
  note?: string;
  attachments?: string[];
}

export interface Settlement {
  id: string;
  date: string;
  payer: string;
  amount: number;
  method: "cash" | "etransfer" | "other";
  links?: { ledgerIds?: string[] };
}

export interface HouseholdCareKPIs {
  adherence30d: number;
  onHandDays: number;
  nextRefillDate?: string;
  nextAppointmentDate?: string;
}

export interface HouseholdSnapshot {
  members: Member[];
  careProfiles: CareProfile[];
  medications: Medication[];
  doses: Dose[];
  appointments: Appointment[];
  assets: Asset[];
  apartment?: Apartment;
  meterReadings: MeterReading[];
  tickets: Ticket[];
  shoppingLists: ShoppingList[];
  ledger: LedgerEntry[];
  settlements: Settlement[];
}
