"use client";

import { Button } from "@/components/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, LucideIcon } from "lucide-react";
import { FC } from "react";

export interface NavigationLink {
	name: string;
	icon: LucideIcon;
	current?: boolean;
	href: string;
}

export const BottomNavLinks: FC = () => {
	const { logout } = useAuth();

	return (
		<div className="w-full rounded-md py-0.5">
			<Button variant="ghost" className="w-full pl-4" onClick={logout}>
				<div className="w-full text-left flex items-center font-semibold">
					<LogOut className="h-8 w-8 py-1 pr-2" />
					Logout
				</div>
			</Button>
		</div>
	);
};
