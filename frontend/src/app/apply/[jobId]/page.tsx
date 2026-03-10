"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { useEmployer } from "@/lib/employer-context";
import {
  getCandidates,
  getApplication,
  getJob,
  submitApplication,
  type Candidate,
  type Job,
  type Application,
} from "@/lib/api";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { employerId } = useEmployer();
  const jobId = Number(params.jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!employerId) return;
    Promise.all([getJob(jobId), getCandidates()]).then(([j, c]) => {
      setJob(j);
      setCandidates(c);
    });
  }, [jobId, employerId]);

  useEffect(() => {
    if (!submittedApp || !polling) return;
    if (submittedApp.status !== "screening" && submittedApp.status !== "received") {
      setPolling(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const updated = await getApplication(submittedApp.id);
        setSubmittedApp(updated);
        if (updated.status !== "screening" && updated.status !== "received") {
          setPolling(false);
          clearInterval(interval);
          toast.success(`Screening complete: ${updated.status}`);
        }
      } catch {
        /* keep polling */
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [submittedApp, polling]);

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }
    setSubmitting(true);
    try {
      const app = await submitApplication({
        candidate: Number(selectedCandidate),
        job: jobId,
        cover_letter: coverLetter,
      });
      setSubmittedApp(app);
      setPolling(true);
      toast.success("Application submitted! Screening in progress...");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return <p className="text-muted-foreground">Loading...</p>;

  if (submittedApp) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Application Submitted
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Screening Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <StatusBadge status={submittedApp.status} />
            </div>

            {(submittedApp.status === "received" ||
              submittedApp.status === "screening") && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                Screening in progress... checking every 2 seconds
              </div>
            )}

            {submittedApp.screening_result && (
              <div>
                <h4 className="text-sm font-medium mb-1">Result</h4>
                <pre className="rounded bg-muted p-3 text-xs overflow-auto max-h-60">
                  {JSON.stringify(submittedApp.screening_result, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/applications/${submittedApp.id}`)}
              >
                View Full Details
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedApp(null);
                  setSelectedCandidate("");
                  setCoverLetter("");
                }}
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Apply: {job.title}
        </h2>
        <p className="text-muted-foreground">
          {job.employer_name} &middot; {job.location || "Remote"}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Select
              value={selectedCandidate}
              onValueChange={(v) => setSelectedCandidate(v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.full_name} ({c.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a cover letter (optional)"
              rows={6}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || !selectedCandidate}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
