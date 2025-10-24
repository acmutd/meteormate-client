// import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
// import "../src/app/globals.css";

// export default function ScreenBlocker() {
// 	return (
// 		<div className="flex items-center justify-center h-screen">
// 			<div className="flex flex-col items-center justify-center h-screen w-full bg-black p-4">
// 				<div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
// 					<ComputerDesktopIcon className="mx-auto h-20 w-20 text-[#FF9100]" />
// 					<h1 className="mt-6 text-2xl outfit-extrabold text-black">
// 						This App is Built for a Larger Screen
// 					</h1>
// 					<p className="mt-1 text-sm outfit-regular text-gray-600">
// 						To get the best experience, please switch to a device with a larger
// 						screen or resize your browser window if you can.
// 					</p>
// 				</div>
// 				<div className="flex items-center justify-center mt-4 space-x-3">
// 					<img
// 						src="/images/peechi_star.png"
// 						alt="Peechi Duo"
// 						className="size-9"
// 					/>
// 					<div className="flex flex-col items-start">
// 						<p className="text-lg font-semibold text-[#FF9100] leading-tight">
// 							MeteorMate
// 						</p>
// 						<p className="text-sm text-[#FF9100] leading-tight">
// 							Powered by ACM Development
// 						</p>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

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
					<div className="flex items-center justify-center mt-2 space-x-2">
						<img
							src="/images/peechi_star.png"
							alt="Peechi Star"
							className="size-9"
						/>
						<div className="flex flex-col items-start">
							<p className="text-sm font-semibold text-black leading-tight">
								MeteorMate
							</p>
							<p className="text-xs text-gray-500 leading-tight">
								Powered by ACM Development
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
