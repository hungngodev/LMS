import { Badge } from "@/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { UserCardDetail } from "@/components/users/user-card-detail";
import { useAllUsers } from "@/hooks/users/use-all-users";
import { User2Schema } from "@/models/cms/user-2";
import { ArrowRightToLine } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface UserCardProps {
	user: User2Schema;
	setViewing: Dispatch<SetStateAction<string | null>>;
}

const UserCard: FC<UserCardProps> = (props) => {
	return (
		<Card
			className="rounded-lg flex max-h-80 w-full hover:bg-muted"
			onClick={() => props.setViewing(props.user.id)}
		>
			<CardHeader className="flex flex-col w-full">
				<div className="flex w-full justify-between items-center">
					<CardTitle>
						<Header3>{props.user.fullName}</Header3>
					</CardTitle>
					<ArrowRightToLine className="w-7 h-7" />
				</div>
				<CardContent className="flex flex-col justify-between h-full">
					<div className="flex flex-wrap">
						<div className="pr-2">
							<Badge variant="default">
								{props.user.roles[0].name}
							</Badge>
						</div>
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	);
};

interface Props {
	role?: string;
}

export const UsersCard: FC<Props> = (props) => {
	const { users } = useAllUsers({ roles: { contains: props.role } });
	const [showingDetailId, setShowingDetailId] = useState<string | null>(null);
	return (
		<>
			<div className="grid gap-4 pt-8">
				{users ? (
					users.length > 0 ? (
						users.map((user) => (
							<UserCard
								key={user.id}
								user={user}
								setViewing={setShowingDetailId}
							/>
						))
					) : (
						<div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
							No users
						</div>
					)
				) : (
					<Skeleton className="w-full h-80" />
				)}
			</div>
			{showingDetailId && (
				<UserCardDetail
					userId={showingDetailId}
					setUserId={setShowingDetailId}
				/>
			)}
		</>
	);
};
