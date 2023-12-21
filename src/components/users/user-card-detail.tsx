import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Paragraph } from "@/components/typography/p";
import { useUser } from "@/hooks/users/use-user";
import { Dispatch, FC, SetStateAction } from "react";

export interface UserDetailProps {
	userId: string;
	setUserId: Dispatch<SetStateAction<string | null>>;
}

export const UserCardDetail: FC<UserDetailProps> = (props) => {
	const { user } = useUser(props.userId);

	return (
		<Sheet open={!!props.userId}>
			<SheetContent
				onClickOutside={() => props.setUserId(null)}
				onClickClose={() => props.setUserId(null)}
				position="right"
				size="xl"
			>
				<SheetHeader className="max-w-xs">
					{user?.fullName ? (
						<SheetTitle>{user.fullName}</SheetTitle>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</SheetHeader>
				<div className="flex flex-col space-y-8 max-w-xs mt-4">
					{user?.email ? (
						<Paragraph>{user.email}</Paragraph>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
