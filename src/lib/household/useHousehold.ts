"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  Appointment,
  Asset,
  CareProfile,
  Dose,
  HouseholdCareKPIs,
  LedgerEntry,
  Member,
  MeterReading,
  Medication,
  ShoppingItem,
  ShoppingList,
  Settlement,
  Ticket,
} from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface HouseholdContextValue {
  members: Member[];
  careProfiles: CareProfile[];
  medications: Medication[];
  appointments: Appointment[];
  doses: Dose[];
  assets: Asset[];
  meterReadings: MeterReading[];
  tickets: Ticket[];
  shoppingLists: ShoppingList[];
  ledger: LedgerEntry[];
  settlements: Settlement[];
  careKpis: HouseholdCareKPIs;
  addMember: (payload: Partial<Member> & { name: string; relation: Member["relation"] }) => Promise<void>;
  updateMemberRole: (memberId: string, roleLabel: string) => Promise<void>;
  sendNudge: (payload: { channel: "whatsapp" | "sms"; to: string; message: string }) => Promise<void>;
  upsertCareProfile: (payload: Partial<CareProfile> & { name: string }) => Promise<CareProfile>;
  upsertMedication: (payload: Partial<Medication> & { careProfileId: string; name: string }) => Promise<Medication>;
  logDose: (payload: { medId: string; status: Dose["status"]; notes?: string }) => Promise<void>;
  snoozeDose: (payload: { medId: string; minutes: number }) => Promise<void>;
  skipDose: (payload: { medId: string; reason?: string }) => Promise<void>;
  refillMedication: (payload: { medId: string; qty: number; pharmacy?: string; pickupDate?: string }) => Promise<void>;
  addAppointment: (payload: Partial<Appointment> & { careProfileId: string; title: string; start: string; end: string; location: string }) => Promise<Appointment>;
  addAsset: (payload: Partial<Asset> & { name: string; category: Asset["category"]; condition: Asset["condition"] }) => Promise<Asset>;
  setAssetWarranty: (assetId: string, warrantyEnd: string, reminderDays?: number[]) => Promise<void>;
  scheduleAssetMaintenance: (payload: { assetId: string; next: string; cadenceDays?: number }) => Promise<void>;
  markAssetServiced: (payload: { assetId: string; note?: string }) => Promise<void>;
  attachAssetReceipt: (payload: { assetId: string; receiptDocId: string }) => Promise<void>;
  addMeterReading: (payload: Omit<MeterReading, "id">) => Promise<MeterReading>;
  upsertTicket: (payload: Partial<Ticket> & { apartmentId: string; title: string; type: Ticket["type"]; severity: Ticket["severity"]; status?: Ticket["status"] }) => Promise<Ticket>;
  mutateTicketStatus: (payload: { ticketId: string; status: Ticket["status"]; assignee?: string }) => Promise<void>;
  addShoppingItem: (payload: { listId: string; label: string; qty?: string; priority: ShoppingItem["priority"]; recurring?: boolean; priceTarget?: number }) => Promise<void>;
  toggleShoppingItem: (payload: { listId: string; itemId: string; checked: boolean }) => Promise<void>;
  setShoppingPriceTarget: (payload: { listId: string; itemId: string; priceTarget?: number }) => Promise<void>;
  sendShoppingList: (payload: { listId: string; channel: "whatsapp" | "sms"; to: string }) => Promise<void>;
  recordPayment: (payload: { payer: string; amount: number; method: Settlement["method"]; reference?: string; attachments?: string[]; currency: string }) => Promise<void>;
  settleNow: (payload: { settlements: { payer: string; amount: number }[]; currency: string }) => Promise<void>;
  exportLedger: () => Promise<string>;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json() as Promise<T>;
}

