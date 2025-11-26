
'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCollection, useUser } from '@/firebase';
import { useMemo } from 'react';

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export default function CalendarPage() {
  const { user } = useUser();
  const { data: events, loading } = useCollection('events', {
    query: ['ownerId', '==', user?.uid],
    skip: !user,
  });

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (!events) return [];
    return events.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start.seconds * 1000),
      end: new Date(event.end.seconds * 1000),
    }));
  }, [events]);

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Your schedule at a glance." />
      <div className="h-[calc(100vh-16rem)] rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">Loading events...</div>
        ) : (
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            defaultView="week"
            style={{ color: '#fff' }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: 'hsl(var(--primary))',
                borderColor: 'hsl(var(--primary))',
              },
            })}
          />
        )}
      </div>
    </div>
  );
}
