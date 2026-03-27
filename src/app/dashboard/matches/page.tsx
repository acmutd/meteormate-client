"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, Home, Search, MessageCircle } from "lucide-react";

type MatchUser = {
  id: number;
  name: string;
  image: string;
  hasLease: boolean;
  email: string;
  phone: string;
  location: string;
  major?: string;
};

const mockMatches: MatchUser[] = [
  {
    id: 1,
    name: "Usagi Tanaka",
    image: "/p3.jpg",
    hasLease: true,
    email: "usagi@example.com",
    phone: "(469) 555-2108",
    location: "Northside, UTD",
    major: "Biology - Junior",
  },
  {
    id: 2,
    name: "Aastha Sheth",
    image: "/p2.png",
    hasLease: false,
    email: "aastha@example.com",
    phone: "(972) 555-8841",
    location: "Richardson, TX",
    major: "Computer Science - Senior",
  },
  {
    id: 3,
    name: "Maya Patel",
    image: "/p2.png",
    hasLease: true,
    email: "maya@example.com",
    phone: "(214) 555-3190",
    location: "Near Campus",
    major: "Neuroscience - Sophomore",
  },
  {
    id: 4,
    name: "Zara Ahmed",
    image: "/p3.jpg",
    hasLease: false,
    email: "zara@example.com",
    phone: "(945) 555-6722",
    location: "Plano, TX",
    major: "Business - Senior",
  },
];

function LeaseBadge({ hasLease }: { hasLease: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
        hasLease
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-orange-200 bg-orange-50 text-orange-700"
      }`}
    >
      {hasLease ? "Has a lease" : "No lease yet"}
    </span>
  );
}

function MatchCard({ user }: { user: MatchUser }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-orange-100 via-yellow-50 to-amber-100 opacity-80" />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white shadow-md">
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="truncate text-lg font-bold text-gray-900">
                  {user.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {user.major ?? "Roommate match"}
                </p>
              </div>

              <div className="rounded-full p-2 text-primary">
                <Home className="h-4 w-4 fill-current" />
              </div>
            </div>

            <div className="mt-3">
              <LeaseBadge hasLease={user.hasLease} />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 rounded-2xl bg-gradient-to-br from-white to-orange-50/60 p-4 border border-orange-100">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="h-4 w-4 text-primary" />
            <span className="truncate">{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-primary" />
            <span>{user.phone}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{user.location}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex-1 rounded-2xl bg-linear-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]">
            View Profile
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  const [search, setSearch] = useState("");

  const filteredMatches = useMemo(() => {
    return mockMatches.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* header  */}
        <div className="mb-8 overflow-hidden rounded-[28px] border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-400">
                <Home className="h-3.5 w-3.5 fill-current" />
                Your roommate matches
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Matches
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                These are the people who matched with you. Browse their details,
                check lease availability, and reach out to connect.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white px-5 py-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredMatches.length}
                </p>
                <p className="text-xs font-medium text-gray-500">Total Matches</p>
              </div>
            </div>
          </div>

          {/* search thing here */}
          <div className="mt-6 relative max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your matches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-orange-100 bg-white px-11 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* and matches grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredMatches.map((user) => (
              <MatchCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-orange-200 bg-white/70 p-10 text-center">
            <div className="mb-4 rounded-full bg-linear-to-r from-primary to-secondary">
              <Home className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No matches found</h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Try adjusting your search or keep swiping to find more roommate
              matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}