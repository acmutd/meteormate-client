"use client";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900">Unsaved Changes</h2>
        <p className="mt-2 text-sm text-gray-700">
          You have unsaved profile changes. Leaving this page will discard them.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Stay Here
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#F28C00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d97706]"
          >
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  );
}
