import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ScreenBlocker() {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-black p-4">
			<div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12 -mt-8">
				<ComputerDesktopIcon className="mx-auto h-20 w-20 text-[#FF9100]" />
				<h1 className="mt-4 text-3xl font-extrabold text-black">
					MeteorMate is Built for a Larger Screen
				</h1>
				<p className="text-base text-gray-600 mt-3">
					To get the best experience, please switch to a device with a larger
					screen or resize your browser window.
				</p>
				<div className="mt-5 border-t border-gray-200 pt-2 -mb-3">
					<div className="flex items-center justify-center gap-1 mt-2">
						<Image
							src="/peechi_star.webp"
							alt="MeteorMate Star Icon"
							width={20}
							height={20}
							className="size-5 self-center"
						/>
						<div className="flex flex-col items-center">
							<p className="text-sm font-semibold text-black leading-tight">MeteorMate</p>
							<p className="text-xs text-gray-500 leading-tight mt-0.5">Powered by ACM Development</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
