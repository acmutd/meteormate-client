import { Suspense } from "react";

async function DelayedContent() {
	// Simulate a slow data fetch
	await new Promise((resolve) => setTimeout(resolve, 4000));
	return (
		<div className="min-h-screen bg-black flex items-center justify-center text-white">
			<div className="text-center">
				<h1 className="text-2xl font-bold mb-4">Content loaded!</h1>
				<p>This page took 4 seconds to load, so you should have seen the loading animation with animated meteors.</p>
			</div>
		</div>
	);
}

export default function TestLoadingPage() {
	return (
		<Suspense fallback={null}>
			<DelayedContent />
		</Suspense>
	);
}

