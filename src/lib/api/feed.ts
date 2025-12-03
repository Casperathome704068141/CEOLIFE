export type FeedItem = {
  id: string;
  type: 'finance' | 'calendar' | 'task' | 'health' | 'alert';
  title: string;
  detail: string;
  timestamp: string;
  action?: string;
};

export async function getFeed(): Promise<FeedItem[]> {
  return [
    {
      id: 'feed-001',
      type: 'finance',
      title: 'High Spend Detected',
      detail: 'Amazon AWS charged $420.00. Exceeds monthly average by 20%.',
      timestamp: '2h ago',
    },
    {
      id: 'feed-002',
      type: 'calendar',
      title: 'Deep Work Block',
      detail: 'Starts in 15 minutes. Duration: 2 hours.',
      timestamp: 'Today 9:45a',
      action: 'Start Now',
    },
    {
      id: 'feed-003',
      type: 'task',
      title: 'Tax Packet Ready',
      detail: 'Vault extracted 3 missing forms for Q4 filing.',
      timestamp: 'Today 8:12a',
      action: 'Review Docs',
    },
    {
      id: 'feed-004',
      type: 'health',
      title: 'HRV Trending Down',
      detail: 'Average HRV down 12% vs last week. Suggest 30m Zone 2.',
      timestamp: 'Today 6:30a',
      action: 'Schedule Recovery',
    },
    {
      id: 'feed-005',
      type: 'alert',
      title: 'System Update',
      detail: 'Chronos and Capital synced overnight. No conflicts detected.',
      timestamp: 'Yesterday',
    },
  ];
}
