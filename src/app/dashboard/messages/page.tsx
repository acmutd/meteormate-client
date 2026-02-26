"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

type MessageThread = {
  id: string;
  name: string;
  lastMessage: string;
};

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
      }

      // Messaging API is not wired yet; keep an explicit empty state.
      setThreads([]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load messages.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#F1EADA] bg-white p-8 flex items-center gap-3">
        <LoadingSpinner size="sm" />
        <p className="text-gray-700">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-900">Could not load messages</h2>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => void loadThreads()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="rounded-2xl border border-[#F1EADA] bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">No messages yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Once you connect with matches, your conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Messages</h2>
      {threads.map((thread) => (
        <div key={thread.id} className="rounded-2xl border border-[#F1EADA] bg-white p-4">
          <p className="font-medium text-gray-900">{thread.name}</p>
          <p className="mt-1 text-sm text-gray-600">{thread.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}
