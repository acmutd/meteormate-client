"use client";

import { useState } from "react";

// TODO:
// Connect filter selections to the discover/matching API once backend
// filtering is implemented. Filter chips are currently visual placeholders.

export default function Filters() {
  const [minRent, setMinRent] = useState(600);
  const [maxRent, setMaxRent] = useState(1200);

  return (
    <section className="rounded-2xl border w-full lg:w-[75%] border-[#F1EADA] bg-white shadow-sm py-6 px-10">
      <div className="flex items-center gap-2 mb-5">
        <FilterIcon />
        <p className="text-sm font-semibold text-gray-900">Filters</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">
            Dealbreakers - Location
          </p>

          <div className="flex flex-wrap gap-3">
            <FilterChip label="On Campus" />
            <FilterChip label="Off Campus" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">
            Dealbreakers - Pets
          </p>

          <div className="flex flex-wrap gap-3">
            <FilterChip label="No Pets" />
            <FilterChip label="No Dogs" />
            <FilterChip label="No Cats" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">
            Dealbreakers - Drug Use
          </p>

          <div className="flex flex-wrap gap-3">
            <FilterChip label="No Alcohol" />
            <FilterChip label="No Drugs" />
            <FilterChip label="No Smoke" />
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-gray-900">
            Rent
          </p>

          <div className="w-full">
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5">
                <span className="text-xs font-medium text-gray-600">Min</span>
                <span className="text-xs text-gray-400">$</span>
                <input
                  type="number"
                  value={minRent}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value) || 0;
                    setMinRent(Math.min(nextValue, maxRent - 50));
                  }}
                  className="w-full border-none bg-transparent text-xs text-gray-900 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5">
                <span className="text-xs font-medium text-gray-600">Max</span>
                <span className="text-xs text-gray-400">$</span>
                <input
                  type="number"
                  value={maxRent}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value) || 0;
                    setMaxRent(Math.max(nextValue, minRent + 50));
                  }}
                  className="w-full border-none bg-transparent text-xs text-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Rent range</span>
              <span className="text-xs font-semibold text-gray-900">
                ${minRent} - ${maxRent}
              </span>
            </div>

            <div className="relative h-2 w-full">
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-300" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#FF9100]"
                style={{
                  left: `${(minRent / 2000) * 100}%`,
                  right: `${100 - (maxRent / 2000) * 100}%`,
                }}
              />

              <input
                type="range"
                min={0}
                max={2000}
                step={10}
                value={minRent}
                onChange={(e) => {
                  const nextValue = Number(e.target.value);
                  setMinRent(Math.min(nextValue, maxRent - 50));
                }}
                className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-gray-900 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-900"
              />

              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={maxRent}
                onChange={(e) => {
                  const nextValue = Number(e.target.value);
                  setMaxRent(Math.max(nextValue, minRent + 50));
                }}
                className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-gray-900 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-900"
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-gray-500">
              <span>$0</span>
              <span>$2,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="rounded-xl border border-gray-900 px-3 py-1 text-xs text-gray-900 transition hover:bg-gray-900 hover:text-white">
      {label}
    </button>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 text-gray-900"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
      />
    </svg>
  );
}