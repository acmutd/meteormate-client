export default function ScreenBlocker() {
	return (
		<div className="flex items-center justify-center w-screen h-screen bg-black">
			<div className="text-2xl text-white text-center text-bold">
				<h1>MeteorMate is not currently supported for mobile view</h1>
				<h1>Please switch to a laptop or computer to proceed!</h1>
			</div>
		</div>
	);
}
