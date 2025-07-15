'use client';

import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  isOpen,
  title = 'Logout?',
  subtitle = 'Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.',
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onCancel(); // Trigger cancel
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
{/* Dialog Box */}
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transition-all border border-gray-300"
      >
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{subtitle}</p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
