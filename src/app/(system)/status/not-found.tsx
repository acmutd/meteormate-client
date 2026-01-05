import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import StatusLayout from "./StatusLayout";

export default function NotFoundPage() {
	return (
		<StatusLayout
			eyebrow="404 Error"
			title="Lost among the meteors"
			description="The page you're looking for drifted off course. Let's guide you back to somewhere safe."
			accent="amber"
			actions={
				<>
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:from-orange-500 hover:to-yellow-400"
					>
						Back to Home
					</Link>
					<a
						href="https://discord.gg/qWsU6bPD2a"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
					>
						Contact on Discord
					</a>
				</>
			}
		>
			<div className="mx-auto max-w-2xl space-y-[clamp(0.5rem,2vh,1rem)] text-left text-white/80">
				{/*/!* 404 Icon *!/*/}
				{/*<div className="flex justify-center mb-[clamp(0.25rem,1.5vh,0.75rem)]">*/}
				{/*	<div className="relative">*/}
				{/*		<div className="absolute inset-0 bg-orange-400/30 blur-2xl rounded-full" />*/}
				{/*		<MagnifyingGlassIcon className="relative w-[clamp(3rem,8vh,4rem)] h-[clamp(3rem,8vh,4rem)] text-orange-400" />*/}
				{/*	</div>*/}
				{/*</div>*/}

				<div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.75rem,1.5vh,0.875rem)]">
					<p className="font-semibold text-orange-300 mb-1">Page Not Found</p>
					<p className="text-white/90">
						This page doesn't exist or may have been moved. This is not a planned downtime - just a missing page.
					</p>
				</div>

				<p className="font-outfit text-[clamp(0.75rem,1.5vh,0.875rem)]">
					This link might be outdated, or we renamed the page while polishing the experience.
				</p>
				<ul className="list-disc list-inside space-y-0.5 text-[clamp(0.7rem,1.3vh,0.8rem)]">
					<li>Check the URL for typos or trailing slashes.</li>
					<li>
						If you think this should exist, send us a quick note and we'll get it back on
						track.
					</li>
				</ul>
			</div>
		</StatusLayout>
	);
}

