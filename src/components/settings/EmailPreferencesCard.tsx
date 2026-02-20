"use client";

import { useState } from "react";

export default function EmailPreferencesCard() {
  const [marketing, setMarketing] = useState(true);
  const [matches, setMatches] = useState(true);
  const [initialMarketing, setInitialMarketing] = useState(true);
  const [initialMatches, setInitialMatches] = useState(true);

  const handleSave = () => {
    // TODO: Backend call to save preferences
    console.log("Saving preferences:", { marketing, matches });
    // update initial state to current state
    setInitialMarketing(marketing);
    setInitialMatches(matches);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Email preferences</h3>

      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs relative mb-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 text-base">Marketing</h4>
              <p className="text-gray-500 text-sm">Receive promotional content</p>
            </div>
            <button
              onClick={() => setMarketing(!marketing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                marketing ? "bg-[#FF9100]" : "bg-gray-200"
              }`}
            >
              <span
                className={`${
                  marketing ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 text-base">Matches</h4>
              <p className="text-gray-500 text-sm">Receive updates on matches</p>
            </div>
            <button
              onClick={() => setMatches(!matches)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                matches ? "bg-[#FF9100]" : "bg-gray-200"
              }`}
            >
              <span className="sr-only">Enable match updates</span>
              <span
                className={`${
                  matches ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className={`relative flex items-center justify-center py-1 px-4 rounded-md text-white font-semibold text-md transition-all duration-200 ease-in-out ${
              marketing === initialMarketing && matches === initialMatches
                ? "bg-gray-300 cursor-not-allowed"
                : "cursor-pointer hover:scale-105 bg-gradient-to-r from-[#FF9100] to-[#FFC94C] hover:from-[#E68200] hover:to-[#E3B03C]"
            }`}
            onClick={handleSave}
            disabled={marketing === initialMarketing && matches === initialMatches}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
