"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import StatusLayout from "./StatusLayout";
import { getAuthErrorMessage } from "../../../utils/authErrors";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

const FIXABLE_HINTS = [
	"network",
	"timeout",
	"credentials",
	"password",
	"permission",
	"auth",
	"quota",
];

function sanitizeErrorMessage(error: Error & { digest?: string; code?: string }): string {
	if (error?.code) {
		const code = String(error.code);
		if (code.startsWith("auth/")) {
			return getAuthErrorMessage(code);
		}
	}

	const message = error?.message?.toLowerCase() || "";
	
	if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
		return "Network error. Please check your internet connection.";
	}
	
	if (message.includes("timeout")) {
		return "Request timed out. Please try again.";
	}
	
	if (message.includes("permission") || message.includes("unauthorized") || message.includes("forbidden")) {
		return "You don't have permission to perform this action.";
	}
	
	if (message.includes("rate limit") || message.includes("too many")) {
		return "Too many requests. Please slow down and try again.";
	}
	
	return "Something unexpected happened. Our team has been notified.";
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	const { message, fixable } = useMemo(() => {
		const text = error?.message?.toLowerCase() || "";
		const isFixable = FIXABLE_HINTS.some((hint) => text.includes(hint));
		const sanitizedMessage = sanitizeErrorMessage(error);
		return {
			message: sanitizedMessage,
			fixable: isFixable,
		};
	}, [error]);

	useEffect(() => {
		console.error("Route error boundary:", {
			message: error?.message,
			code: (error as any)?.code,
			digest: error?.digest,
			stack: error?.stack,
			fullError: error,
		});
	}, [error]);

	return (
		<StatusLayout
			eyebrow="Something went wrong"
			title="We hit a small cosmic bump"
			description={
				fixable
					? "Looks like a hiccup you might be able to fix. Try the quick checks below."
					: "This might be on our end. We logged the issue and a developer can help if you ping us."
			}
			accent={fixable ? "emerald" : "red"}
			actions={
				<>
					<button
						type="button"
						onClick={reset}
						className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:from-orange-500 hover:to-yellow-400"
					>
						Try Again
					</button>
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
					>
						Back to Home
					</Link>
				</>
			}
		>
			<div className="mx-auto max-w-2xl space-y-3 text-left text-white/80">
				<div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-mono text-white/80">
					<span className="text-white/60">Error:</span> {message}
					{error?.digest ? (
						<div className="mt-1 text-xs text-white/50">Digest: {error.digest}</div>
					) : null}
				</div>

				{fixable ? (
					<ul className="list-disc list-inside space-y-1 text-sm md:text-base">
						<li>Check your internet connection and refresh this page.</li>
						<li>Re-enter your credentials in case of a typo.</li>
						<li>If the issue persists, reset your password before trying again.</li>
					</ul>
				) : (
					<ul className="list-disc list-inside space-y-1 text-sm md:text-base">
						<li>We captured this error automatically for the team.</li>
						<li>
							Share a quick note on Discord with what you were doing; it helps us reproduce and fix
							faster.
						</li>
						<li>Retry once, then wait a minute before trying again.</li>
					</ul>
				)}
			</div>

			<div className="flex justify-center pt-4">
				<a
					href="https://discord.com"
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/20"
				>
					Contact a developer on Discord
				</a>
			</div>
		</StatusLayout>
	);
}

