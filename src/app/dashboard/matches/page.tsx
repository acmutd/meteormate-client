"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

type MatchPreview = {
  user_id?: string;
  score?: number;
  profile?: {
    first_name?: string;
    major?: string;
  };
};

export default function MatchesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchPreview[]>([]);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getCurrentUserIdToken();
      const response = await fetch("/api/matches/potential?limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { detail?: string };
        throw new Error(data.detail || "Failed to load matches.");
      }

      const data = (await response.json()) as { matches?: MatchPreview[] };
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load matches.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#F1EADA] bg-white p-8 flex items-center gap-3">
        <LoadingSpinner size="sm" />
        <p className="text-gray-700">Loading potential matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-900">Could not load matches</h2>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => void loadMatches()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-[#F1EADA] bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">No matches yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Complete more profile and survey details to improve match quality.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Potential Matches</h2>
      {matches.map((match, index) => (
        <div
          key={`${match.user_id ?? "match"}-${index}`}
          className="rounded-2xl border border-[#F1EADA] bg-white p-4"
        >
          <p className="font-medium text-gray-900">
            {match.profile?.first_name || "Comet Student"}
          </p>
          <p className="text-sm text-gray-600">{match.profile?.major || "Major not listed"}</p>
          <p className="mt-2 text-xs text-gray-500">
            Compatibility score: {typeof match.score === "number" ? `${Math.round(match.score)}%` : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}
