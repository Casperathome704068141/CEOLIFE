import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { medicationRegimen, careTeamAppointments } from "@/lib/data";
import { format, formatDistanceToNow } from "date-fns";

export default function MedicationsPage() {
  const totalTabsNeeded = medicationRegimen.reduce((sum, med) => sum + med.tabsNeeded, 0);
  const totalTabsTaken = medicationRegimen.reduce((sum, med) => sum + med.tabsTaken, 0);
  const adherence = totalTabsNeeded === 0 ? 100 : Math.round((totalTabsTaken / totalTabsNeeded) * 100);
  const remainingToday = Math.max(totalTabsNeeded - totalTabsTaken, 0);

  const regimenWithDates = medicationRegimen
    .map(med => ({
      ...med,
      refillAt: new Date(med.refillDate),
    }))
    .sort((a, b) => a.refillAt.getTime() - b.refillAt.getTime());

  const refillsWithinWeek = regimenWithDates.filter(
    med => med.refillAt.getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000,
  );

  const appointments = careTeamAppointments
    .map(appointment => ({
      ...appointment,
      dateObj: new Date(appointment.date),
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const nextAppointment = appointments[0];

  const coordinationTasks = [
    nextAppointment
      ? `Confirm transport and hydration plan for ${format(nextAppointment.dateObj, "MMM d")}`
      : "Confirm next check-in with the care team",
    refillsWithinWeek.length
      ? `Schedule refill call for ${refillsWithinWeek[0].name} (${format(refillsWithinWeek[0].refillAt, "MMM d")})`
      : "Review refill stock levels",
    "Log any pain episodes alongside medication notes",
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Medication & care log"
        description="Monitor tablets needed and swallowed, plan refills, and stay ready for doctor appointments."
        actions={
          <>
            <PagePrimaryAction>Log dose</PagePrimaryAction>
            <PageSecondaryAction>Share summary</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 xl:col-span-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Today’s adherence</CardTitle>
            <p className="text-xs text-slate-400">Stay ahead of sickle-cell triggers with consistent dosing.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Tabs swallowed</span>
                <span>
                  {totalTabsTaken} / {totalTabsNeeded}
                </span>
              </div>
              <Progress value={adherence} className="mt-3 h-2 rounded-full bg-slate-800" />
              <p className="mt-3 text-xs text-slate-400">
                {remainingToday === 0 ? "All scheduled doses complete" : `${remainingToday} tablet(s) left today`}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-xs text-slate-400">
              <p className="font-medium text-slate-200">Refill radar</p>
              {refillsWithinWeek.length ? (
                <ul className="mt-2 space-y-2">
                  {refillsWithinWeek.map(med => (
                    <li key={med.name} className="flex items-center justify-between">
                      <span>{med.name}</span>
                      <Badge variant="secondary" className="rounded-2xl bg-amber-500/10 text-amber-200">
                        {formatDistanceToNow(med.refillAt, { addSuffix: true })}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">No refills due within 7 days.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 xl:col-span-5 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Medication regimen</CardTitle>
            <p className="text-xs text-slate-400">Track tablets required, what’s already swallowed, and refill timelines.</p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-wide text-slate-400">
                  <TableHead className="w-[160px] text-slate-300">Medication</TableHead>
                  <TableHead className="text-slate-300">Schedule</TableHead>
                  <TableHead className="text-slate-300">Needed</TableHead>
                  <TableHead className="text-slate-300">Swallowed</TableHead>
                  <TableHead className="text-slate-300">Tablets left</TableHead>
                  <TableHead className="text-slate-300">Refill</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regimenWithDates.map(med => (
                  <TableRow key={med.name} className="text-sm text-slate-200">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{med.name}</p>
                        <p className="text-xs text-slate-400">{med.dosage}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{med.timing}</TableCell>
                    <TableCell>{med.tabsNeeded}</TableCell>
                    <TableCell>{med.tabsTaken}</TableCell>
                    <TableCell>{med.tabletsRemaining}</TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {format(med.refillAt, "MMM d")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-12 xl:col-span-3 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Care coordination</CardTitle>
            <p className="text-xs text-slate-400">Upcoming appointments and prep notes for the sickle-cell care team.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            {appointments.length ? (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div key={`${appointment.provider}-${appointment.date}`} className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span>{format(appointment.dateObj, "MMM d • h:mma")}</span>
                      <Badge variant="outline" className="border-slate-800 text-slate-300">
                        {formatDistanceToNow(appointment.dateObj, { addSuffix: true })}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white">{appointment.provider}</p>
                    <p className="text-xs text-slate-400">{appointment.focus}</p>
                    <p className="mt-2 text-xs text-slate-500">{appointment.location}</p>
                    {appointment.preparation ? (
                      <p className="mt-2 text-xs text-slate-500">Prep: {appointment.preparation}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments scheduled.</p>
            )}

            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-xs text-slate-400">
              <p className="font-medium text-slate-200">Action queue</p>
              <ul className="mt-2 space-y-1">
                {coordinationTasks.map(task => (
                  <li key={task}>• {task}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
