
import { ScheduleData, FrequencyType, Weekday, WeekdayPosition, Month, MonthlyType, YearlyType } from "./PublicationScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CalendarIcon, ClockIcon, Calendar as CalendarSquareIcon, BarChart } from "lucide-react";

interface FrequencySelectorProps {
  data: ScheduleData;
  onChange: (data: ScheduleData) => void;
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const weekdayPositions = [
  { value: "first", label: "First" },
  { value: "second", label: "Second" },
  { value: "third", label: "Third" },
  { value: "fourth", label: "Fourth" },
  { value: "last", label: "Last" },
];

const months = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

const FrequencySelector = ({ data, onChange }: FrequencySelectorProps) => {
  const handleToggleWeekday = (weekday: Weekday) => {
    const updated = data.weekdays.includes(weekday)
      ? data.weekdays.filter(day => day !== weekday)
      : [...data.weekdays, weekday];
    
    onChange({
      ...data,
      weekdays: updated.length > 0 ? updated : [weekday], // Ensure at least one day is selected
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-700">Frequency</h3>
      <Separator />
      
      <Tabs value={data.frequency} onValueChange={(value) => onChange({...data, frequency: value as FrequencyType})}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="daily" className="flex items-center justify-center">
            <ClockIcon className="h-4 w-4 mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center justify-center">
            <CalendarSquareIcon className="h-4 w-4 mr-2" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center justify-center">
            <BarChart className="h-4 w-4 mr-2" />
            Yearly
          </TabsTrigger>
        </TabsList>
        
        {/* Daily Frequency */}
        <TabsContent value="daily" className="space-y-4 animate-fade-in">
          <div className="flex items-center space-x-2">
            <Label>Repeat every</Label>
            <Input
              type="number"
              min="1"
              max="365"
              value={data.everyNDays}
              onChange={(e) => onChange({...data, everyNDays: parseInt(e.target.value) || 1})}
              className="w-16 h-9"
            />
            <span>day(s)</span>
          </div>
        </TabsContent>
        
        {/* Weekly Frequency */}
        <TabsContent value="weekly" className="space-y-4 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label>Repeat every</Label>
              <Input
                type="number"
                min="1"
                max="52"
                value={data.everyNWeeks}
                onChange={(e) => onChange({...data, everyNWeeks: parseInt(e.target.value) || 1})}
                className="w-16 h-9"
              />
              <span>week(s) on:</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={day.id}
                    checked={data.weekdays.includes(day.id as Weekday)}
                    onCheckedChange={() => handleToggleWeekday(day.id as Weekday)}
                  />
                  <Label htmlFor={day.id} className="cursor-pointer text-sm">
                    {day.label.substring(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Monthly Frequency */}
        <TabsContent value="monthly" className="space-y-4 animate-fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <Label>Repeat every</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={data.everyNMonths}
              onChange={(e) => onChange({...data, everyNMonths: parseInt(e.target.value) || 1})}
              className="w-16 h-9"
            />
            <span>month(s)</span>
          </div>
          
          <RadioGroup 
            value={data.monthlyType} 
            onValueChange={(value) => onChange({...data, monthlyType: value as MonthlyType})}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="day" id="day-based" />
              <Label htmlFor="day-based" className="cursor-pointer">On day</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={data.dayOfMonth}
                onChange={(e) => onChange({...data, dayOfMonth: parseInt(e.target.value) || 1})}
                className="w-16 h-9"
                disabled={data.monthlyType !== "day"}
              />
              <span>of the month</span>
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <RadioGroupItem value="pattern" id="pattern-based" />
              <Label htmlFor="pattern-based" className="cursor-pointer">On the</Label>
              <Select
                value={data.monthlyPosition}
                onValueChange={(value) => onChange({...data, monthlyPosition: value as WeekdayPosition})}
                disabled={data.monthlyType !== "pattern"}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {weekdayPositions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={data.monthlyWeekday}
                onValueChange={(value) => onChange({...data, monthlyWeekday: value as Weekday})}
                disabled={data.monthlyType !== "pattern"}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>of the month</span>
            </div>
          </RadioGroup>
        </TabsContent>
        
        {/* Yearly Frequency */}
        <TabsContent value="yearly" className="space-y-4 animate-fade-in">
          <RadioGroup 
            value={data.yearlyType} 
            onValueChange={(value) => onChange({...data, yearlyType: value as YearlyType})}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
              <RadioGroupItem value="fixed" id="fixed-date" />
              <Label htmlFor="fixed-date" className="cursor-pointer">Every year on</Label>
              
              <Select
                value={data.yearlyMonth}
                onValueChange={(value) => onChange({...data, yearlyMonth: value as Month})}
                disabled={data.yearlyType !== "fixed"}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                min="1"
                max="31"
                value={data.dayOfYearlyMonth}
                onChange={(e) => onChange({...data, dayOfYearlyMonth: parseInt(e.target.value) || 1})}
                className="w-16 h-9"
                disabled={data.yearlyType !== "fixed"}
              />
            </div>
            
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
              <RadioGroupItem value="pattern" id="pattern-date" />
              <Label htmlFor="pattern-date" className="cursor-pointer">On the</Label>
              
              <Select
                value={data.yearlyPosition}
                onValueChange={(value) => onChange({...data, yearlyPosition: value as WeekdayPosition})}
                disabled={data.yearlyType !== "pattern"}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {weekdayPositions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={data.yearlyWeekday}
                onValueChange={(value) => onChange({...data, yearlyWeekday: value as Weekday})}
                disabled={data.yearlyType !== "pattern"}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>of</span>
              
              <Select
                value={data.yearlyMonth}
                onValueChange={(value) => onChange({...data, yearlyMonth: value as Month})}
                disabled={data.yearlyType !== "pattern"}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrequencySelector;
