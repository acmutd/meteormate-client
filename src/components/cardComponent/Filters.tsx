"use client";

// TODO:
// Connect filter selections to the discover/matching API once backend
// filtering is implemented. Filter chips are currently visual placeholders.

export default function Filters() {
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

          <FilterChip label="No Pets" />
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