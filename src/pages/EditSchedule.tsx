
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft } from "lucide-react";
import IssuesTable from "@/components/IssuesTable";
import IssueDialog from "@/components/IssueDialog";
import { toast } from "sonner";
import type { Issue } from "@/types/schedule";
import type { ScheduleData } from "@/components/PublicationScheduler";

const EditSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const loadScheduleAndIssues = () => {
      const savedSchedules = localStorage.getItem("publicationSchedules");
      if (savedSchedules && id) {
        const schedules = JSON.parse(savedSchedules);
        const currentSchedule = schedules[Number(id)];
        if (currentSchedule) {
          // Convert dates back to Date objects
          currentSchedule.startDate = currentSchedule.startDate ? new Date(currentSchedule.startDate) : undefined;
          currentSchedule.endDate = currentSchedule.endDate ? new Date(currentSchedule.endDate) : undefined;
          setSchedule(currentSchedule);
          
          // Load issues
          const savedIssues = localStorage.getItem(`schedule_${id}_issues`);
          if (savedIssues) {
            setIssues(JSON.parse(savedIssues));
          }
        }
      }
    };

    loadScheduleAndIssues();
  }, [id]);

  const saveIssuesToStorage = (updatedIssues: Issue[]) => {
    if (id) {
      localStorage.setItem(`schedule_${id}_issues`, JSON.stringify(updatedIssues));
    }
  };

  const handleSaveIssue = (issue: Issue) => {
    let updatedIssues: Issue[];
    if (editingIssue) {
      updatedIssues = issues.map((i) => i.id === editingIssue.id ? issue : i);
      toast.success("Issue updated successfully");
    } else {
      updatedIssues = [...issues, { ...issue, id: Date.now() }];
      toast.success("Issue added successfully");
    }
    
    setIssues(updatedIssues);
    saveIssuesToStorage(updatedIssues);
    setDialogOpen(false);
    setEditingIssue(null);
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setDialogOpen(true);
  };

  const handleDeleteIssue = (issueId: number) => {
    const updatedIssues = issues.filter((issue) => issue.id !== issueId);
    setIssues(updatedIssues);
    saveIssuesToStorage(updatedIssues);
    toast.success("Issue deleted successfully");
  };

  const filteredIssues = issues.filter((issue) =>
    issue.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!schedule) {
    return <div>Schedule not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/saved-schedules")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{schedule.name}</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Issues</CardTitle>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Issue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <Input
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <IssuesTable
              issues={filteredIssues}
              onEdit={handleEditIssue}
              onDelete={handleDeleteIssue}
            />
          </CardContent>
        </Card>

        <IssueDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveIssue}
          issue={editingIssue}
        />
      </div>
    </div>
  );
};

export default EditSchedule;
