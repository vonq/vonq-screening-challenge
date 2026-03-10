"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { ScreeningTraceView } from "@/components/screening-trace";
import { useEmployer } from "@/lib/employer-context";
import {
  getApplication,
  getApplicationTrace,
  overrideDecision,
  type Application,
  type ScreeningTrace,
  ApiError,
} from "@/lib/api";

const STATUS_STEPS = [
  "received",
  "screening",
  "screened",
  "interview_ready",
] as const;

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const isRejected = currentStatus === "rejected";
  const isError = currentStatus === "error";

  const activeIndex = STATUS_STEPS.indexOf(
    currentStatus as (typeof STATUS_STEPS)[number],
  );

  return (
    <div className="flex items-center gap-2">
      {STATUS_STEPS.map((step, i) => {
        const isCurrent = step === currentStatus;
        const isPast = activeIndex >= 0 && i < activeIndex;
        const isActive = isCurrent || isPast;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isPast || isActive
                    ? "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {step.replace("_", " ")}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`h-px w-6 ${isPast ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
      {isRejected && (
        <>
          <div className="h-px w-6 bg-border" />
          <div className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
            rejected
          </div>
        </>
      )}
      {isError && (
        <>
          <div className="h-px w-6 bg-border" />
          <div className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
            error
          </div>
        </>
      )}
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const { employerId } = useEmployer();
  const appId = Number(params.id);

  const [application, setApplication] = useState<Application | null>(null);
  const [traces, setTraces] = useState<ScreeningTrace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) return;
    setLoading(true);
    Promise.all([getApplication(appId), getApplicationTrace(appId)])
      .then(([app, t]) => {
        setApplication(app);
        setTraces(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appId, employerId]);

  useEffect(() => {
    if (
      !application ||
      (application.status !== "screening" && application.status !== "received")
    )
      return;

    const interval = setInterval(async () => {
      try {
        const updated = await getApplication(appId);
        setApplication(updated);
        if (updated.status !== "screening" && updated.status !== "received") {
          clearInterval(interval);
          const updatedTraces = await getApplicationTrace(appId);
          setTraces(updatedTraces);
        }
      } catch {
        /* keep polling */
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [application, appId]);

  const handleOverride = async (decision: string) => {
    try {
      await overrideDecision(appId, {
        decision,
        reason: "Manual override by evaluator",
      });
      const updated = await getApplication(appId);
      setApplication(updated);
      toast.success("Decision overridden");
    } catch (err) {
      if (err instanceof ApiError && err.status === 501) {
        toast.error("Override endpoint not implemented yet (501)");
      } else {
        toast.error("Failed to override decision");
      }
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!application) return <p className="text-muted-foreground">Application not found.</p>;

  const result = application.screening_result as Record<string, unknown> | null;
  const decision = result?.decision as string | undefined;
  const reasoning = result?.reasoning as string | undefined;
  const questions = (result?.interview_questions as string[]) ?? [];
  const screeningResults = (result?.screening_results as Record<string, unknown>[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {application.candidate_name}
        </h2>
        <p className="text-muted-foreground">
          Applied to {application.job_title} at {application.employer_name}
        </p>
      </div>

      <StatusTimeline currentStatus={application.status} />

      {(application.status === "received" ||
        application.status === "screening") && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              Screening in progress... auto-refreshing every 2 seconds
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Screening Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Decision: </span>
                {decision && (
                  <Badge
                    variant={
                      decision.toLowerCase() === "accept"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {decision}
                  </Badge>
                )}
              </div>
              {application.screening_score != null && (
                <div>
                  <span className="text-sm text-muted-foreground">Score: </span>
                  <span className="font-semibold">
                    {application.screening_score}
                  </span>
                </div>
              )}
            </div>

            {reasoning && (
              <div>
                <h4 className="text-sm font-medium mb-1">Reasoning</h4>
                <p className="text-sm text-muted-foreground">{reasoning}</p>
              </div>
            )}

            {screeningResults.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Screening Data</h4>
                <pre className="rounded bg-muted p-3 text-xs overflow-auto max-h-60">
                  {JSON.stringify(screeningResults, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="text-sm">
                  {q}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="mb-3 text-lg font-semibold">Agent Trace</h3>
        <ScreeningTraceView traces={traces} />
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Manual Override</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Override the agent&apos;s decision manually.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => handleOverride("accept")} variant="default">
              Override: Accept
            </Button>
            <Button
              onClick={() => handleOverride("reject")}
              variant="destructive"
            >
              Override: Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
