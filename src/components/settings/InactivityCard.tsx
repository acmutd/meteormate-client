"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function InactivityCard() {
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  const handleDeactivate = () => {
    // TODO: Backend call to set account inactive
    console.log("Setting account as inactive...");
    setShowInactiveModal(false);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800">Inactivity</h3>
      <p className="mt-1 text-gray-600 mb-4">Mark your account as inactive.</p>

      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs relative">
          <div className="flex gap-4">
            <div>
              <h4 className="font-medium text-gray-900 text-base">Mark your account as inactive</h4>
              <p className="text-gray-500 text-sm">
                Temporarily disable your account. You will not be matched with any users during this period.
              </p>
              <button
                type="button"
                onClick={() => setShowInactiveModal(true)}
                className="mt-4 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Set as inactive
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        title="Set account as inactive?"
      >
        <p className="mb-6">
          Setting your account as inactive will delete it in 2 years and you won't be matched with any users
          during this period.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowInactiveModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeactivate}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:opacity-80"
          >
            Confirm Deactivation
          </button>
        </div>
      </Modal>
    </div>
  );
}
