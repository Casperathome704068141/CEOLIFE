import {
  Appointment,
  Asset,
  CareProfile,
  Dose,
  LedgerEntry,
  Member,
  MeterReading,
  Medication,
  ShoppingList,
  Settlement,
  Ticket,
} from "@/lib/household/types";

interface HouseholdStore {
  members: Member[];
  careProfiles: CareProfile[];
  medications: Medication[];
  doses: Dose[];
  appointments: Appointment[];
  assets: Asset[];
  meterReadings: MeterReading[];
  tickets: Ticket[];
  shoppingLists: ShoppingList[];
  ledger: LedgerEntry[];
  settlements: Settlement[];
}

declare global {
  // eslint-disable-next-line no-var
  var __householdStore: HouseholdStore | undefined;
}

const defaultMembers: Member[] = [
  { id: "m-1", name: "Beno", relation: "brother", phone: "+15550001111", roleLabel: "Admin" },
  { id: "m-2", name: "Marcus", relation: "parent", phone: "+15550002222", roleLabel: "Family" },
  { id: "m-3", name: "Luis", relation: "guest", phone: "+15550003333", roleLabel: "Guest" },
];

const defaultProfiles: CareProfile[] = [
  { id: "cp-1", memberId: "m-1", name: "Beno", phone: "+15550001111" },
  { id: "cp-2", memberId: "m-2", name: "Marcus", phone: "+15550002222" },
];

const now = new Date();

const defaultMedications: Medication[] = [
  {
    id: "med-1",
    careProfileId: "cp-1",
    name: "Hydroxyurea",
    strengthMg: 500,
    form: "cap",
    dosage: { unitsPerDose: 1 },
    schedule: { type: "fixed", times: ["08:00", "20:00"], daysOfWeek: [1, 2, 3, 4, 5, 6, 0] },
    pillsOnHand: 22,
    refillPackSize: 30,
    lowStockThreshold: 10,
    refillsRemaining: 2,
  },
  {
    id: "med-2",
    careProfileId: "cp-2",
    name: "Vitamin D",
    strengthMg: 1000,
    form: "tab",
    dosage: { unitsPerDose: 1 },
    schedule: { type: "fixed", times: ["09:00"], daysOfWeek: [1, 3, 5] },
    pillsOnHand: 15,
    refillPackSize: 60,
    lowStockThreshold: 6,
    refillsRemaining: 4,
  },
];

const defaultDoses: Dose[] = defaultMedications.flatMap((med) =>
  (med.schedule.times || []).map((time, index) => {
    const today = new Date();
    const [hour, minute] = time.split(":").map(Number);
    today.setHours(hour ?? 8, minute ?? 0, 0, 0);
    return {
      id: `${med.id}-dose-${index}`,
      medId: med.id,
      scheduledAt: today.toISOString(),
      status: index % 2 === 0 ? "taken" : "due",
    } as Dose;
  }),
);

const defaultAppointments: Appointment[] = [
  {
    id: "appt-1",
    careProfileId: "cp-1",
    title: "Hematology follow-up",
    type: "specialist",
    start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    location: "City Hospital",
    provider: "Dr. Singh",
  },
];

const defaultAssets: Asset[] = [
  {
    id: "asset-1",
    name: "Dyson V12",
    category: "appliance",
    condition: "good",
    purchaseDate: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    warrantyEnd: new Date(now.getTime() + 165 * 24 * 60 * 60 * 1000).toISOString(),
    maintenance: { next: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(), cadenceDays: 90, history: [] },
  },
];

const defaultShopping: ShoppingList[] = [
  {
    id: "list-1",
    name: "Shared essentials",
    items: [
      { id: "item-1", label: "Paper towels", priority: "med", recurring: true, isChecked: false },
      { id: "item-2", label: "Laundry detergent", priority: "high", recurring: true, priceTarget: 12, isChecked: false },
    ],
  },
];

const defaultLedger: LedgerEntry[] = [
  {
    id: "ledger-1",
    label: "Groceries",
    amount: 120,
    currency: "USD",
    date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    payer: "Marcus",
  },
  {
    id: "ledger-2",
    label: "Internet bill",
    amount: 80,
    currency: "USD",
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    payer: "Beno",
  },
];

const defaultTickets: Ticket[] = [
  {
    id: "ticket-1",
    apartmentId: "apt-1",
    title: "Fix shower handle",
    type: "repair",
    severity: "med",
    status: "open",
  },
];

const defaultMeters: MeterReading[] = [
  {
    id: "meter-1",
    apartmentId: "apt-1",
    type: "power",
    reading: 2334,
    unit: "kWh",
    takenAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "meter-2",
    apartmentId: "apt-1",
    type: "power",
    reading: 2404,
    unit: "kWh",
    takenAt: now.toISOString(),
  },
];

const defaultSettlements: Settlement[] = [
  {
    id: "set-1",
    payer: "Beno",
    amount: 200,
    method: "etransfer",
    date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getHouseholdStore(): HouseholdStore {
  if (!globalThis.__householdStore) {
    globalThis.__householdStore = {
      members: defaultMembers,
      careProfiles: defaultProfiles,
      medications: defaultMedications,
      doses: defaultDoses,
      appointments: defaultAppointments,
      assets: defaultAssets,
      meterReadings: defaultMeters,
      tickets: defaultTickets,
      shoppingLists: defaultShopping,
      ledger: defaultLedger,
      settlements: defaultSettlements,
    };
  }
  return globalThis.__householdStore;
}

export function setHouseholdStore(store: HouseholdStore) {
  globalThis.__householdStore = store;
}
