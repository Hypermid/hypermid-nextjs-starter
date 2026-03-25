"use client";

import type { SwapStep } from "@/hooks/useSwapStatus";

interface StatusTrackerProps {
  step: SwapStep;
  error?: string | null;
}

const STEPS: { key: SwapStep; label: string }[] = [
  { key: "initiated", label: "Initiated" },
  { key: "processing", label: "Processing" },
  { key: "complete", label: "Complete" },
];

export default function StatusTracker({ step, error }: StatusTrackerProps) {
  if (step === "idle") return null;

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isFailed = step === "failed";

  return (
    <div className="bg-surface-200 border border-border rounded-xl p-4 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Swap Status
        </span>
        {isFailed && (
          <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full font-medium">
            Failed
          </span>
        )}
        {step === "complete" && (
          <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full font-medium">
            Complete
          </span>
        )}
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const isActive = s.key === step;
          const isPast = stepIndex > i || step === "complete";
          const isCurrent = isActive && !isFailed;

          return (
            <div key={s.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isPast
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-accent text-white animate-pulse"
                        : isFailed && isActive
                          ? "bg-red-500 text-white"
                          : "bg-surface-300 text-gray-500"
                  }`}
                >
                  {isPast && !isActive ? (
                    <CheckIcon />
                  ) : isFailed && isActive ? (
                    <XIcon />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 ${
                    isPast || isCurrent ? "text-white" : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded ${
                    isPast ? "bg-green-500" : "bg-surface-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Processing indicator */}
      {step === "processing" && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Spinner />
          Waiting for on-chain confirmation...
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7L6 10L11 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M4 4L10 10M10 4L4 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-accent"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