function computeCareKpis(medications: Medication[], doses: Dose[], appointments: Appointment[]): HouseholdCareKPIs {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const relevantDoses = doses.filter((dose) => new Date(dose.scheduledAt) >= thirtyDaysAgo);
  const taken = relevantDoses.filter((dose) => dose.status === "taken").length;
  const adherence30d = relevantDoses.length ? Math.round((taken / relevantDoses.length) * 100) : 100;

  const medDays = medications.map((med) => {
    if (med.schedule.type === "fixed" && med.schedule.times && med.schedule.times.length > 0) {
      const dosesPerDay = med.schedule.times.length;
      return med.pillsOnHand / (dosesPerDay * med.dosage.unitsPerDose);
    }
    if (med.schedule.type === "interval" && med.schedule.intervalHours) {
      const dosesPerDay = 24 / med.schedule.intervalHours;
      return med.pillsOnHand / (dosesPerDay * med.dosage.unitsPerDose);
    }
    return med.pillsOnHand;
  });

  const onHandDays = medDays.length ? Math.floor(Math.min(...medDays)) : 0;

  const upcomingRefill = medications
    .filter((med) => med.lowStockThreshold >= med.pillsOnHand)
    .map((med) => new Date(now.getTime() + onHandDays * 24 * 60 * 60 * 1000))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const nextAppointment = appointments
    .map((appt) => new Date(appt.start))
    .filter((date) => date >= now)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return {
    adherence30d,
    onHandDays,
    nextRefillDate: upcomingRefill ? upcomingRefill.toISOString() : undefined,
    nextAppointmentDate: nextAppointment ? nextAppointment.toISOString() : undefined,
  };
}

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("members");
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["household", "members"],
    queryFn: () => api<Member[]>("/api/household/members"),
  });

  const { data: careProfiles = [] } = useQuery<CareProfile[]>({
    queryKey: ["household", "careProfiles"],
    queryFn: () => api<CareProfile[]>("/api/household/care/profiles"),
  });

  const { data: medications = [] } = useQuery<Medication[]>({
    queryKey: ["household", "medications"],
    queryFn: () => api<Medication[]>("/api/household/care/medications"),
  });

  const { data: doses = [] } = useQuery<Dose[]>({
    queryKey: ["household", "doses"],
    queryFn: () => api<Dose[]>("/api/household/care/doses"),
  });

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["household", "appointments"],
    queryFn: () => api<Appointment[]>("/api/household/care/appointments"),
  });

  const { data: assets = [] } = useQuery<Asset[]>({
    queryKey: ["household", "assets"],
    queryFn: () => api<Asset[]>("/api/household/assets"),
  });

  const { data: meterReadings = [] } = useQuery<MeterReading[]>({
    queryKey: ["household", "meters"],
    queryFn: () => api<MeterReading[]>("/api/household/apartment/meters"),
  });

  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["household", "tickets"],
    queryFn: () => api<Ticket[]>("/api/household/apartment/tickets"),
  });

  const { data: shoppingLists = [] } = useQuery<ShoppingList[]>({
    queryKey: ["household", "shopping"],
    queryFn: () => api<ShoppingList[]>("/api/household/shopping"),
  });

  const { data: ledger = [] } = useQuery<LedgerEntry[]>({
    queryKey: ["household", "ledger"],
    queryFn: () => api<LedgerEntry[]>("/api/household/split/ledger"),
  });

  const { data: settlements = [] } = useQuery<Settlement[]>({
    queryKey: ["household", "settlements"],
    queryFn: () => api<Settlement[]>("/api/household/split/settlements").catch(() => []),
  });

  const careKpis = useMemo(
    () => computeCareKpis(medications, doses, appointments),
    [medications, doses, appointments],
  );

  const addMemberMutation = useMutation({
    mutationFn: (payload: Partial<Member> & { name: string; relation: Member["relation"] }) =>
      api<Member[]>("/api/household/members", { method: "POST", body: JSON.stringify({ action: "create", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "members"] }),
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ memberId, roleLabel }: { memberId: string; roleLabel: string }) =>
      api<Member[]>("/api/household/members", { method: "POST", body: JSON.stringify({ action: "role", memberId, roleLabel }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "members"] }),
  });

  const sendNudgeMutation = useMutation({
    mutationFn: (payload: { channel: "whatsapp" | "sms"; to: string; message: string }) =>
      api<{ status: string }>("/api/nudge", { method: "POST", body: JSON.stringify(payload) }),
  });

  const upsertCareProfileMutation = useMutation({
    mutationFn: (payload: Partial<CareProfile> & { name: string }) =>
      api<CareProfile>("/api/household/care/profiles", { method: "POST", body: JSON.stringify({ action: "upsert", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "careProfiles"] }),
  });

  const upsertMedicationMutation = useMutation({
    mutationFn: (payload: Partial<Medication> & { careProfileId: string; name: string }) =>
      api<Medication>("/api/household/care/medications", { method: "POST", body: JSON.stringify({ action: "upsert", payload }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "medications"] });
      queryClient.invalidateQueries({ queryKey: ["household", "doses"] });
    },
  });

  const logDoseMutation = useMutation({
    mutationFn: (payload: { medId: string; status: Dose["status"]; notes?: string }) =>
      api("/api/household/care/doses", { method: "POST", body: JSON.stringify({ action: "log", payload }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "doses"] });
      queryClient.invalidateQueries({ queryKey: ["household", "medications"] });
    },
  });

  const snoozeDoseMutation = useMutation({
    mutationFn: (payload: { medId: string; minutes: number }) =>
      api("/api/household/care/doses", { method: "POST", body: JSON.stringify({ action: "snooze", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "doses"] }),
  });

  const skipDoseMutation = useMutation({
    mutationFn: (payload: { medId: string; reason?: string }) =>
      api("/api/household/care/doses", { method: "POST", body: JSON.stringify({ action: "skip", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "doses"] }),
  });

  const refillMutation = useMutation({
    mutationFn: (payload: { medId: string; qty: number; pharmacy?: string; pickupDate?: string }) =>
      api("/api/household/care/refill", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "medications"] }),
  });

  const appointmentMutation = useMutation({
    mutationFn: (payload: Partial<Appointment> & { careProfileId: string; title: string; start: string; end: string; location: string }) =>
      api<Appointment>("/api/household/care/appointments", { method: "POST", body: JSON.stringify({ action: "create", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "appointments"] }),
  });

  const assetMutation = useMutation({
    mutationFn: (payload: Partial<Asset> & { name: string; category: Asset["category"]; condition: Asset["condition"] }) =>
      api<Asset>("/api/household/assets", { method: "POST", body: JSON.stringify({ action: "create", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "assets"] }),
  });

  const warrantyMutation = useMutation({
    mutationFn: ({ assetId, warrantyEnd, reminderDays }: { assetId: string; warrantyEnd: string; reminderDays?: number[] }) =>
      api("/api/household/assets", { method: "POST", body: JSON.stringify({ action: "warranty", assetId, warrantyEnd, reminderDays }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "assets"] }),
  });

  const maintenanceMutation = useMutation({
    mutationFn: (payload: { assetId: string; next: string; cadenceDays?: number }) =>
      api("/api/household/assets/maintenance", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "assets"] }),
  });

  const servicedMutation = useMutation({
    mutationFn: (payload: { assetId: string; note?: string }) =>
      api("/api/household/assets/maintenance", { method: "POST", body: JSON.stringify({ ...payload, markServiced: true }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "assets"] }),
  });

  const receiptMutation = useMutation({
    mutationFn: (payload: { assetId: string; receiptDocId: string }) =>
      api("/api/household/assets", { method: "POST", body: JSON.stringify({ action: "receipt", ...payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "assets"] }),
  });

  const meterMutation = useMutation({
    mutationFn: (payload: Omit<MeterReading, "id">) =>
      api<MeterReading>("/api/household/apartment/meters", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "meters"] }),
  });

  const ticketMutation = useMutation({
    mutationFn: (payload: Partial<Ticket> & { apartmentId: string; title: string; type: Ticket["type"]; severity: Ticket["severity"]; status?: Ticket["status"] }) =>
      api<Ticket>("/api/household/apartment/tickets", { method: "POST", body: JSON.stringify({ action: "upsert", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "tickets"] }),
  });

  const ticketStatusMutation = useMutation({
    mutationFn: (payload: { ticketId: string; status: Ticket["status"]; assignee?: string }) =>
      api("/api/household/apartment/tickets", { method: "POST", body: JSON.stringify({ action: "status", ...payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "tickets"] }),
  });

  const shoppingMutation = useMutation({
    mutationFn: (payload: { listId: string; label: string; qty?: string; priority: ShoppingItem["priority"]; recurring?: boolean; priceTarget?: number }) =>
      api("/api/household/shopping", { method: "POST", body: JSON.stringify({ action: "addItem", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "shopping"] }),
  });

  const toggleShoppingMutation = useMutation({
    mutationFn: (payload: { listId: string; itemId: string; checked: boolean }) =>
      api("/api/household/shopping", { method: "POST", body: JSON.stringify({ action: "toggle", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "shopping"] }),
  });

  const priceTargetMutation = useMutation({
    mutationFn: (payload: { listId: string; itemId: string; priceTarget?: number }) =>
      api("/api/household/shopping", { method: "POST", body: JSON.stringify({ action: "priceTarget", payload }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["household", "shopping"] }),
  });

  const sendShoppingMutation = useMutation({
    mutationFn: (payload: { listId: string; channel: "whatsapp" | "sms"; to: string }) =>
      api("/api/nudge", { method: "POST", body: JSON.stringify({ ...payload, listId: payload.listId, template: "shopping" }) }),
  });

  const paymentMutation = useMutation({
    mutationFn: (payload: { payer: string; amount: number; method: Settlement["method"]; reference?: string; attachments?: string[]; currency: string }) =>
      api("/api/household/split/settle", { method: "POST", body: JSON.stringify({ action: "record", payload }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "settlements"] });
      queryClient.invalidateQueries({ queryKey: ["household", "ledger"] });
    },
  });

  const settleNowMutation = useMutation({
    mutationFn: (payload: { settlements: { payer: string; amount: number }[]; currency: string }) =>
      api("/api/household/split/settle", { method: "POST", body: JSON.stringify({ action: "settleNow", payload }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", "settlements"] });
      queryClient.invalidateQueries({ queryKey: ["household", "ledger"] });
    },
  });

  const exportLedgerMutation = useMutation({
    mutationFn: () => api<{ export: string }>("/api/household/split/ledger", { method: "POST", body: JSON.stringify({ action: "export" }) }),
  });

  const value = useMemo<HouseholdContextValue>(() => ({
    members,
    careProfiles,
    medications,
    appointments,
    doses,
    assets,
    meterReadings,
    tickets,
    shoppingLists,
    ledger,
    settlements,
    careKpis,
    addMember: async (payload) => {
      await addMemberMutation.mutateAsync(payload);
    },
    updateMemberRole: async (memberId, roleLabel) => {
      await updateMemberRoleMutation.mutateAsync({ memberId, roleLabel });
    },
    sendNudge: async (payload) => {
      await sendNudgeMutation.mutateAsync(payload);
    },
    upsertCareProfile: async (payload) => upsertCareProfileMutation.mutateAsync(payload),
    upsertMedication: async (payload) => upsertMedicationMutation.mutateAsync(payload),
    logDose: async (payload) => logDoseMutation.mutateAsync(payload),
    snoozeDose: async (payload) => snoozeDoseMutation.mutateAsync(payload),
    skipDose: async (payload) => skipDoseMutation.mutateAsync(payload),
    refillMedication: async (payload) => refillMutation.mutateAsync(payload),
    addAppointment: async (payload) => appointmentMutation.mutateAsync(payload),
    addAsset: async (payload) => assetMutation.mutateAsync(payload),
    setAssetWarranty: async (assetId, warrantyEnd, reminderDays) => warrantyMutation.mutateAsync({ assetId, warrantyEnd, reminderDays }),
    scheduleAssetMaintenance: async (payload) => maintenanceMutation.mutateAsync(payload),
    markAssetServiced: async (payload) => servicedMutation.mutateAsync(payload),
    attachAssetReceipt: async (payload) => receiptMutation.mutateAsync(payload),
    addMeterReading: async (payload) => meterMutation.mutateAsync(payload),
    upsertTicket: async (payload) => ticketMutation.mutateAsync(payload),
    mutateTicketStatus: async (payload) => ticketStatusMutation.mutateAsync(payload),
    addShoppingItem: async (payload) => shoppingMutation.mutateAsync(payload),
    toggleShoppingItem: async (payload) => toggleShoppingMutation.mutateAsync(payload),
    setShoppingPriceTarget: async (payload) => priceTargetMutation.mutateAsync(payload),
    sendShoppingList: async (payload) => sendShoppingMutation.mutateAsync(payload),
    recordPayment: async (payload) => paymentMutation.mutateAsync(payload),
    settleNow: async (payload) => settleNowMutation.mutateAsync(payload),
    exportLedger: async () => {
      const data = await exportLedgerMutation.mutateAsync();
      return data.export;
    },
    activeTab,
    setActiveTab,
  }), [
    members,
    careProfiles,
    medications,
    appointments,
    doses,
    assets,
    meterReadings,
    tickets,
    shoppingLists,
    ledger,
    settlements,
    careKpis,
    addMemberMutation,
    updateMemberRoleMutation,
    sendNudgeMutation,
    upsertCareProfileMutation,
    upsertMedicationMutation,
    logDoseMutation,
    snoozeDoseMutation,
    skipDoseMutation,
    refillMutation,
    appointmentMutation,
    assetMutation,
    warrantyMutation,
    maintenanceMutation,
    servicedMutation,
    receiptMutation,
    meterMutation,
    ticketMutation,
    ticketStatusMutation,
    shoppingMutation,
    toggleShoppingMutation,
    priceTargetMutation,
    sendShoppingMutation,
    paymentMutation,
    settleNowMutation,
    exportLedgerMutation,
    activeTab,
  ]);

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within HouseholdProvider");
  }
  return context;
}
