import { Card, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAllRoles } from "@/hooks/roles/use-all-roles";
import { Role0Schema } from "@/models/cms/role-0";
import { ArrowRightToLine } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { RoleDetail } from "./role-detail";

const RoleCard: FC<{
	role: Role0Schema;
	setShowingRoleId: Dispatch<SetStateAction<string | null>>;
}> = ({ role, setShowingRoleId: setRoleId }) => {
	return (
		<button onClick={() => setRoleId(role.id)}>
			<Card className="rounded-lg flex w-full hover:bg-muted">
				<CardHeader className="flex flex-col w-full">
					<div className="flex w-full justify-between items-center">
						<CardTitle>
							<Header4>{role.name}</Header4>
						</CardTitle>
						<ArrowRightToLine className="w-7 h-7" />
					</div>
				</CardHeader>
			</Card>
		</button>
	);
};

export const RolesCard: FC = () => {
	const { roles } = useAllRoles();
	const [showingRoleId, setShowingRoleId] = useState<string | null>(null);
	return (
		<div className="grid gap-4 pt-8">
			{roles ? (
				roles.length > 0 ? (
					roles.map((role) => (
						<RoleCard
							key={role.id}
							role={role}
							setShowingRoleId={setShowingRoleId}
						/>
					))
				) : (
					<div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
						No roles
					</div>
				)
			) : (
				<Skeleton className="w-full h-80" />
			)}
			{showingRoleId && (
				<RoleDetail
					roleId={showingRoleId}
					setRoleId={setShowingRoleId}
					variant="card"
				/>
			)}
		</div>
	);
};
