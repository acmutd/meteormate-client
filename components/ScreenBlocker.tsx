import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function ScreenBlocker() {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-black p-4">
			<div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
				<ComputerDesktopIcon className="mx-auto h-20 w-20 text-[#FF9100]" />
				<h1 className="mt-4 text-3xl font-extrabold text-black">
					MeteorMate is Built for a Larger Screen
				</h1>
				<p className="text-base text-gray-600 mt-3">
					To get the best experience, please switch to a device with a larger
					screen or resize your browser window.
				</p>
				<div className="mt-5 border-t border-gray-200 pt-2">
					<p className="text-sm font-semibold text-black">MeteorMate</p>
					<div className="flex items-center justify-center space-x-1">
						<img
							src="/images/peechi_star.png"
							alt="Peechi Star"
							className="size-5"
						/>
						<p className="text-xs text-gray-500">Powered by ACM Development</p>
					</div>
				</div>
			</div>
		</div>
	);
}
