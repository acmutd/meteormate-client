"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
	id: string;
	type: ToastType;
	title: string;
	description?: string;
	durationMs?: number;
};

type ToastContextValue = {
	toast: (t: Omit<Toast, "id">) => void;
	dismiss: (id: string) => void;
	clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const typeStyles: Record<ToastType, { ring: string; iconBg: string; icon: React.ReactNode }> = {
	success: {
		ring: "ring-emerald-400/30",
		iconBg: "bg-emerald-500/15 text-emerald-300",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
				<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		),
	},
	error: {
		ring: "ring-rose-400/30",
		iconBg: "bg-rose-500/15 text-rose-300",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
				<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		),
	},
	info: {
		ring: "ring-amber-300/30",
		iconBg: "bg-amber-400/15 text-amber-200",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
				<path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
			</svg>
		),
	},
};

function uid() {
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const timers = useRef<Map<string, number>>(new Map());

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
		const timer = timers.current.get(id);
		if (timer) {
			window.clearTimeout(timer);
			timers.current.delete(id);
		}
	}, []);

	const clear = useCallback(() => {
		setToasts([]);
		timers.current.forEach((t) => window.clearTimeout(t));
		timers.current.clear();
	}, []);

	const toast = useCallback(
		(t: Omit<Toast, "id">) => {
			const id = uid();
			const durationMs = t.durationMs ?? (t.type === "error" ? 5000 : 3500);
			const next: Toast = { ...t, id, durationMs };
			setToasts((prev) => [next, ...prev].slice(0, 4));

			const timer = window.setTimeout(() => dismiss(id), durationMs);
			timers.current.set(id, timer);
		},
		[dismiss]
	);

	const value = useMemo<ToastContextValue>(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="fixed right-4 top-4 z-[9999] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
				{toasts.map((t) => {
					const s = typeStyles[t.type];
					return (
						<div
							key={t.id}
							className={[
								"relative overflow-hidden rounded-2xl border border-white/10 bg-black/80 text-white shadow-2xl backdrop-blur-xl",
								"ring-1",
								s.ring,
							].join(" ")}
							role="status"
							aria-live="polite"
						>
							<div className="flex gap-3 px-4 py-3">
								<div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
									{s.icon}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<p className="font-urbanist font-semibold text-sm">{t.title}</p>
										<button
											type="button"
											onClick={() => dismiss(t.id)}
											className="text-white/50 hover:text-white/80 transition"
											aria-label="Dismiss notification"
										>
											×
										</button>
									</div>
									{t.description ? (
										<p className="mt-1 text-xs text-white/70 leading-snug">{t.description}</p>
									) : null}
								</div>
							</div>
							<div className="h-[2px] w-full bg-white/5" />
						</div>
					);
				})}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return ctx;
}


