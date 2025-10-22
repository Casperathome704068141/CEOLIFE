import "dotenv/config";
import admin from "firebase-admin";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env var is required with service account JSON");
}

const credential = admin.credential.cert(JSON.parse(serviceAccountJson));

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential,
  });
}

const db = admin.firestore();

type SeedEntity<T extends FirebaseFirestore.DocumentData> = { collection: string; id: string; data: T };

type HouseholdSeed = {
  id: string;
  name: string;
  address: string;
  currency: string;
  members: string[];
  sharedSettings: Record<string, unknown>;
};

type TransactionSeed = {
  id: string;
  ownerId: string;
  householdId: string;
  date: FirebaseFirestore.Timestamp;
  description: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  source: "plaid" | "ocr" | "manual";
  status: "cleared" | "pending" | "flagged";
  tags: string[];
};

const household: HouseholdSeed = {
  id: "demo-household",
  name: "BENO Loft",
  address: "1017 Front St W, Toronto, ON",
  currency: "CAD",
  members: ["beno", "marcus", "luis"],
  sharedSettings: { timezone: "America/Toronto" },
};

const memberSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "households/demo-household/members",
    id: "beno",
    data: { role: "admin", userRef: "users/beno", permissions: { finance: true, vault: true } },
  },
  {
    collection: "households/demo-household/members",
    id: "marcus",
    data: { role: "family", userRef: "users/marcus", permissions: { finance: true, vault: false } },
  },
  {
    collection: "households/demo-household/members",
    id: "luis",
    data: { role: "family", userRef: "users/luis", permissions: { finance: true, vault: true } },
  },
];

const accountSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "accounts",
    id: "chequing",
    data: {
      ownerId: "beno",
      institution: "TD Canada Trust",
      mask: "1234",
      type: "checking",
      currentBalance: 42870,
      currency: "CAD",
      linkedPlaidId: "plaid-account-1",
    },
  },
  {
    collection: "accounts",
    id: "visa",
    data: {
      ownerId: "beno",
      institution: "RBC",
      mask: "9876",
      type: "credit",
      currentBalance: -820.45,
      currency: "CAD",
      linkedPlaidId: "plaid-account-2",
    },
  },
];

const transactions: TransactionSeed[] = Array.from({ length: 60 }).map((_, index) => {
  const amount = index % 5 === 0 ? -220.5 : index % 3 === 0 ? -42.75 : 120.0;
  const merchant = amount > 0 ? "Consulting Retainer" : index % 3 === 0 ? "Metro" : "HydroOne";
  return {
    id: `txn-${index}`,
    ownerId: "beno",
    householdId: "demo-household",
    date: admin.firestore.Timestamp.fromDate(new Date(Date.now() - index * 24 * 60 * 60 * 1000)),
    description: `${merchant} payment`,
    merchant,
    amount,
    currency: "CAD",
    category: amount > 0 ? "Income" : "Expenses",
    source: index % 4 === 0 ? "ocr" : "plaid",
    status: amount > 0 ? "cleared" : "pending",
    tags: amount > 0 ? ["consulting"] : ["household"],
  };
});

const billSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "bills",
    id: "rent",
    data: {
      ownerId: "beno",
      name: "Rent",
      amount: 2350,
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2024-11-01")),
      autopay: false,
      accountRef: "accounts/chequing",
      tags: ["housing"],
    },
  },
  {
    collection: "bills",
    id: "internet",
    data: {
      ownerId: "beno",
      name: "Internet",
      amount: 89.99,
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2024-10-30")),
      autopay: true,
      accountRef: "accounts/visa",
      tags: ["utilities"],
    },
  },
];

const goalSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "goals",
    id: "japan",
    data: {
      ownerId: "beno",
      name: "Japan expedition",
      target: 12000,
      current: 7850,
      deadline: admin.firestore.Timestamp.fromDate(new Date("2025-03-01")),
      priority: "high",
    },
  },
  {
    collection: "goals",
    id: "emergency",
    data: {
      ownerId: "beno",
      name: "Emergency fund",
      target: 18000,
      current: 12200,
      deadline: admin.firestore.Timestamp.fromDate(new Date("2024-12-31")),
      priority: "medium",
    },
  },
];

async function seedCollection<T extends FirebaseFirestore.DocumentData>(seed: SeedEntity<T>) {
  const ref = db.collection(seed.collection).doc(seed.id);
  await ref.set(seed.data, { merge: true });
}

async function seed() {
  await db.collection("households").doc(household.id).set(household, { merge: true });
  await Promise.all(memberSeeds.map(seedCollection));
  await Promise.all(accountSeeds.map(seedCollection));
  await Promise.all(billSeeds.map(seedCollection));
  await Promise.all(goalSeeds.map(seedCollection));

  let batch = db.batch();
  const chunkSize = 20;
  const commits: Promise<FirebaseFirestore.WriteResult[]>[] = [];

  transactions.forEach((txn, index) => {
    const ref = db.collection("transactions").doc(txn.id);
    batch.set(ref, txn, { merge: true });
    if ((index + 1) % chunkSize === 0) {
      commits.push(batch.commit());
      batch = db.batch();
    }
  });

  if (transactions.length % chunkSize !== 0) {
    commits.push(batch.commit());
  }

  await Promise.all(commits);

  console.log("Seed data successfully written");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
