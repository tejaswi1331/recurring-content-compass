
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleNameInput from "./ScheduleNameInput";
import DurationControls from "./DurationControls";
import FrequencySelector from "./FrequencySelector";
import NamingRules from "./NamingRules";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type FrequencyType = "daily" | "weekly" | "monthly" | "yearly";
export type EndType = "after" | "on" | "never";
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
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    name: "",
    startDate: undefined,
    endType: "never",
    endDate: undefined,
    endAfter: 10,
    frequency: "monthly",
    
    // Daily
    everyNDays: 1,
    
    // Weekly
    everyNWeeks: 1,
    weekdays: ["monday"],
    
    // Monthly
    monthlyType: "day",
    everyNMonths: 1,
    dayOfMonth: 1,
    monthlyPosition: "first",
    monthlyWeekday: "monday",
    
    // Yearly
    yearlyType: "fixed",
    yearlyMonth: "january",
    dayOfYearlyMonth: 1,
    yearlyPosition: "first",
    yearlyWeekday: "monday",

    // Naming
    namingTemplate: "{Month} {Year}"
  });

  const handleSave = () => {
    // Validate form
    if (!scheduleData.name.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }

    if (!scheduleData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (scheduleData.endType === "on" && !scheduleData.endDate) {
      toast.error("Please select an end date");
      return;
    }

    // Success case
    toast.success("Schedule saved successfully!");
    console.log("Saving schedule:", scheduleData);
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <CardTitle className="text-xl">Create Publication Schedule</CardTitle>
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
        <CardDescription>
          Configure how frequently your content will be automatically published
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <ScheduleNameInput 
          value={scheduleData.name} 
          onChange={(name) => setScheduleData({...scheduleData, name})} 
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
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationScheduler;
