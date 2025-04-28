
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types/schedule";

interface IssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (issue: Issue) => void;
  issue?: Issue | null;
}

const IssueDialog = ({ open, onOpenChange, onSave, issue }: IssueDialogProps) => {
  const [formData, setFormData] = useState<Partial<Issue>>({
    name: "",
    issueDate: "",
    volume: "",
    mailingListDate: "",
    reservationDeadline: "",
    materialDueDate: "",
    filesShipDate: "",
    proofsApprovedDate: "",
    periodicalClass: "",
    accountingCloseDate: "",
    onSaleDate: "",
    quantity: undefined,
  });

  useEffect(() => {
    if (issue) {
      setFormData(issue);
    } else {
      setFormData({
        name: "",
        issueDate: "",
        volume: "",
        mailingListDate: "",
        reservationDeadline: "",
        materialDueDate: "",
        filesShipDate: "",
        proofsApprovedDate: "",
        periodicalClass: "",
        accountingCloseDate: "",
        onSaleDate: "",
        quantity: undefined,
      });
    }
  }, [issue]);

  const handleSave = () => {
    if (!formData.name || !formData.issueDate) {
      return;
    }
    onSave(formData as Issue);
  };

  const handleDateSelect = (field: keyof Issue) => (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date.toISOString(),
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Issue" : "Add New Issue"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Issue Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter issue name"
              />
            </div>

            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issueDate ? (
                      format(new Date(formData.issueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate ? new Date(formData.issueDate) : undefined}
                    onSelect={handleDateSelect("issueDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                placeholder="Enter volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.materialDueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.materialDueDate ? (
                      format(new Date(formData.materialDueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.materialDueDate ? new Date(formData.materialDueDate) : undefined}
                    onSelect={handleDateSelect("materialDueDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>On Sale Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.onSaleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.onSaleDate ? (
                      format(new Date(formData.onSaleDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.onSaleDate ? new Date(formData.onSaleDate) : undefined}
                    onSelect={handleDateSelect("onSaleDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
