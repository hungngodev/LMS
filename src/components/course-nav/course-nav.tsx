"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { Role0Schema } from "@/models/cms/role-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import {
	BookOpenCheckIcon,
	CalendarIcon,
	ChevronRightIcon,
	ClipboardListIcon,
	FileDigitIcon,
	FileIcon,
	LayoutDashboardIcon,
	LucideIcon,
	SchoolIcon,
	UserIcon
} from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { Button } from "../button";
import { redirect, usePathname } from "next/navigation";

const allCourseNavigations = [
	{
		requiredViews: ViewEnum["courses:nav:calendar"],
		data: { name: "Calendar", icon: CalendarIcon, href: "/calendar" }
	},
	{
		requiredViews: ViewEnum["courses:nav:assignments"],
		data: {
			name: "Assignments",
			icon: ClipboardListIcon,
			href: "/assignments"
		}
	},
	{
		requiredViews: ViewEnum["courses:nav:submissions"],
		data: {
			name: "Submissions",
			icon: BookOpenCheckIcon,
			href: "/submissions"
		}
	},
	{
		requiredViews: ViewEnum["courses:nav:grades"],
		data: { name: "Grades", icon: FileDigitIcon, href: "/grades" }
	},
	{
		requiredViews: ViewEnum["courses:nav:members"],
		data: { name: "Members", icon: UserIcon, href: "/members" }
	},
	{
		requiredViews: ViewEnum["courses:nav:sessions"],
		data: { name: "Sessions", icon: SchoolIcon, href: "/sessions" }
	},
	{
		requiredViews: ViewEnum["courses:nav:documents"],
		data: { name: "Documents", icon: FileIcon, href: "/documents" }
	}
].reverse();

export interface CourseNavProps {
	courseId: string;
}

export interface CourseNavigation {
	name: string;
	href: string;
	icon: LucideIcon;
	current?: boolean;
}

const useRoles = (user: User2Schema | null) => {
	const endpoint = `/api/roles${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: roles } = useQuery(
		endpoint,
		async () => {
			const resp = await fetch(endpoint);
			const body = await resp.json();
			return z.array(Role0Schema).parse(body.docs);
		},
		{ enabled: !!user, useErrorBoundary: true }
	);
	return { roles };
};

const useCourseNavigation = (user: User2Schema | null, courseId: string) => {
	const { roles } = useRoles(user);
	const [courseNavigation, setCourseNavigation] = useState<
		CourseNavigation[]
	>([
		{
			name: "Dashboard",
			icon: LayoutDashboardIcon,
			href: `/courses/${courseId}`
		}
	]);
	useEffect(() => {
		if (!roles || !user) return;
		const userViews = getUserAllowedViews(user);
		roles.forEach((role) => {
			if (userViews.has(`courses:nav:members:${role.iamName}`)) {
				const existHref = courseNavigation.find(
					(nav) =>
						nav.href ===
						`/courses/${courseId}/members${qs.stringify(
							{ role: role.iamName },
							{ addQueryPrefix: true }
						)}`
				);
				if (!existHref) {
					setCourseNavigation([
						...courseNavigation,
						{
							name: `${role.name}s`,
							icon: UserIcon,
							href: `/courses/${courseId}/members${qs.stringify(
								{ role: role.iamName },
								{ addQueryPrefix: true }
							)}`
						}
					]);
				}
			}
		});
		allCourseNavigations.forEach((currentNav) => {
			const existHref = courseNavigation.find(
				(nav) =>
					nav.href === `/courses/${courseId}${currentNav.data.href}`
			);
			if (!existHref) {
				setCourseNavigation([
					...courseNavigation,
					{
						...currentNav.data,
						href: `/courses/${courseId}${currentNav.data.href}`
					}
				]);
			}
		});
	}, [courseId, courseNavigation, roles, user]);
	return { courseNavigation };
};

export const CourseNav: FC<CourseNavProps> = (props) => {
	const { user, status } = useAuth();
	const { courseNavigation } = useCourseNavigation(user, props.courseId);

    const pathname = usePathname();
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const handleButtonClick = (nav: CourseNavigation) => {
		setActiveItem(nav.href);
	};
	useEffect(() => {
		// Find the matching navigation link and set it as the active item
		const matchingLink = courseNavigation.find((nav) => nav.href === pathname);     

		if (matchingLink) {
			setActiveItem(matchingLink.href);
		} else {
			setActiveItem(null); // Reset the active item if the pathname doesn't match any links
		}
	}, [pathname, courseNavigation]);

	return (
		<>
			<aside className="hidden lg:block fixed inset-y-0 left-60 pt-12 w-60 border-r px-4 overflow-y-auto">
				<div className="flex flex-col">
					{status === "loading" ? (
						<>
							<Skeleton className="w-full h-10 my-1" />
							<Skeleton className="w-full h-10 my-1" />
							<Skeleton className="w-full h-10 my-1" />
							<Skeleton className="w-full h-10 my-1" />
						</>
					) : (
						<>
							{courseNavigation.map((nav) => (
								<div
									className="w-full rounded-md py-0.5"
									key={nav.name}
								>
									<Link href={nav.href} className="w-full">
										<Button
											variant={
												// nav.current
												// 	? "default"
												// 	: "ghost"
                                                activeItem === nav.href
                                                    ? "selected"
                                                    : nav.current
                                                    ? "default"
                                                    : "ghost"
                                                
											}
											className="w-full pl-4"
                                            onClick={() => handleButtonClick(nav)}
										>
											<div className="w-full text-left flex items-center font-semibold">
												<nav.icon className="h-8 w-8 py-1 pr-2" />
												{nav.name}
											</div>
										</Button>
									</Link>
								</div>
							))}
						</>
					)}
				</div>
			</aside>
			<aside className="lg:hidden block fixed top-0 h-12 left-36 overflow-y-auto">
				<div className="flex flex-row h-full items-center">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="flex flex-row items-center">
								<ChevronRightIcon className="w-8 h-8 mr-1" />
								<Header4>Course Menu</Header4>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<div className="flex flex-col">
								{status === "loading" ? (
									<>
										<Skeleton className="w-full h-10 my-1" />
										<Skeleton className="w-full h-10 my-1" />
										<Skeleton className="w-full h-10 my-1" />
										<Skeleton className="w-full h-10 my-1" />
									</>
								) : (
									<>
										{courseNavigation.map((nav) => (
											<div
												className="w-full rounded-md py-0.5"
												key={nav.name}
											>
												<Link
													href={nav.href}
													className="w-full"
												>
													<Button
														variant={
															nav.current
																? "default"
																: "ghost"
														}
														className="w-full pl-4"
													>
														<div className="w-full text-left flex items-center font-semibold">
															<nav.icon className="h-6 w-6 py-1 pr-2" />
															{nav.name}
														</div>
													</Button>
												</Link>
											</div>
										))}
									</>
								)}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</aside>
		</>
	);
};
