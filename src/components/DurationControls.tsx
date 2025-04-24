
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScheduleData, EndType } from "./PublicationScheduler";

interface DurationControlsProps {
  data: ScheduleData;
  onChange: (data: ScheduleData) => void;
}

const DurationControls = ({ data, onChange }: DurationControlsProps) => {
  const handleEndTypeChange = (value: EndType) => {
    onChange({ ...data, endType: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-700">Duration</h3>
      <Separator />
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-sm">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : <span>Select start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => onChange({ ...data, startDate: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-sm">End</Label>
          <RadioGroup 
            value={data.endType} 
            onValueChange={(value) => handleEndTypeChange(value as EndType)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never" className="cursor-pointer">Never</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="after" id="after" />
              <Label htmlFor="after" className="cursor-pointer">End after</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={data.endAfter}
                onChange={(e) => onChange({ ...data, endAfter: parseInt(e.target.value) || 1 })}
                className="w-20 h-8"
                disabled={data.endType !== "after"}
              />
              <span className="text-gray-600">occurrences</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on" id="on" />
              <Label htmlFor="on" className="cursor-pointer">End on</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !data.endDate && "text-muted-foreground"
                    )}
                    disabled={data.endType !== "on"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.endDate ? format(data.endDate, "PPP") : <span>Select end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.endDate}
                    onSelect={(date) => onChange({ ...data, endDate: date })}
                    initialFocus
                    disabled={(date) => date < (data.startDate || new Date())}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default DurationControls;
