import ScreenBlocker from "../../components/ScreenBlocker";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="m-0 p-0">
				<div className="hidden md:block">{children}</div>
				<div className="block md:hidden">
					<ScreenBlocker />
				</div>
			</body>
		</html>
	);
}
