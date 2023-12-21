"use client";

import { Skeleton } from "@/components/skeleton";
import { Header2 } from "@/components/typography/h2";
import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	return (
		<div className="px-6 py-4">
			{user ? (
				<header>
					<Header2>Locations</Header2>
				</header>
			) : (
				<Skeleton className=" w-full h-10 rounded-lg" />
			)}
			{children}
		</div>
	);
}
