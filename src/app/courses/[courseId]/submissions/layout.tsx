"use client";

import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	return (
		<div>
			{user ? (
				<header>
					<Header3>Submissions</Header3>
				</header>
			) : (
				<Skeleton className="w-full h-10 rounded-lg" />
			)}
			{children}
		</div>
	);
}
