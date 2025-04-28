import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, InfoIcon, ListIcon } from "lucide-react";
import { toast } from "sonner";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";
import ScheduleNameInput from "./ScheduleNameInput";
import DurationControls from "./DurationControls";
import FrequencySelector from "./FrequencySelector";
import NamingRules from "./NamingRules";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type FrequencyType = "daily" | "weekly" | "monthly" | "yearly";
export type EndType = "after" | "on";
export type MonthlyType = "day" | "pattern";
export type YearlyType = "fixed" | "pattern";
export type WeekdayPosition = "first" | "second" | "third" | "fourth" | "last";
export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type Month = "january" | "february" | "march" | "april" | "may" | "june" | "july" | "august" | "september" | "october" | "november" | "december";

export interface ScheduleData {
  name: string;
  startDate: Date | undefined;
  endType: EndType;
  endDate: Date | undefined;
  endAfter: number;
  frequency: FrequencyType;
  
  // Daily
  everyNDays: number;
  
  // Weekly
  everyNWeeks: number;
  weekdays: Weekday[];
  
  // Monthly
  monthlyType: MonthlyType;
  everyNMonths: number;
  dayOfMonth: number;
  monthlyPosition: WeekdayPosition;
  monthlyWeekday: Weekday;
  
  // Yearly
  yearlyType: YearlyType;
  yearlyMonth: Month;
  dayOfYearlyMonth: number;
  yearlyPosition: WeekdayPosition;
  yearlyWeekday: Weekday;

  // Naming
  namingTemplate: string;
}

const PublicationScheduler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingScheduleName = searchParams.get('scheduleName');
  const scheduleIndex = searchParams.get('scheduleIndex');

  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    name: existingScheduleName || "",
    startDate: undefined,
    endType: "after",
    endDate: undefined,
    endAfter: 10,
    frequency: "monthly",
    everyNDays: 1,
    everyNWeeks: 1,
    weekdays: ["monday"],
    monthlyType: "day",
    everyNMonths: 1,
    dayOfMonth: 1,
    monthlyPosition: "first",
    monthlyWeekday: "monday",
    yearlyType: "fixed",
    yearlyMonth: "january",
    dayOfYearlyMonth: 1,
    yearlyPosition: "first",
    yearlyWeekday: "monday",
    namingTemplate: "{Month} {Year}"
  });

  const generateInitialIssues = (schedule: ScheduleData) => {
    if (!schedule.startDate || schedule.endType !== 'after') {
      return [];
    }

    const issues = [];
    let currentDate = new Date(schedule.startDate);
    let count = 0;

    while (count < schedule.endAfter) {
      const issueDate = new Date(currentDate);
      let shouldAddIssue = false;

      switch (schedule.frequency) {
        case 'daily':
          shouldAddIssue = true;
          currentDate = addDays(currentDate, schedule.everyNDays);
          break;

        case 'weekly':
          // For weekly, we need to check if the current day is in the selected weekdays
          const currentDay = currentDate.getDay();
          const weekdayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          if (schedule.weekdays.includes(weekdayIndex[currentDay] as any)) {
            shouldAddIssue = true;
          }
          if (currentDate === schedule.startDate || shouldAddIssue) {
            currentDate = addWeeks(currentDate, schedule.everyNWeeks);
          } else {
            currentDate = addDays(currentDate, 1);
          }
          break;

        case 'monthly':
          shouldAddIssue = true;
          currentDate = addMonths(currentDate, schedule.everyNMonths);
          break;

        case 'yearly':
          shouldAddIssue = true;
          currentDate = addYears(currentDate, 1);
          break;
      }

      if (shouldAddIssue) {
        issues.push({
          id: Date.now() + count,
          name: `${schedule.name} - ${format(issueDate, 'MMM yyyy')}`,
          issueDate: issueDate.toISOString(),
          volume: `Vol. ${count + 1}`,
        });
        count++;
      }
    }

    return issues;
  };

  const handleSave = () => {
    if (!scheduleData.name.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }

    if (!scheduleData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (scheduleData.endType === "after" && (!scheduleData.endAfter || scheduleData.endAfter <= 0)) {
      toast.error("Please enter a valid number of occurrences");
      return;
    }

    if (scheduleData.endType === "on" && !scheduleData.endDate) {
      toast.error("Please select an end date");
      return;
    }

    const newIssues = generateInitialIssues(scheduleData);

    if (scheduleIndex) {
      // If we have a scheduleIndex, append to existing issues
      const existingIssues = localStorage.getItem(`schedule_${scheduleIndex}_issues`);
      const currentIssues = existingIssues ? JSON.parse(existingIssues) : [];
      
      // Append new issues to existing ones
      const updatedIssues = [...currentIssues, ...newIssues];
      localStorage.setItem(`schedule_${scheduleIndex}_issues`, JSON.stringify(updatedIssues));
      
      toast.success("Issues added successfully!");
      navigate(`/edit-schedule/${scheduleIndex}`);
    } else {
      // Creating a new schedule
      const existingSchedules = localStorage.getItem("publicationSchedules");
      const schedules = existingSchedules ? JSON.parse(existingSchedules) : [];
      const newIndex = schedules.length;
      schedules.push(scheduleData);
      localStorage.setItem("publicationSchedules", JSON.stringify(schedules));

      if (newIssues.length > 0) {
        localStorage.setItem(`schedule_${newIndex}_issues`, JSON.stringify(newIssues));
      }
      toast.success("Schedule saved successfully!");
      navigate("/saved-schedules");
    }
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-xl">
              {existingScheduleName ? 'Add Issues to Schedule' : 'Create Publication Schedule'}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Set up a recurring publication schedule for your content or reports.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="outline" onClick={() => navigate("/saved-schedules")}>
            <ListIcon className="mr-2 h-4 w-4" />
            View Schedules
          </Button>
        </div>
        <CardDescription>
          {existingScheduleName 
            ? 'Add more issues to your existing publication schedule'
            : 'Configure how frequently your content will be automatically published'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <ScheduleNameInput 
          value={scheduleData.name} 
          onChange={(name) => setScheduleData({...scheduleData, name})}
          disabled={!!existingScheduleName}
        />
        
        <DurationControls
          data={scheduleData}
          onChange={setScheduleData}
        />
        
        <FrequencySelector
          data={scheduleData}
          onChange={setScheduleData}
        />
        
        <NamingRules
          value={scheduleData.namingTemplate}
          onChange={(namingTemplate) => setScheduleData({...scheduleData, namingTemplate})}
        />
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate("/saved-schedules")}>Cancel</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {existingScheduleName ? 'Add Issues' : 'Save Schedule'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationScheduler;
