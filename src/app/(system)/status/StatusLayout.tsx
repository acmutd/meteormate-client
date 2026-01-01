import Image from "next/image";
import React from "react";

type StatusLayoutProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	accent?: "amber" | "emerald" | "red";
	actions?: React.ReactNode;
	children?: React.ReactNode;
};

const accentClassNames: Record<NonNullable<StatusLayoutProps["accent"]>, string> = {
	amber: "from-orange-400 via-amber-300 to-yellow-500",
	emerald: "from-emerald-400 via-green-300 to-lime-300",
	red: "from-rose-500 via-orange-400 to-amber-300",
};

export default function StatusLayout({
	eyebrow,
	title,
	description,
	accent = "amber",
	actions,
	children,
}: StatusLayoutProps) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-12 flex items-center justify-center">
			<div
				className="absolute inset-0 opacity-60"
				style={{
					backgroundImage: "url('/images/stars.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />
			<div className="absolute -top-24 -left-32 h-72 w-72 bg-gradient-to-br from-orange-500/40 to-yellow-400/15 blur-[120px] rounded-full" />
			<div className="absolute -bottom-28 -right-20 h-80 w-80 bg-gradient-to-tr from-emerald-400/30 via-cyan-300/10 to-transparent blur-[130px] rounded-full" />

			<section className="relative w-full max-w-4xl mx-auto">
				<div className="flex justify-center mb-6">
					<div className="relative">
						<Image
							src="/images/MM_logo_V1.png"
							alt="MeteorMate logo"
							width={88}
							height={88}
							className="drop-shadow-[0_8px_25px_rgba(255,145,0,0.35)]"
							priority
						/>
						<div className="absolute inset-0 blur-2xl bg-orange-400/20 rounded-full -z-10" />
					</div>
				</div>

				<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
					<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
					<div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-3xl" />

					<div className="relative px-6 py-8 md:px-12 md:py-12 space-y-6 text-center">
						{eyebrow ? (
							<div className="flex justify-center">
								<div
									className={[
										"inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.2em] font-semibold",
										"bg-white/5 border border-white/10 text-white/80",
									].join(" ")}
								>
									<span
										className={`h-2 w-2 rounded-full bg-gradient-to-br ${accentClassNames[accent]}`}
									/>
									{eyebrow}
								</div>
							</div>
						) : null}

						<div className="space-y-3">
							<h1 className="font-urbanist font-semibold text-3xl md:text-4xl leading-tight">
								{title}
							</h1>
							{description ? (
								<p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
									{description}
								</p>
							) : null}
						</div>

						{actions ? <div className="flex flex-wrap justify-center gap-3">{actions}</div> : null}

						{children}
					</div>
				</div>
			</section>
		</main>
	);
}

