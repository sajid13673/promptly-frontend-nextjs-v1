"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4 text-center text-[var(--text-primary)]">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary-hover)]"
      >
        Try again
      </button>
    </div>
  );
}