"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { WarningIcon } from "@/components/icons/settings-icons";

export default function DangerZoneCard() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleDeleteAccount = () => {
    if (deleteConfirmationText === "MeteorMate") {
      // TODO: Backend call to delete account
      console.log("Deleting account...");
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800">Danger zone</h3>
      <p className="mt-1 text-gray-600 mb-4">
        Permanently delete your MeteorMate account and data.
      </p>

      <div className="w-full">
        <div className="bg-[#FFF5F5] border border-[#FCA5A5] rounded-2xl p-6 shadow-sm relative">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 bg-[#C04000] rounded-lg flex items-center justify-center">
                <WarningIcon />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Account deletion</h4>
              <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                Deleting your account is permanent and cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-4 bg-[#FFE4E6] text-[#9F1239] hover:bg-[#FECDD3] border border-[#FCA5A5] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Are you absolutely sure?"
      >
        <p className="mb-4">
          This action cannot be undone. This will permanently delete your account and remove your data from our
          servers.
        </p>

        <div className="mb-4">
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-black">MeteorMate</span> to confirm
          </label>
          <input
            type="text"
            id="confirm"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="MeteorMate"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmationText !== "MeteorMate"}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              deleteConfirmationText === "MeteorMate"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Delete Account
          </button>
        </div>
      </Modal>
    </div>
  );
}
