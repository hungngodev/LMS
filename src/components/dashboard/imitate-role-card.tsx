import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/select";
import { Skeleton } from "@/components/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Role0Schema } from "@/models/cms/role-0";
import { User2Schema } from "@/models/cms/user-2";
import { UserIcon } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
const useCanImitateRoles = (user: User2Schema | null) => {
	const [canImitateRoles, setCanImitateRoles] = useState<string[] | null>(
		null
	);
	useEffect(() => {
		if (!user) return;
		// TODO: implement this
		setCanImitateRoles(null);
	}, [user]);

	const [canImitateRoleObjects, setCanImitateRoleObjects] = useState<
		{ role: string; id: string }[]
	>([]);
	useEffect(() => {
		if (canImitateRoles === null) return;
		const query: Where = {
			name: { in: canImitateRoles.join(",") }
		};
		const endpoint = `/api/roles${qs.stringify(
			{ where: query, depth: 0 },
			{ addQueryPrefix: true }
		)}`;
		let subbed = true;
		(async () => {
			const resp = await fetch(endpoint);
			const body = await resp.json();
			const roles = z.array(Role0Schema).parse(body.docs);
			subbed &&
				setCanImitateRoleObjects(
					roles.map((role) => ({ id: role.id, role: role.name }))
				);
		})();
		return () => {
			subbed = false;
		};
	}, [canImitateRoles]);
	return { canImitateRoles: canImitateRoleObjects };
};

export const ImitateRoleCard: FC = () => {
	const { user, reauth } = useAuth();
	const { toast } = useToast();
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

	const { canImitateRoles } = useCanImitateRoles(user);
	const [selectedRoleObj, setSelectedRoleObj] = useState<{
		role: string;
		id: string;
	} | null>(null);
	useEffect(() => {
		setSelectedRoleObj(
			canImitateRoles.find((role) => role.id === selectedRoleId) ?? null
		);
	}, [canImitateRoles, selectedRoleId]);
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
	const imitateRole = async () => {
		if (selectedRoleId === null || user === null) return;
		if (user.roles.length !== 1) {
			toast({
				title: `Already imitating as ${user.roles[0].name}`,
				variant: "destructive",
				action: (
					<Button onClick={async () => await unimitate()}>
						Remove imitation
					</Button>
				)
			});
			return;
		}
		try {
			const resp = await fetch(`/api/users/${user.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roles: [
						selectedRoleId,
						...user.roles.map((role) => role.id)
					]
				})
			});
			if (resp.ok) {
				await reauth();
				toast({
					title: "Sucess",
					description: `Imitated as ${selectedRoleObj?.role}`
				});
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
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">
					Imitate Role
				</CardTitle>
				<UserIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4">
				<Select
					value={selectedRoleId ?? undefined}
					onValueChange={(val) => setSelectedRoleId(val)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						{canImitateRoles ? (
							canImitateRoles.map((canImitateRole, i) => (
								<SelectItem value={canImitateRole.id} key={i}>
									{canImitateRole.role}
								</SelectItem>
							))
						) : (
							<Skeleton className="w-full h-10 rounded-lg" />
						)}
					</SelectContent>
				</Select>
				<Button onClick={async () => await imitateRole()}>
					Imitate
				</Button>
			</CardContent>
		</Card>
	);
};
