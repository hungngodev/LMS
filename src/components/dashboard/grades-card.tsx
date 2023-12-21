import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { FileDigitIcon } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export const GradesCard: FC = () => {
	const { user } = useAuth();
	const [showGradesCount, setShowGradesCount] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const actions = getUserAllowedActions(user);
		setShowGradesCount(
			actions.has(ActionEnum["grades:read"]) ||
				actions.has(ActionEnum["grades:read:grader_only"]) ||
				actions.has(ActionEnum["grades:read:member_only"]) ||
				actions.has(ActionEnum["grades:read:submission_author_only"])
		);
	}, [user]);

	const GradesCount: FC = () => {
		const endpoint = `/api/grades${qs.stringify(
			{ depth: 0, limit: 1000 },
			{ addQueryPrefix: true }
		)}`;
		const { data: count } = useQuery("count" + endpoint, async () => {
			const resp = await fetch(endpoint);
			const body = await resp.json();
			return z.number().parse(body.totalDocs);
		});
		if (count !== undefined) return <Header4>{count}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const GradesView: FC = () => {
		return (
			<Link href="/grades">
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">Grades</CardTitle>
				<FileDigitIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showGradesCount && <GradesCount />}
				{showGradesCount && <GradesView />}
			</CardContent>
		</Card>
	);
};
