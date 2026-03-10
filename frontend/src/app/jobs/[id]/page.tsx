"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  getJob,
  getApplications,
  type Job,
  type Application,
} from "@/lib/api";

export default function JobDetailPage() {
  const params = useParams();
  const { employerId } = useEmployer();
  const jobId = Number(params.id);

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) return;
    setLoading(true);
    Promise.all([
      getJob(jobId),
      getApplications({ job: String(jobId) }),
    ])
      .then(([j, apps]) => {
        setJob(j);
        setApplications(apps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId, employerId]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!job) return <p className="text-muted-foreground">Job not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{job.title}</h2>
          <p className="text-muted-foreground">
            {job.employer_name} &middot; {job.location || "Remote"}
          </p>
        </div>
        <Link href={`/apply/${job.id}`}>
          <Button>Apply to this Job</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <Badge key={req} variant="secondary">
                {req}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold">
          Applications ({applications.length})
        </h3>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applications yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Applied</TableHead>
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
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    {app.screening_score != null
                      ? app.screening_score
                      : "-"}
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
    </div>
  );
}
