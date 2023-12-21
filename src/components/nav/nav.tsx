"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { Logo } from "@/components/logo";
import { BottomNavLinks } from "@/components/nav/bottom-nav-links";
import { MobileBottomNavLinks } from "@/components/nav/mobile-bottom-nav-links";
import { MobileNavLinks } from "@/components/nav/mobile-nav-links";
import { NavLinks } from "@/components/nav/nav-links";
import { Header4 } from "@/components/typography/h4";
import { MenuIcon } from "lucide-react";
import { FC, useState } from "react";
import { ImitateBorder } from "./imitate-border";

interface Props {}

export const NewNav: FC<Props> = () => {
	const [open, setOpen] = useState(false); //open state for dropdown menu
	const toggleOpen = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	return (
		<>
			<div className="hidden lg:block fixed lg:w-60 h-full border-r top-0 bg-white">
				<div className="py-4 px-6 border-b">
					<Logo />
				</div>
				<div className="flex flex-col px-6 pt-4 absolute bottom-[80px] top-[84px] overflow-y-auto">
					<NavLinks />
				</div>
				<div className="absolute bottom-0 py-4 px-6 w-full flex flex-col border-t bg-primary-foreground">
					<BottomNavLinks />
				</div>
			</div>
			<div className="lg:hidden block fixed top-0 w-screen h-12 border-b bg-white">
				<div className="flex flex-row h-full w-36 items-center">
					<DropdownMenu
						onOpenChange={(isOpen) => setOpen(isOpen)}
						open={open}
					>
						<DropdownMenuTrigger>
							<div
								className="flex flex-row items-center"
								onClick={toggleOpen}
							>
								<MenuIcon className="w-8 h-8 mr-1" />
								<Header4>Main Menu</Header4>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<MobileNavLinks toggleDropdownMenu={toggleOpen} />
							<MobileBottomNavLinks
								toggleDropdownMenu={toggleOpen}
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<ImitateBorder />
		</>
	);
};
