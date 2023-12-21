"use client";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";
import { FC } from "react";
import { Header4 } from "../typography/h4";

export const ImitateBorder: FC = () => {
	const { toast } = useToast();
	const { user, reauth } = useAuth();
	const unimitate = async () => {
		if (!user) return;
		try {
			const resp = await fetch(`/api/users/${user.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roles: [user.roles[user.roles.length - 1].id]
				})
			});
			if (resp.ok) {
				await reauth();
				toast({ title: "Imitation Stopped" });
			} else
				toast({
					title: "Uh oh, something went wrong",
					description:
						"There was a problem in our system, please try again",
					variant: "destructive"
				});
		} catch (error) {
			console.error(error);
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again",
				variant: "destructive"
			});
		}
	};
	return (
		<>
			{user && user.roles.length > 1 && (
				<div className="inset-0 fixed border-8 border-secondary-foreground z-50 pointer-events-none">
					<div className="bottom-1 right-1 absolute bg-primary text-primary-foreground px-4 py-2 flex flex-row items-center rounded-lg">
						<Header4>{user.roles[0].name} View</Header4>
						<button
							onClick={async () => await unimitate()}
							className="pointer-events-auto"
						>
							<XIcon className="w-8 h-8 ml-2" />
						</button>
					</div>
				</div>
			)}
		</>
	);
};
