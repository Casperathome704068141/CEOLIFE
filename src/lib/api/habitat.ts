export type HabitatZoneId = "kitchen" | "garage" | "utilities" | "systems";

export type HabitatZone = {
  id: HabitatZoneId;
  label: string;
  health: number;
  issues: number;
};

export type HabitatTicket = {
  id: string;
  title: string;
  zoneId: HabitatZone["id"];
  zoneLabel: string;
  priority: "critical" | "high" | "standard";
  due: string;
  status: "Open" | "Claimed" | "Scheduled";
  assignee?: string;
  intent?: string;
  path: string;
  vendor: string;
};

export type HabitatTelemetry = {
  temperature: number;
  humidity: number;
  powerLoad: number;
  waterPressure: number;
};

export type HabitatAssetsResponse = {
  zones: HabitatZone[];
  tickets: HabitatTicket[];
  telemetry: HabitatTelemetry;
};

export type HabitatInventoryItem = {
  id: string;
  name: string;
  level: number;
  threshold: number;
  status: "critical" | "warning" | "ok";
  vendor?: string;
  eta?: string;
};

export async function getAssetStatus(): Promise<HabitatAssetsResponse> {
  return {
    zones: [
      {
        id: "kitchen",
        label: "Galley / Kitchen",
        health: 85,
        issues: 2,
      },
      {
        id: "garage",
        label: "Vehicle Bay",
        health: 100,
        issues: 0,
      },
      {
        id: "utilities",
        label: "Core Systems",
        health: 62,
        issues: 1,
      },
      {
        id: "systems",
        label: "Network / Server",
        health: 78,
        issues: 1,
      },
    ],
    tickets: [
      {
        id: "ticket-1",
        title: "Replace HVAC Filter",
        zoneId: "utilities",
        zoneLabel: "Core Systems",
        priority: "critical",
        due: "Due: Yesterday",
        status: "Open",
        intent: "Swap MERV-13 filter and reset airflow telemetry",
        path: "DIY",
        vendor: "Home Depot",
      },
      {
        id: "ticket-2",
        title: "Deep Clean Espresso Machine",
        zoneId: "kitchen",
        zoneLabel: "Galley / Kitchen",
        priority: "high",
        due: "Scheduled: Weekly",
        status: "Claimed",
        assignee: "Beno",
        intent: "Backflush, descale, and lubricate group gasket",
        path: "DIY",
        vendor: "Whole Latte Love",
      },
      {
        id: "ticket-3",
        title: "Car: Oil & Fluids",
        zoneId: "garage",
        zoneLabel: "Vehicle Bay",
        priority: "standard",
        due: "In 5 days",
        status: "Scheduled",
        intent: "Synthetic 5W-30 + tire pressure telemetry upload",
        path: "Call Pro",
        vendor: "Audi Service",
      },
      {
        id: "ticket-4",
        title: "Server Rack UPS Test",
        zoneId: "systems",
        zoneLabel: "Network / Server",
        priority: "standard",
        due: "In 10 days",
        status: "Open",
        intent: "Run 15m discharge test and log battery delta",
        path: "DIY",
        vendor: "Tripp Lite",
      },
    ],
    telemetry: {
      temperature: 72,
      humidity: 45,
      powerLoad: 68,
      waterPressure: 58,
    },
  };
}

export async function getInventoryAlerts(): Promise<HabitatInventoryItem[]> {
  return [
    {
      id: "inventory-1",
      name: "Coffee Beans",
      level: 10,
      threshold: 25,
      status: "critical",
      vendor: "Amazon Pantry",
      eta: "2d",
    },
    {
      id: "inventory-2",
      name: "Paper Towels",
      level: 60,
      threshold: 30,
      status: "ok",
      vendor: "Costco",
    },
    {
      id: "inventory-3",
      name: "Dish Soap",
      level: 25,
      threshold: 30,
      status: "warning",
      vendor: "Target",
      eta: "Same-day",
    },
    {
      id: "inventory-4",
      name: "HVAC Filters",
      level: 40,
      threshold: 35,
      status: "ok",
      vendor: "Grainger",
    },
  ];
}
