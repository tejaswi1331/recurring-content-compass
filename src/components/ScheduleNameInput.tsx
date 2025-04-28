import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ScheduleNameInput = ({ value, onChange, disabled }: ScheduleNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="schedule-name" className="text-sm font-medium">
        Schedule Name
      </Label>
      <Input
        id="schedule-name"
        placeholder="Enter schedule name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        disabled={disabled}
      />
    </div>
  );
};

export default ScheduleNameInput;
