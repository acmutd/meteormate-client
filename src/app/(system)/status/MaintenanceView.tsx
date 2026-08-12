import Link from "next/link";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import StatusLayout from "./StatusLayout";

type MaintenanceViewProps = {
	reason?: string;
};

const DEFAULT_REASON = "We're updating MeteorMate to keep matches fast and secure.";

export default function MaintenanceView({ reason }: MaintenanceViewProps) {
    return (
        <StatusLayout
            eyebrow="Scheduled Maintenance"
            title="We're polishing the experience"
            description={reason || DEFAULT_REASON}
            accent="emerald"
            actions={
                <>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 px-5 py-3 font-semibold text-black shadow-lg transition hover:from-emerald-500 hover:to-cyan-500"
                    >
						Return Home
                    </Link>
                    <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                    >
						Ping the Dev Team
                    </a>
                </>
            }
        >
            <div className="mx-auto max-w-2xl space-y-4 text-left text-white/80">
                {/* Maintenance Icon */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full" />
                        <WrenchScrewdriverIcon className="relative w-16 h-16 text-emerald-400" />
                    </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-300 mb-1">Planned Downtime</p>
                    <p className="text-white/90">
						This is a scheduled maintenance window. We&apos;re making improvements behind the scenes to enhance your experience.
                    </p>
                </div>

                <p className="font-outfit">
					The app is temporarily unavailable while we apply some upgrades. Live features will
					return automatically once the maintenance toggle is turned off.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                    <li>All background systems keep your data safe during this pause.</li>
                    <li>Try refreshing in a few minutes to see if we&apos;re back online.</li>
                    <li>
						If this feels unexpected, let us know on Discord so a developer can verify the
						switch.
                    </li>
                </ul>
            </div>
        </StatusLayout>
    );
}

