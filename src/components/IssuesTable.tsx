
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Issue } from "@/types/schedule";

interface IssuesTableProps {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (issueId: number) => void;
}

const IssuesTable = ({ issues, onEdit, onDelete }: IssuesTableProps) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No issues found. Add your first issue!
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Mailing List Date</TableHead>
            <TableHead>Material Due</TableHead>
            <TableHead>On Sale Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.name}</TableCell>
              <TableCell>{formatDate(issue.issueDate)}</TableCell>
              <TableCell>{issue.volume || "-"}</TableCell>
              <TableCell>{formatDate(issue.mailingListDate)}</TableCell>
              <TableCell>{formatDate(issue.materialDueDate)}</TableCell>
              <TableCell>{formatDate(issue.onSaleDate)}</TableCell>
              <TableCell>{issue.quantity || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(issue)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this issue? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(issue.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IssuesTable;
