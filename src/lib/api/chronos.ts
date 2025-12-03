export type ChronosBacklogItem = {
  id: string;
  title: string;
  durationMinutes: number;
  category: 'Deep Work' | 'Maintenance' | 'Admin' | 'Recovery';
  energyCost: number;
  priority: number;
  status?: 'queued' | 'in-progress' | 'scheduled';
};

export type ChronosScheduleBlock = {
  id: string;
  title: string;
  startMinutes: number; // minutes from 00:00
  durationMinutes: number;
  energyCost: number;
  category: 'Deep Work' | 'Maintenance' | 'Admin' | 'Recovery';
  intent: string;
  linkTo?: string;
};

export type ChronosSchedule = {
  dateLabel: string;
  goalVelocity: number;
  focusDuration: number;
  contextSwitchPenalty: number;
  dayUtility: number;
  blocks: ChronosScheduleBlock[];
};

export async function getScheduleData(): Promise<ChronosSchedule> {
  return {
    dateLabel: 'OCT 24, 2025',
    goalVelocity: 0.72,
    focusDuration: 4.2,
    contextSwitchPenalty: 0.18,
    dayUtility: 0.84,
    blocks: [
      {
        id: 'sched-001',
        title: 'Systems Architecture Review',
        startMinutes: 9 * 60,
        durationMinutes: 90,
        energyCost: 9,
        category: 'Deep Work',
        intent: 'Finalize API routes for flight telemetry',
        linkTo: '/capital',
      },
      {
        id: 'sched-002',
        title: 'Board Strategy Call',
        startMinutes: 12 * 60 + 30,
        durationMinutes: 60,
        energyCost: 8,
        category: 'Admin',
        intent: 'Align on Q4 launch windows',
      },
      {
        id: 'sched-003',
        title: 'Team Sync',
        startMinutes: 14 * 60,
        durationMinutes: 45,
        energyCost: 6,
        category: 'Maintenance',
        intent: 'Unblock deployment tasks',
      },
      {
        id: 'sched-004',
        title: 'Pulse: Tempo Run',
        startMinutes: 18 * 60,
        durationMinutes: 40,
        energyCost: 7,
        category: 'Recovery',
        intent: 'Conditioning for marathon prep',
        linkTo: '/pulse',
      },
    ],
  };
}

export async function getBacklog(): Promise<ChronosBacklogItem[]> {
  return [
    {
      id: 'backlog-001',
      title: 'Refine Genkit Auto-Fit prompt',
      durationMinutes: 45,
      category: 'Deep Work',
      energyCost: 9,
      priority: 5,
      status: 'queued',
    },
    {
      id: 'backlog-002',
      title: 'Prepare quarterly tax payment',
      durationMinutes: 30,
      category: 'Admin',
      energyCost: 6,
      priority: 4,
      status: 'queued',
    },
    {
      id: 'backlog-003',
      title: 'Zone 2 cardio calibration',
      durationMinutes: 40,
      category: 'Recovery',
      energyCost: 5,
      priority: 3,
      status: 'queued',
    },
    {
      id: 'backlog-004',
      title: 'Deep dive: Context switch telemetry',
      durationMinutes: 60,
      category: 'Deep Work',
      energyCost: 8,
      priority: 4,
      status: 'queued',
    },
    {
      id: 'backlog-005',
      title: 'Inbox triage + vendor replies',
      durationMinutes: 25,
      category: 'Maintenance',
      energyCost: 4,
      priority: 2,
      status: 'queued',
    },
  ];
}
