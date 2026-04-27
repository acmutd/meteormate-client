"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, Search } from "lucide-react";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import { AnimatePresence, motion } from "framer-motion";

type Chip = {
  label: string;
  selected?: boolean;
};

type MatchUser = {
  id: number;
  name: string;
  image: string;
  images: string[];
  hasLease: boolean;
  email: string;
  phone: string;
  major?: string;
  bio?: string;
  interests?: Chip[];
  habits?: Chip[];
  expandedBio?: string;
};

const mockMatches: MatchUser[] = [
  {
    id: 1,
    name: "Usagi Tanaka",
    image: "/p3.jpg",
    images: ["/p3.jpg", "/p2.png", "/p3.jpg"],
    hasLease: true,
    email: "usagi@example.com",
    phone: "(469) 555-2108",
    //location: "Northside, UTD",
    major: "Biology - Junior",
    bio: "Friendly, clean, and loves a calm apartment vibe.",
    interests: [
      { label: "Reading", selected: true },
      { label: "Gym" },
      { label: "Cooking", selected: true },
    ],
    habits: [
      { label: "Early sleeper" },
      { label: "Non-smoker", selected: true },
      { label: "Clean kitchen", selected: true },
    ],
    expandedBio:
      "I’m looking for a roommate who is respectful, tidy, and easy to communicate with. I enjoy quiet evenings, meal prepping, and a cozy shared space.",
  },
  {
    id: 2,
    name: "Aastha Sheth",
    image: "/p2.png",
    images: ["/p2.png", "/p3.jpg", "/p2.png"],
    hasLease: false,
    email: "aastha@example.com",
    phone: "(972) 555-8841",
    //location: "Richardson, TX",
    major: "Computer Science - Senior",
    bio: "Organized, social, and loves a balanced study-life routine.",
    interests: [
      { label: "Tech", selected: true },
      { label: "Coffee runs" },
      { label: "Netflix", selected: true },
    ],
    habits: [
      { label: "Night owl" },
      { label: "Quiet study time", selected: true },
      { label: "No smoking", selected: true },
    ],
    expandedBio:
      "I like keeping the apartment clean and pretty while also making it feel warm and fun. Looking for someone respectful, chill, and communicative.",
  },
  {
    id: 3,
    name: "Maya Patel",
    image: "/p2.png",
    images: ["/p2.png", "/p3.jpg"],
    hasLease: true,
    email: "maya@example.com",
    phone: "(214) 555-3190",
    //location: "Near Campus",
    major: "Neuroscience - Sophomore",
    bio: "Calm, focused, and loves a peaceful home.",
    interests: [
      { label: "Pilates" },
      { label: "Music", selected: true },
      { label: "Baking" },
    ],
    habits: [
      { label: "Keeps shared areas clean", selected: true },
      { label: "No parties" },
    ],
    expandedBio:
      "I’m someone who values routine, cleanliness, and a peaceful environment. I’d love to live with someone considerate and easygoing.",
  },
  {
    id: 4,
    name: "Zara Ahmed",
    image: "/p3.jpg",
    images: ["/p3.jpg", "/p2.png"],
    hasLease: false,
    email: "zara@example.com",
    phone: "(945) 555-6722",
    //location: "Plano, TX",
    major: "Business - Senior",
    bio: "Outgoing, stylish, and likes a neat space.",
    interests: [
      { label: "Fashion", selected: true },
      { label: "Travel" },
      { label: "Brunch", selected: true },
    ],
    habits: [
      { label: "Organized", selected: true },
      { label: "Late sleeper" },
    ],
    expandedBio:
      "I enjoy a lively but still respectful home vibe. I’m clean, friendly, and would love a roommate who is mature and fun.",
  },
];

function LeaseBadge({ hasLease }: { hasLease: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-primary text-primary `}
    >
      {hasLease ? "Has a lease" : "No lease yet"}
    </span>
  );
}

function MatchCard({
  user,
  onViewProfile,
}: {
  user: MatchUser;
  onViewProfile: (user: MatchUser) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="absolute inset-x-0 top-0 h-24 opacity-80" />

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

          
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onViewProfile(user)}
            className="cursor-pointer flex-1 rounded-2xl bg-linear-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
          >
            View Profile
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<MatchUser | null>(null);
  const filteredMatches = useMemo(() => {
    return mockMatches.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* header  */}
        <div className="mb-8 overflow-hidden border flex border-none gap-4 justify-between">
           
          {/* search thing here */}
          <div className="relative w-full md:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your matches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-orange-100 bg-white px-11 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            />
          </div>
          <div className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-primary md:min-w-[150px]">
            {filteredMatches.length} Matches
          </div>
          
        </div>
        <AnimatePresence mode="wait">
        {selectedUser && (
          <motion.div
            key={selectedUser.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8 origin-top"
          >
          <div className="mb-8">
            <ProfileCard
              name={selectedUser.name}
              subtitle={selectedUser.major}
              images={selectedUser.images}
              tags={[
                {
                  label: selectedUser.hasLease ? "Has a lease" : "No lease yet",
                  tone: "orange",
                },
              ]}
              bio={selectedUser.bio}
              back={{
                interests: selectedUser.interests,
                habits: selectedUser.habits,
                expandedBio: selectedUser.expandedBio,
              }}
              showActions={false}
              //showSidebar={false}
            />
          </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* and matches grid */}
        {filteredMatches.length > 0 ? (
          <motion.div
            layout
            transition={{ layout: { duration: 0.45, ease: "easeInOut" } }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {filteredMatches.map((user) => (
              <motion.div key={user.id} layout>
              <MatchCard
                key={user.id}
                user={user}
                onViewProfile={setSelectedUser}
              />
              </motion.div>
            ))}
            </motion.div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-orange-200 bg-white/70 p-10 text-center">
            
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