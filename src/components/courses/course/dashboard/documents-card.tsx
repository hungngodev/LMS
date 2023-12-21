import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
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
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

interface Props {
	courseId: string;
}

export const DocumentsCard: FC<Props> = (props) => {
	const { user } = useAuth();
	const [showDocumentsCount, setShowDocumentsCount] =
		useState<boolean>(false);
	const [showDocumentsCreate, setShowDocumentsCreate] =
		useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowDocumentsCount(
			views.has(ViewEnum["courses:dashboard:documents:count"])
		);
		setShowDocumentsCreate(
			views.has(ViewEnum["courses:dashboard:documents:create"])
		);
	}, [user]);

	const DocumentsCount: FC = () => {
		const query: Where = { course: { equals: props.courseId } };
		const endpoint = `/api/courseMedia${qs.stringify(
			{ depth: 0, limit: 1000, where: query },
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
	const DocumentsView: FC = () => {
		return (
			<Link href={`/courses/${props.courseId}/documents`}>
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	const DocumentsCreate: FC = () => {
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
									<SheetTitle>Create Submissions</SheetTitle>
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
				<CardTitle className="text-md font-medium">Documents</CardTitle>
				<ClipboardListIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showDocumentsCount && <DocumentsCount />}
				{showDocumentsCount && <DocumentsView />}
				{showDocumentsCreate && <DocumentsCreate />}
			</CardContent>
		</Card>
	);
};
