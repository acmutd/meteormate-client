"use client";

import Link from "next/link";
import { useEffect } from "react";
import StatusLayout from "./StatusLayout";

type GlobalErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error("Global error boundary:", error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<StatusLayout
					eyebrow="Critical Error"
					title="MeteorMate hit a snag"
					description="We’re pausing the app to keep everything safe. Try reloading the experience below."
					accent="red"
					actions={
						<>
							<button
								type="button"
								onClick={reset}
								className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:from-orange-500 hover:to-yellow-400"
							>
								Reload MeteorMate
							</button>
							<Link
								href="/"
								className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
							>
								Go to Home
							</Link>
						</>
					}
				>
					<div className="mx-auto max-w-2xl space-y-3 text-left text-white/80">
						<div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-mono text-white/80">
							<span className="text-white/60">Error:</span>{" "}
							{error?.message || "An unexpected error occurred."}
							{error?.digest ? (
								<div className="mt-1 text-xs text-white/50">Digest: {error.digest}</div>
							) : null}
						</div>
						<ul className="list-disc list-inside space-y-1 text-sm md:text-base">
							<li>Refresh the page to attempt a clean reset.</li>
							<li>
								If you were filling out a form, revisit it and confirm your data saved correctly.
							</li>
							<li>
								Still broken? Send the error digest and what you were doing to a developer on Discord.
							</li>
						</ul>
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
			</body>
		</html>
	);
}

