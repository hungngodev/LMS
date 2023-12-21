"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/alert-dialog";
import {
	CalendarEventPopoverProps,
	CalendarWithEvents
} from "@/components/calendar-with-event";
import { CreateSessionForm } from "@/components/courses/course/sessions/create-session-form";
import { EditSessionForm } from "@/components/courses/course/sessions/edit-session-form";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { RadioGroup, RadioGroupItem } from "@/components/radio-group";
import { Separator } from "@/components/separator";
import { Header2 } from "@/components/typography/h2";
import { Paragraph } from "@/components/typography/p";
import {
	DeleteSessionChoice,
	deleteSessionChoices
} from "@/constants/delete-session-choices";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Session0Schema } from "@/models/cms/session-0";
import { splitArray } from "@/payload/utils/split-array";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { jsDateToDayMonthDate } from "@/utils/js-date-to-day-month-date";
import { DotIcon, EditIcon, TrashIcon } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useSessions = (courseId: string) => {
	const sessionsQuery: Where = {
		course: { equals: courseId }
	};
	const endpoint = `/api/sessions${qs.stringify(
		{ where: sessionsQuery, depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const {
		data: sessions,
		refetch,
		isLoading
	} = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		const sessions = z.array(Session0Schema).optional().parse(body.docs);
		return sessions;
	});
	return { sessions: sessions ?? [], refetch, isLoading };
};

const fetchSession = async (sessionId: string): Promise<Session0Schema> => {
	const resp = await fetch(
		`/api/sessions/${sessionId}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`
	);
	return Session0Schema.parse(await resp.json());
};

const fetchSessionsOnwards = async (
	session: Session0Schema
): Promise<Session0Schema[]> => {
	const thisSessionOnwardsQuery: Where = {
		recurrenceId: { equals: session.recurrenceId },
		date: { greater_than_equal: session.date }
	};
	const resp = await fetch(
		`/api/sessions${qs.stringify(
			{
				where: thisSessionOnwardsQuery,
				limit: 1000,
				depth: 0
			},
			{ addQueryPrefix: true }
		)}`
	);
	const body = await resp.json();
	return z.array(Session0Schema).parse(body.docs);
};

const fetchAllSessions = async (
	session: Session0Schema
): Promise<Session0Schema[]> => {
	const allSessionsQuery: Where = {
		recurrenceId: { equals: session.recurrenceId }
	};
	const resp = await fetch(
		`/api/sessions${qs.stringify(
			{
				where: allSessionsQuery,
				limit: 1000,
				depth: 0
			},
			{ addQueryPrefix: true }
		)}`
	);
	const body = await resp.json();
	return z.array(Session0Schema).parse(body.docs);
};

const deleteSession = async (
	sessionId: string,
	deleteChoice: DeleteSessionChoice,
	refetchSessions: () => void | Promise<void>,
	toast: ToastInvoker
) => {
	try {
		toast({ title: `Deleting session...` });
		if (deleteChoice === "this-session-only") {
			await fetch(`/api/sessions/${sessionId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
		} else if (deleteChoice === "this-session-onwards") {
			const session = await fetchSession(sessionId);
			if (!session.recurrenceId) {
				toast({
					title: "This session is not a recurring session",
					variant: "destructive"
				});
				return;
			}
			const sessionsOnwards = await fetchSessionsOnwards(session);
			const sessionsOnwardsId = sessionsOnwards.map(
				(session) => session.id
			);
			const batches = splitArray<string>(sessionsOnwardsId, 20);
			for (let i = 0; i < batches.length; i++) {
				const sessionsOnwardsId = batches[i];
				const deleteSessionsQuery: Where = {
					id: { in: sessionsOnwardsId.join(",") }
				};
				await fetch(
					`/api/sessions${qs.stringify(
						{
							where: deleteSessionsQuery,
							limit: 1000
						},
						{ addQueryPrefix: true }
					)}`,
					{
						method: "DELETE",
						headers: { "Content-Type": "application/json" }
					}
				);
			}
		} else if (deleteChoice === "all-sessions") {
			const session = await fetchSession(sessionId);
			if (!session.recurrenceId) {
				toast({
					title: "This session is not a recurring session",
					variant: "destructive"
				});
				return;
			}
			const allSessions = await fetchAllSessions(session);
			const allSessionsId = allSessions.map((session) => session.id);
			const batches = splitArray<string>(allSessionsId, 20);
			for (let i = 0; i < batches.length; i++) {
				const allSessionsId = batches[i];
				const deleteSessionsQuery: Where = {
					id: { in: allSessionsId.join(",") }
				};
				await fetch(
					`/api/sessions${qs.stringify(
						{
							where: deleteSessionsQuery,
							limit: 1000
						},
						{ addQueryPrefix: true }
					)}`,
					{
						method: "DELETE",
						headers: { "Content-Type": "application/json" }
					}
				);
			}
			await fetch(`/api/sessionsRecurrence/${session.recurrenceId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
		} else {
			console.error(`Invalid delete choice: ${deleteChoice}`);
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again",
				variant: "destructive"
			});
		}
		await refetchSessions();
		toast({
			title: "Success",
			description: "Session Deleted"
		});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem with our system, please try again later",
			variant: "destructive"
		});
	}
};

const Sessions: FC<{ params: { courseId: string } }> = (props) => {
	const { toast } = useToast();
	const { sessions, refetch } = useSessions(props.params.courseId);
	const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
	const [editting, setEditting] = useState<string | null>(null);

	const EventPopover: FC<CalendarEventPopoverProps> = (popoverProps) => {
		const [deleteChoice, setDeleteChoice] =
			useState<DeleteSessionChoice>("this-session-only");
		return (
			<Popover>
				<PopoverTrigger asChild>
					<button
						className="w-full text-left bg-gray-200 rounded-md px-2 hover:bg-gray-400"
						key={popoverProps.event.id}
					>
						<Paragraph className="truncate ...">
							{popoverProps.event.name}
						</Paragraph>
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="flex justify-between items-center">
						{popoverProps.event.name}
						<div className="flex">
							<div>
								<AlertDialog>
									<AlertDialogTrigger>
										<TrashIcon className="w-5 h-5" />
									</AlertDialogTrigger>
									<AlertDialogContent>
										{!!popoverProps.event.recurrenceId && (
											<RadioGroup
												defaultValue={deleteChoice}
												onValueChange={(value) => {
													if (
														deleteSessionChoices.includes(
															value as any
														)
													)
														setDeleteChoice(
															value as DeleteSessionChoice
														);
												}}
											>
												{deleteSessionChoices.map(
													(choice) => (
														<div
															className="flex items-center space-x-2"
															key={choice}
														>
															<RadioGroupItem
																value={choice}
																id={choice}
															/>
															<Label
																htmlFor={choice}
																className="capitalize"
															>
																{choice.replace(
																	/\-/g,
																	" "
																)}
															</Label>
														</div>
													)
												)}
											</RadioGroup>
										)}
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												{deleteChoice ===
													"this-session-only" &&
													`This action cannot be undone. This will permanently delete the session.`}
												{deleteChoice ===
													"this-session-onwards" &&
													`This action cannot be undone. This will permanently delete this sessions and all sessions into the future.`}
												{deleteChoice ===
													"all-sessions" &&
													`This action cannot be undone. This will permanently delete this sessions, all sessions in the past and future.`}
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={async () =>
													await deleteSession(
														popoverProps.event.id,
														deleteChoice,
														async () => {
															await refetch();
														},
														toast
													)
												}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
							<EditIcon
								className="w-5 h-5 ml-4 hover:cursor-pointer"
								onClick={() =>
									setEditting(popoverProps.event.id)
								}
							/>
						</div>
					</div>
					<Separator />
					<div className="flex flex-col space-y-4 pt-4">
						<div className="flex flex-row">
							{jsDateToDayMonthDate(
								new Date(popoverProps.event.date)
							)}
							<DotIcon />
							{dateToHourColonMinute(
								new Date(popoverProps.event.startTime)
							)}
							{" - "}
							{dateToHourColonMinute(
								new Date(popoverProps.event.endTime)
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	};

	return (
		<div className="lg:flex lg:h-full lg:flex-col">
			<header className="px-6 py-4">
				<Header2>
					<div className="flex justify-between">
						Course Sessions
						<div>
							<CreateSessionForm
								courseId={props.params.courseId}
								refetch={async () => {
									await refetch();
								}}
								open={openCreateForm}
								setOpen={setOpenCreateForm}
							/>
						</div>
					</div>
				</Header2>
			</header>
			<div className="px-6">
				<CalendarWithEvents
					events={sessions.map((session) => ({
						id: session.id,
						name: session.title,
						startTime: session.startTime,
						endTime: session.endTime,
						date: session.date,
						href: "",
						recurrenceId: session.recurrenceId
					}))}
					EventPopover={EventPopover}
				/>
			</div>
			{editting && (
				<EditSessionForm
					courseId={props.params.courseId}
					refetch={async () => {
						await refetch();
					}}
					editting={editting}
					setEditting={setEditting}
				/>
			)}
		</div>
	);
};

export default Sessions;
