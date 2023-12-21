"use client";

import { Button } from "@/components/button";
import { PUBLIC_ROUTES } from "@/content/public-routes";
import { useNavigationLinks } from "@/hooks/nav/use-navigation-links";
import { useAuth } from "@/hooks/use-auth";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { DropdownMenuItem } from "../dropdown-menu";
import { Skeleton } from "../skeleton";

export interface NavigationLink {
	name: string;
	icon: LucideIcon;
	current?: boolean;
	href: string;
}

interface Props {
	toggleDropdownMenu: () => void;
}

export const MobileNavLinks: FC<Props> = ({ toggleDropdownMenu }) => {
	const { user, status } = useAuth();

	const { navigationLinks } = useNavigationLinks(user);

	const pathname = usePathname();

	const [activeItem, setActiveItem] = useState<string | null>(null);
	const handleButtonClick = (nav: NavigationLink) => {
		toggleDropdownMenu(); // Toggle the dropdown menu
		setActiveItem(nav.href);
	};
	// Use useEffect to update the active item based on the current pathname
	useEffect(() => {
		// Find the matching navigation link and set it as the active item
		const matchingLink = navigationLinks.find(
			(nav) => nav.href === pathname
		);

		if (matchingLink) {
			setActiveItem(matchingLink.href);
		} else {
			setActiveItem(null); // Reset the active item if the pathname doesn't match any links
		}
	}, [pathname, navigationLinks]);

	if (status === "unauthenticated") {
		if (pathname && !PUBLIC_ROUTES.includes(pathname))
			return redirect("/login");
	}
	return (
		<>
			{status === "loading" ? (
				<div>
					<Skeleton className="w-full h-10 my-1" />
					<Skeleton className="w-full h-10 my-1" />
					<Skeleton className="w-full h-10 my-1" />
					<Skeleton className="w-full h-10 my-1" />
				</div>
			) : (
				<>
					{navigationLinks.map(
						(nav: NavigationLink, index: number) => (
							<DropdownMenuItem key={nav.name} asChild>
								<div className="w-full rounded-md py-0.5  ">
									<Link href={nav.href} className="w-full">
										<Button
											variant={
												activeItem === nav.href
													? "selected"
													: nav.current
													? "default"
													: "ghost"
											}
											className="w-full pl-4"
											onClick={() =>
												handleButtonClick(nav)
											}
										>
											<div className="w-full text-left flex items-center font-semibold">
												<nav.icon className="h-8 w-8 py-1 pr-2" />
												{nav.name}
											</div>
										</Button>
									</Link>
								</div>
							</DropdownMenuItem>
						)
					)}
				</>
			)}
		</>
	);
};

//
