import { AuthProvider } from "@/components/auth-provider";
import { NewNav } from "@/components/nav/nav";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/toaster";
import { hexToRgb } from "@/utils/hex-to-rgb";
import { hslToCSShsl } from "@/utils/hsl-to-css-hsl";
import { RGBToHSL } from "@/utils/rgb-to-hsl";
import { Inter } from "next/font/google";
import { CSSProperties, ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Seamless LMS",
	description: "Seamless Technology Learning Management System"
};

export default function RootLayout({ children }: { children: ReactNode }) {
	const color = {
		"--primary": hslToCSShsl(RGBToHSL(...hexToRgb("#164B60"))),
		"--primary-foreground": hslToCSShsl(RGBToHSL(...hexToRgb("#FFFFFE"))),
		"--secondary": hslToCSShsl(RGBToHSL(...hexToRgb("#1B6B93"))),
		"--secondary-foreground": hslToCSShsl(RGBToHSL(...hexToRgb("#FFFFFE"))),
		"--destructive": hslToCSShsl(RGBToHSL(...hexToRgb("#EF4565"))),
		"--destructive-foreground": hslToCSShsl(
			RGBToHSL(...hexToRgb("#EF4565"))
		),
		"--muted": hslToCSShsl(RGBToHSL(...hexToRgb("#E3ECF4"))),
		"--muted-foreground": hslToCSShsl(RGBToHSL(...hexToRgb("#164B60")))
	} as CSSProperties;
	return (
		<html lang="en" className="h-full bg-white" style={{ ...color }}>
			<body className={`${inter.className} h-full`}>
				<AuthProvider>
					<QueryProvider>
						<NewNav />
						<main className="lg:ml-60 lg:mt-0 mt-12 ml-0">
							{children}
						</main>
					</QueryProvider>
				</AuthProvider>
				<Toaster />
			</body>
		</html>
	);
}
