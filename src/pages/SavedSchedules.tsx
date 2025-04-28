
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarIcon, ListIcon } from "lucide-react";
import type { ScheduleData } from "@/components/PublicationScheduler";

const SavedSchedules = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  useEffect(() => {
    const savedSchedules = localStorage.getItem("publicationSchedules");
    if (savedSchedules) {
      const parsed = JSON.parse(savedSchedules);
      // Convert date strings back to Date objects
      const schedulesWithDates = parsed.map((schedule: ScheduleData) => ({
        ...schedule,
        startDate: schedule.startDate ? new Date(schedule.startDate) : undefined,
        endDate: schedule.endDate ? new Date(schedule.endDate) : undefined,
      }));
      setSchedules(schedulesWithDates);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Schedules</h1>
          <Link to="/">
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Create New Schedule
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <ListIcon className="mr-2 h-5 w-5" />
              Publication Schedules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {schedules.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No schedules saved yet. Create your first schedule!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Type</TableHead>
                    <TableHead>End Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{schedule.name}</TableCell>
                      <TableCell className="capitalize">{schedule.frequency}</TableCell>
                      <TableCell>
                        {schedule.startDate ? format(schedule.startDate, 'PPP') : '-'}
                      </TableCell>
                      <TableCell className="capitalize">{schedule.endType}</TableCell>
                      <TableCell>
                        {schedule.endType === 'after' && `After ${schedule.endAfter} occurrences`}
                        {schedule.endType === 'on' && schedule.endDate && format(schedule.endDate, 'PPP')}
                        {schedule.endType === 'never' && 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavedSchedules;
