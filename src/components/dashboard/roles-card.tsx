import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Form } from "@/components/form";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ActionEnum } from "@/payload/models/action-enum";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

export const RolesCard: FC = () => {
	const { user } = useAuth();

	const [showRolesCount, setShowRolesCount] = useState<boolean>(false);
	const [showRolesCreate, setShowRolesCreate] = useState<boolean>(false);
	const [showRolesView, setShowRolesView] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowRolesCount(views.has(ViewEnum["dashboard:roles:count"]));
		setShowRolesCreate(views.has(ViewEnum["dashboard:roles:create"]));
		setShowRolesView(views.has(ViewEnum["dashboard:roles:read"]))
	}, [user]);

	const RolesCount: FC = () => {
		const endpoint = `/api/roles${qs.stringify(
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

	const RolesView: FC = () => {
		return (
			<Link href="/roles">
				<Button className="w-full">View</Button>
			</Link>
		);
	};

	const RolesCreate: FC = () => {
		const FormSchema = z.object({});
		type FormSchema = z.infer<typeof FormSchema>;
		const { toast } = useToast();
		const form = useForm<FormSchema>({
			resolver: zodResolver(FormSchema)
		});
		const formRef = useRef<HTMLFormElement>(null);
		const [open, setOpen] = useState<boolean>(false);
		const onSubmit = async (values: FormSchema) => {};
		const CreateSheetForm: FC = () => {
			return (
				<Sheet open={open}>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								async (onValid) => await onSubmit(onValid)
							)}
							ref={formRef}
						>
							<SheetContent
								position="right"
								size="xl"
								onClickOutside={() => setOpen(false)}
								onClickClose={() => setOpen(false)}
							>
								<SheetHeader>
									<SheetTitle>Create Role</SheetTitle>
								</SheetHeader>
								<div className="space-y-8 max-w-xs">
									<div className="flex space-x-4">
										<Button
											variant={"outline"}
											onClick={() => setOpen(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={() =>
												formRef.current?.requestSubmit()
											}
										>
											Create
										</Button>
									</div>
								</div>
							</SheetContent>
						</form>
					</Form>
				</Sheet>
			);
		};
		return (
			<>
				<Button className="w-full" onClick={() => setOpen(true)}>
					Create
				</Button>
				{open && <CreateSheetForm />}
			</>
		);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">Role</CardTitle>
				<UserIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showRolesCount && <RolesCount />}
				{showRolesView && <RolesView />}
				{showRolesCreate && <RolesCreate />}
			</CardContent>
		</Card>
	);
};
