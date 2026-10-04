"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-[var(--surface-secondary)] p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-500/10 p-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}