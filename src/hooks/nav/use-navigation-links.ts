import { NavigationLink } from "@/components/nav/nav-links";
import { useAllRoles } from "@/hooks/roles/use-all-roles";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import {
	BookIcon,
	BookOpenCheckIcon,
	FileDigitIcon,
	GraduationCapIcon,
	LayoutDashboardIcon,
	MapPinIcon,
	UserIcon,
	VenetianMaskIcon
} from "lucide-react";
import qs from "qs";
import { useEffect, useState } from "react";

const allNavigations = [
	{
		requiredViews: ViewEnum["nav:subjects"],
		data: { name: "Subjects", icon: BookOpenCheckIcon, href: `/subjects` }
	},
	{
		requiredViews: ViewEnum["nav:locations"],
		data: { name: "Locations", icon: MapPinIcon, href: `/locations` }
	},
	{
		requiredViews: ViewEnum["nav:grades"],
		data: { name: "Grades", icon: FileDigitIcon, href: `/grades` }
	},
	{
		requiredViews: ViewEnum["nav:submissions"],
		data: {
			name: "Submissions",
			icon: BookOpenCheckIcon,
			href: `/submissions`
		}
	},
	{
		requiredViews: ViewEnum["nav:assignments"],
		data: { name: "Assignments", icon: BookIcon, href: `/assignments` }
	},
	{
		requiredViews: ViewEnum["nav:courses"],
		data: { name: "Courses", icon: GraduationCapIcon, href: `/courses` }
	},
	{
		requiredViews: ViewEnum["nav:users"],
		data: { name: "Users", icon: UserIcon, href: `/users` }
	},
	{
		requiredViews: ViewEnum["nav:roles"],
		data: { name: "Roles", icon: VenetianMaskIcon, href: `/roles` }
	}
];

export const useNavigationLinks = (user: User2Schema | null) => {
	const { roles } = useAllRoles();

	const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([
		{ name: "Dashboard", icon: LayoutDashboardIcon, href: "/" }
	]);
	useEffect(() => {
		if (!roles || !user) return;
		const userViews = getUserAllowedViews(user);
		roles.forEach((role) => {
			if (userViews.has(`nav:users:${role.iamName}`)) {
				const existHref = navigationLinks.find(
					(nav) =>
						nav.href ===
						`/users${qs.stringify(
							{ role: role.id },
							{ addQueryPrefix: true }
						)}`
				);
				if (!existHref) {
					setNavigationLinks([
						...navigationLinks,
						{
							name: `${role.name}s`,
							icon: UserIcon,
							href: `/users${qs.stringify(
								{ role: role.id },
								{ addQueryPrefix: true }
							)}`
						}
					]);
				}
			}
		});
		allNavigations.forEach((currentNav) => {
			const existHref = navigationLinks.find(
				(nav) => nav.href === currentNav.data.href
			);
			if (!existHref) {
				setNavigationLinks([...navigationLinks, currentNav.data]);
			}
		});
	}, [navigationLinks, roles, user]);
	return { navigationLinks, setNavigationLinks };
};
