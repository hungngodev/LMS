"use client";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Skeleton } from "@/components/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { FC } from "react";

const Home: FC = () => {
	const { user } = useAuth();

	return (
		<div className="px-6 pt-4">
			{user ? (
				<Dashboard />
			) : (
				<div className="flex flex-col space-y-8">
					<Skeleton className="w-full h-10 rounded-lg" />
					<Skeleton className="w-full h-80 rounded-lg" />
				</div>
			)}
		</div>
	);
};

export default Home;
