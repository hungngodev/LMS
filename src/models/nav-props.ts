import {
	CalendarIcon,
	Cog6ToothIcon,
	HomeIcon
} from "@heroicons/react/20/solid";
import { LucideIcon } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface NavProps {
	navigation: {
		name: string;
		icon:
			| ForwardRefExoticComponent<
					Omit<SVGProps<SVGSVGElement>, "ref"> & {
						title?: string | undefined;
						titleId?: string | undefined;
					} & RefAttributes<SVGSVGElement>
			  >
			| LucideIcon;
		current?: boolean;
		children?: { name: string; href: string; current: boolean }[];
		href: string;
	}[];
	bottomNavigation: {
		name: string;
		icon: ForwardRefExoticComponent<
			Omit<SVGProps<SVGSVGElement>, "ref"> & {
				title?: string | undefined;
				titleId?: string | undefined;
			} & RefAttributes<SVGSVGElement>
		>;
		href: string;
	}[];
	userNavigation: {
		name: string;
		href: string;
	}[];
}

export const defaultNavProps: NavProps = {
	navigation: [
		{ name: "Courses", icon: HomeIcon, current: true, href: "/courses" },
		{
			name: "Users",
			icon: CalendarIcon,
			current: false,
			href: "/users"
		},
		{
			name: "Subjects",
			icon: CalendarIcon,
			current: false,
			href: "/subjects"
		},
		{
			name: "Locations",
			icon: CalendarIcon,
			current: false,
			href: "/locations"
		}
		// {
		// 	name: "Teams",
		// 	icon: UsersIcon,
		// 	current: false,
		// 	children: [
		// 		{ name: "Engineering", href: "#", current: false },
		// 		{ name: "Human Resources", href: "#", current: false },
		// 		{ name: "Customer Success", href: "#", current: false }
		// 	]
		// },
	],
	bottomNavigation: [{ name: "Settings", icon: Cog6ToothIcon, href: "#" }],
	userNavigation: [{ name: "Your profile", href: "#" }]
};
