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

        <div className="space-y-2">
          <Label>End</Label>
          <RadioGroup
            value={data.endType}
            onValueChange={handleEndTypeChange}
            className="space-y-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="after" id="after" className="mt-2" />
              <div className="space-y-1">
                <Label htmlFor="after">After</Label>
                {data.endType === "after" && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Number of occurrences</Label>
                    <Input
                      type="number"
                      min="1"
                      value={data.endAfter}
                      onChange={(e) => onChange({ ...data, endAfter: parseInt(e.target.value) || 0 })}
                      className="w-full mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="on" id="on" className="mt-2" />
              <div className="space-y-1">
                <Label htmlFor="on">On date</Label>
                {data.endType === "on" && (
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1",
                            !data.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {data.endDate ? format(data.endDate, "PPP") : <span>Select end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={data.endDate}
                          onSelect={(date) => onChange({ ...data, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default DurationControls;
