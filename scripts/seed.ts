import "dotenv/config";
import admin from "firebase-admin";

type SeedEntity<T extends FirebaseFirestore.DocumentData> = {
  collection: string;
  id: string;
  data: T;
};

type SubcollectionSeed<T extends FirebaseFirestore.DocumentData> = {
  path: string;
  id: string;
  data: T;
};

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
const now = admin.firestore.Timestamp.now();

const userSeed: SeedEntity<Record<string, unknown>> = {
  collection: "users",
  id: "beno",
  data: {
    uid: "beno",
    email: "beno@ceolife.co",
    displayName: "Beno Laurent",
    role: "HEAD",
    preferences: {
      locale: "en-CA",
      currency: "CAD",
      theme: "dark",
      notifications: {
        channels: { inApp: true, email: true, sms: true },
        quietHours: { start: "22:00", end: "06:30" },
      },
    },
    featureFlags: {
      plaid: true,
      googleCalendar: true,
      stealthMode: false,
    },
    onboardingState: {
      completed: false,
      steps: { accounts: true, contacts: true, docs: true },
      lastVisitedRoute: "/dashboard",
    },
    security: {
      idleLockMinutes: 5,
      passkeyRegistered: false,
      zeroKnowledgeVault: true,
    },
    messaging: {
      defaultCountryCode: "+1",
      quietHours: { start: "21:00", end: "07:00" },
    },
    createdAt: now,
    updatedAt: now,
  },
};

const householdSeed: SeedEntity<Record<string, unknown>> = {
  collection: "households",
  id: "demo-household",
  data: {
    id: "demo-household",
    ownerUid: "beno",
    name: "BENO Loft",
    address: "1017 Front St W, Toronto, ON",
    members: ["beno", "marcus", "luis"],
    currency: "CAD",
    timezone: "America/Toronto",
    sharedSettings: {
      messagingChannel: "whatsapp",
      defaultNudgeTemplates: ["bill-reminder", "shopping-list"],
    },
    createdAt: now,
  },
};

const memberSeeds: SubcollectionSeed<Record<string, unknown>>[] = [
  {
    path: "households/demo-household/members",
    id: "beno",
    data: {
      displayName: "Beno Laurent",
      role: "head",
      permissions: { finance: true, vault: true, automations: true },
      contact: { phone: "+14165550101", preferredChannel: "whatsapp" },
      createdAt: now,
    },
  },
  {
    path: "households/demo-household/members",
    id: "marcus",
    data: {
      displayName: "Marcus Laurent",
      role: "member",
      permissions: { finance: true, vault: false },
      contact: { phone: "+14165550102", preferredChannel: "sms" },
      createdAt: now,
    },
  },
  {
    path: "households/demo-household/members",
    id: "luis",
    data: {
      displayName: "Luis Laurent",
      role: "member",
      permissions: { finance: false, vault: false },
      contact: { phone: "+14165550103", preferredChannel: "whatsapp" },
      createdAt: now,
    },
  },
];

const contactSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "contacts",
    id: "marcus-contact",
    data: {
      ownerId: "beno",
      name: "Marcus Laurent",
      phone: "+14165550102",
      channelPreference: "whatsapp",
      notes: "Brother – utilities split",
      createdAt: now,
    },
  },
  {
    collection: "contacts",
    id: "luis-contact",
    data: {
      ownerId: "beno",
      name: "Luis Laurent",
      phone: "+14165550103",
      channelPreference: "sms",
      notes: "Brother – grocery runner",
      createdAt: now,
    },
  },
  {
    collection: "contacts",
    id: "superintendent",
    data: {
      ownerId: "beno",
      name: "Evelyn (Superintendent)",
      phone: "+14165550999",
      channelPreference: "sms",
      createdAt: now,
    },
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
      createdAt: now,
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
      createdAt: now,
    },
  },
];

const budgetSeed: SeedEntity<Record<string, unknown>> = {
  collection: "budgets",
  id: "2024-10",
  data: {
    ownerId: "beno",
    period: "2024-10",
    byCategory: {
      Housing: 2400,
      Groceries: 650,
      Wellness: 300,
      Transit: 180,
      Entertainment: 250,
    },
    alerts: { thresholds: [0.9] },
    carryover: true,
    createdAt: now,
  },
};

const incomeSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "incomeStreams",
    id: "consulting-retainer",
    data: {
      ownerId: "beno",
      name: "Consulting retainer",
      amount: 5200,
      frequency: "biweekly",
      nextDate: admin.firestore.Timestamp.fromDate(new Date("2024-10-25")),
      createdAt: now,
    },
  },
  {
    collection: "incomeStreams",
    id: "bonus-pool",
    data: {
      ownerId: "beno",
      name: "Innovation bonus",
      amount: 1200,
      frequency: "monthly",
      nextDate: admin.firestore.Timestamp.fromDate(new Date("2024-11-01")),
      createdAt: now,
    },
  },
  {
    collection: "incomeStreams",
    id: "brother-reimburse",
    data: {
      ownerId: "beno",
      name: "Marcus utilities share",
      amount: 210,
      frequency: "monthly",
      nextDate: admin.firestore.Timestamp.fromDate(new Date("2024-10-28")),
      createdAt: now,
    },
  },
];

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
      createdAt: now,
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
      createdAt: now,
    },
  },
  {
    collection: "bills",
    id: "hydro",
    data: {
      ownerId: "beno",
      name: "HydroOne",
      amount: 145.5,
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2024-11-03")),
      autopay: false,
      accountRef: "accounts/chequing",
      tags: ["utilities"],
      createdAt: now,
    },
  },
  {
    collection: "bills",
    id: "wellness",
    data: {
      ownerId: "beno",
      name: "Wellness coach",
      amount: 210,
      dueDate: admin.firestore.Timestamp.fromDate(new Date("2024-11-04")),
      autopay: false,
      accountRef: "accounts/visa",
      tags: ["wellness"],
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
    },
  },
  {
    collection: "goals",
    id: "home-tech",
    data: {
      ownerId: "beno",
      name: "Home tech refresh",
      target: 6500,
      current: 3050,
      deadline: admin.firestore.Timestamp.fromDate(new Date("2025-06-15")),
      priority: "low",
      createdAt: now,
    },
  },
  {
    collection: "goals",
    id: "buffer",
    data: {
      ownerId: "beno",
      name: "Savings buffer",
      target: 5000,
      current: 2100,
      deadline: admin.firestore.Timestamp.fromDate(new Date("2024-12-01")),
      priority: "medium",
      createdAt: now,
    },
  },
];

const automationSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "automations",
    id: "budget-alert",
    data: {
      ownerId: "beno",
      ownerScope: "user",
      trigger: { type: "threshold", expression: "category:Groceries >= 0.9" },
      condition: { all: [{ var: "category" }, { ">=": [{ var: "utilization" }, 0.9] }] },
      actions: [
        { type: "notify", payload: { channel: "inApp", message: "Groceries budget at 90%" } },
        { type: "sendNudge", payload: { templateId: "budget-update", contactId: "marcus-contact" } },
      ],
      enabled: true,
      createdAt: now,
    },
  },
  {
    collection: "automations",
    id: "payday-sweep",
    data: {
      ownerId: "beno",
      ownerScope: "user",
      trigger: { type: "cron", expression: "0 7 1,15 * *" },
      actions: [
        { type: "moveToGoal", payload: { goalId: "emergency", amount: 400 } },
        { type: "createTask", payload: { title: "Confirm sweep with brothers" } },
      ],
      enabled: true,
      createdAt: now,
    },
  },
];

const merchantRuleSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "merchantRules",
    id: "metro",
    data: {
      ownerId: "beno",
      merchant: "Metro",
      defaultCategory: "Groceries",
      notes: "Split with Marcus when > $80",
      createdAt: now,
    },
  },
  {
    collection: "merchantRules",
    id: "hydroone",
    data: {
      ownerId: "beno",
      merchant: "HydroOne",
      defaultCategory: "Utilities",
      createdAt: now,
    },
  },
];

const settlementSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "settlements",
    id: "2024-09-utilities",
    data: {
      householdId: "demo-household",
      payerName: "Marcus",
      amount: 145.5,
      currency: "CAD",
      date: admin.firestore.Timestamp.fromDate(new Date("2024-09-28")),
      method: "e-transfer",
      note: "Utilities reimbursement",
      links: ["bills/hydro"],
      attachments: ["documents/brother-marcus-transfer"],
      createdAt: now,
    },
  },
];

const nudgeSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "nudges",
    id: "utilities-oct",
    data: {
      ownerId: "beno",
      toPhone: "+14165550102",
      toName: "Marcus",
      channel: "whatsapp",
      templateId: "bill-reminder",
      payload: { amount: "145.50", dueDate: "2024-11-03", name: "Marcus" },
      status: "sent",
      sentAt: now,
      createdAt: now,
    },
  },
];

const documentSeeds: SeedEntity<Record<string, unknown>>[] = [
  {
    collection: "documents",
    id: "passport-beno",
    data: {
      owner: "beno",
      type: "id",
      filename: "Passport - Beno.pdf",
      mime: "application/pdf",
      size: 320000,
      checksum: "checksum-passport",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      expireDate: admin.firestore.Timestamp.fromDate(new Date("2028-09-12")),
      tags: ["travel"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "lease",
    data: {
      owner: "beno",
      type: "contract",
      filename: "Lease - Harborfront Loft.pdf",
      mime: "application/pdf",
      size: 540000,
      checksum: "checksum-lease",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      expireDate: admin.firestore.Timestamp.fromDate(new Date("2025-08-01")),
      tags: ["rent", "shared"],
      shareACL: [{ subject: "contacts/superintendent", role: "viewer" }],
      shareSubjects: { "contacts/superintendent": "viewer" },
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "insurance-policy",
    data: {
      owner: "beno",
      type: "insurance",
      filename: "Insurance policy #9821.pdf",
      mime: "application/pdf",
      size: 275000,
      checksum: "checksum-insurance",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      expireDate: admin.firestore.Timestamp.fromDate(new Date("2025-04-20")),
      tags: ["auto"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "consulting-retainer",
    data: {
      owner: "beno",
      type: "contract",
      filename: "Consulting retainer.pdf",
      mime: "application/pdf",
      size: 185000,
      checksum: "checksum-consulting",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["cashflow"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "hydroone-statement",
    data: {
      owner: "beno",
      type: "bill",
      filename: "HydroOne statement.pdf",
      mime: "application/pdf",
      size: 92000,
      checksum: "checksum-hydro",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["utilities"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "brother-marcus-transfer",
    data: {
      owner: "beno",
      type: "other",
      filename: "Brother Marcus transfer.jpg",
      mime: "image/jpeg",
      size: 520000,
      checksum: "checksum-marcus",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["shared", "split"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "wellness-plan",
    data: {
      owner: "beno",
      type: "medical",
      filename: "Wellness plan.pdf",
      mime: "application/pdf",
      size: 300000,
      checksum: "checksum-wellness",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["therapy"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "car-insurance",
    data: {
      owner: "beno",
      type: "vehicle",
      filename: "Car insurance renewal.pdf",
      mime: "application/pdf",
      size: 265000,
      checksum: "checksum-car",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["vehicle"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "apartment-inspection",
    data: {
      owner: "beno",
      type: "contract",
      filename: "Apartment inspection checklist.pdf",
      mime: "application/pdf",
      size: 195000,
      checksum: "checksum-inspection",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["maintenance"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
  {
    collection: "documents",
    id: "donation-receipt",
    data: {
      owner: "beno",
      type: "other",
      filename: "Tax receipt charitable donation.pdf",
      mime: "application/pdf",
      size: 165000,
      checksum: "checksum-donation",
      encrypted: true,
      encryption: { algorithm: "AES-GCM", keyId: "k1", wrappedKey: "wrapped-key" },
      tags: ["tax"],
      shareACL: [],
      shareSubjects: {},
      createdAt: now,
    },
  },
];

const shoppingListSeed: SeedEntity<Record<string, unknown>> = {
  collection: "shoppingLists",
  id: "weekly-essentials",
  data: {
    ownerId: "beno",
    name: "Essentials",
    items: [
      { id: "oats", label: "Steel-cut oats", qty: 2, priority: "medium", isRecurring: false },
      { id: "beans", label: "Cold brew beans", qty: 1, priority: "low", isRecurring: true },
      { id: "filters", label: "Air filters", qty: 1, priority: "high", priceTarget: 45 },
      { id: "tablets", label: "Cleaning tablets", qty: 1, priority: "medium" },
      { id: "vitamins", label: "Omega 3 vitamins", qty: 1, priority: "high", isRecurring: true },
    ],
    createdAt: now,
  },
};

const transactions: SeedEntity<Record<string, unknown>>[] = Array.from({ length: 60 }).map((_, index) => {
  const amount = index % 5 === 0 ? -220.5 : index % 3 === 0 ? -42.75 : 120.0;
  const merchant = amount > 0 ? "Consulting Retainer" : index % 3 === 0 ? "Metro" : "HydroOne";
  const date = admin.firestore.Timestamp.fromDate(new Date(Date.now() - index * 24 * 60 * 60 * 1000));
  return {
    collection: "transactions",
    id: `txn-${index}`,
    data: {
      id: `txn-${index}`,
      ownerId: "beno",
      householdId: "demo-household",
      date,
      description: `${merchant} payment`,
      merchant,
      amount,
      currency: "CAD",
      category: amount > 0 ? "Income" : index % 3 === 0 ? "Groceries" : "Utilities",
      source: index % 4 === 0 ? "ocr" : "plaid",
      status: amount > 0 ? "cleared" : index % 2 === 0 ? "cleared" : "pending",
      tags: amount > 0 ? ["consulting"] : ["household"],
      attachmentRefs: index % 5 === 0 ? ["documents/hydroone-statement"] : [],
      splits:
        index % 5 === 0
          ? [
              { id: `split-${index}-1`, amount: -110.25, category: "Utilities" },
              { id: `split-${index}-2`, amount: -110.25, category: "Shared" },
            ]
          : [],
      createdAt: now,
    },
  };
});

const aggregateSeed: SubcollectionSeed<Record<string, unknown>> = {
  path: "households/demo-household/aggregates",
  id: "current",
  data: {
    id: "current",
    householdId: "demo-household",
    netWorth: 186430.25,
    monthlyBurn: 4820,
    runwayDays: 225,
    budgetUtilization: 0.68,
    updatedAt: now,
  },
};

async function seedCollection<T extends FirebaseFirestore.DocumentData>(seed: SeedEntity<T>) {
  const ref = db.collection(seed.collection).doc(seed.id);
  await ref.set(seed.data, { merge: true });
}

async function seed() {
  await seedCollection(userSeed);
  await seedCollection(householdSeed);
  await Promise.all(memberSeeds.map(async (seed) => {
    await db.collection(seed.path).doc(seed.id).set(seed.data, { merge: true });
  }));
  await Promise.all(contactSeeds.map(seedCollection));
  await Promise.all(accountSeeds.map(seedCollection));
  await Promise.all(incomeSeeds.map(seedCollection));
  await Promise.all(billSeeds.map(seedCollection));
  await Promise.all(goalSeeds.map(seedCollection));
  await seedCollection(budgetSeed);
  await Promise.all(automationSeeds.map(seedCollection));
  await Promise.all(merchantRuleSeeds.map(seedCollection));
  await Promise.all(settlementSeeds.map(seedCollection));
  await Promise.all(nudgeSeeds.map(seedCollection));
  await Promise.all(documentSeeds.map(seedCollection));
  await seedCollection(shoppingListSeed);

  let batch = db.batch();
  const chunkSize = 20;
  const commits: Promise<FirebaseFirestore.WriteResult[]>[] = [];

  transactions.forEach((txn, index) => {
    const ref = db.collection(txn.collection).doc(txn.id);
    batch.set(ref, txn.data, { merge: true });
    if ((index + 1) % chunkSize === 0) {
      commits.push(batch.commit());
      batch = db.batch();
    }
  });

  if (transactions.length % chunkSize !== 0) {
    commits.push(batch.commit());
  }

  await Promise.all(commits);

  await db.doc(`${aggregateSeed.path}/${aggregateSeed.id}`).set(aggregateSeed.data, { merge: true });

  console.log("Seed data successfully written");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
