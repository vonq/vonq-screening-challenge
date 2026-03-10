"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { useEmployer } from "@/lib/employer-context";
import { getApplications, type Application } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "received", label: "Received" },
  { value: "screening", label: "Screening" },
  { value: "screened", label: "Screened" },
  { value: "interview_ready", label: "Interview Ready" },
  { value: "rejected", label: "Rejected" },
  { value: "error", label: "Error" },
];

export default function ApplicationsPage() {
  const { employerId } = useEmployer();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) return;
    setLoading(true);
    const filters: Record<string, string> = {};
    if (statusFilter !== "all") filters.status = statusFilter;
    getApplications(filters)
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [employerId, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <Link
                    href={`/applications/${app.id}`}
                    className="font-medium hover:underline"
                  >
                    {app.candidate_name}
                  </Link>
                </TableCell>
                <TableCell>{app.job_title}</TableCell>
                <TableCell>{app.employer_name}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  {app.screening_score != null ? app.screening_score : "-"}
                </TableCell>
                <TableCell>
                  {new Date(app.applied_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
