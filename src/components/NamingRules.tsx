
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NamingRulesProps {
  value: string;
  onChange: (value: string) => void;
}

const TEMPLATE_VARIABLES = [
  { name: "{Month}", description: "Current month name (e.g., January)" },
  { name: "{MonthShort}", description: "Abbreviated month (e.g., Jan)" },
  { name: "{Year}", description: "Full year (e.g., 2025)" },
  { name: "{YearShort}", description: "Short year (e.g., 25)" },
  { name: "{Day}", description: "Day of month (e.g., 15)" },
  { name: "{Weekday}", description: "Day of week (e.g., Monday)" },
  { name: "{WeekdayShort}", description: "Abbreviated day (e.g., Mon)" },
  { name: "{Count}", description: "Occurrence number (e.g., 3)" },
];

const NamingRules = ({ value, onChange }: NamingRulesProps) => {
  const addVariable = (variable: string) => {
    onChange(value + " " + variable);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-gray-700">Naming Rules</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-blue-600 cursor-help">
                <InfoIcon className="h-3 w-3 mr-1" />
                How naming works
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Use template variables to create dynamic names for each scheduled publication based on its date.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="naming-template" className="text-sm">Publication Name Template</Label>
          <Input
            id="naming-template"
            placeholder="Enter naming template..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full mt-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: "{value}" → "January 2025" or "Q1 Report 2025"
          </p>
        </div>
        
        <div>
          <Label className="text-xs mb-2 block">Available Variables</Label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_VARIABLES.map((variable) => (
              <TooltipProvider key={variable.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => addVariable(variable.name)}
                    >
                      {variable.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{variable.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamingRules;
