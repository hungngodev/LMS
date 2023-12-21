import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { useRole } from "@/hooks/roles/use-role";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
	roleId: string;
	setRoleId: Dispatch<SetStateAction<string | null>>;
	variant: "card" | "table";
}

export const RoleDetail: FC<Props> = (props) => {
	const { role } = useRole(props.roleId);
	return (
		<Sheet open={!!props.roleId}>
			<SheetContent
				position="right"
				size="xl"
				onClickOutside={() => props.setRoleId(null)}
				onClickClose={() => props.setRoleId(null)}
			>
				<SheetHeader>
					{role ? (
						<SheetTitle>{role.name}</SheetTitle>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};
