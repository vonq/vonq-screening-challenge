"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { useEmployer } from "@/lib/employer-context";
import { getApplications, type Application } from "@/lib/api";

export default function Dashboard() {
  const { employerId } = useEmployer();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) return;
    setLoading(true);
    getApplications()
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [employerId]);

  const counts = {
    total: applications.length,
    screening: applications.filter((a) => a.status === "screening").length,
    interview_ready: applications.filter((a) => a.status === "interview_ready").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const recent = applications.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/jobs">
          <Button>Submit New Application</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard title="Total Applications" value={counts.total} />
            <StatCard
              title="Screening In Progress"
              value={counts.screening}
              description="Awaiting agent results"
            />
            <StatCard
              title="Interview Ready"
              value={counts.interview_ready}
              description="Accepted by agent"
            />
            <StatCard
              title="Rejected"
              value={counts.rejected}
              description="Not a fit"
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Recent Activity</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <div className="space-y-2">
                {recent.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <span className="font-medium">{app.candidate_name}</span>
                      <span className="mx-2 text-muted-foreground">&rarr;</span>
                      <span>{app.job_title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
