"use client";

import type { ScreeningTrace } from "@/lib/api";

export function ScreeningTraceView({ traces }: { traces: ScreeningTrace[] }) {
  if (traces.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
        No trace data available. The screening agent has not recorded any execution traces yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {traces.map((trace, index) => {
        const duration =
          trace.started_at && trace.completed_at
            ? (
                (new Date(trace.completed_at).getTime() -
                  new Date(trace.started_at).getTime()) /
                1000
              ).toFixed(2)
            : null;

        return (
          <div key={trace.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {index + 1}
              </div>
              {index < traces.length - 1 && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{trace.node_name}</h4>
                {duration && (
                  <span className="text-xs text-muted-foreground">
                    {duration}s
                  </span>
                )}
                {trace.tokens_used && (
                  <span className="text-xs text-muted-foreground">
                    {trace.tokens_used} tokens
                  </span>
                )}
              </div>
              {trace.output_data && (
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(trace.output_data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
