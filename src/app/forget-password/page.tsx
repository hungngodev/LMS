"use client";
import { Button } from "@/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/form";
import { Input } from "@/components/input";
import { Logo } from "@/components/logo";
import { useCountdown } from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
	email: z.string().trim().email()
});

const staticProps = {
	logo: Logo,
	header: "Recover Password To Seamless LMS",
	formFields: {
		email: {
			label: "Email",
			placeholder: "example@email.com"
		}
	},
	recoverTitle: "Send Recovery Email",
	retryMessage: "Retry in [countdown] seconds",
	banner: {
		url: "https://cdn.leonardo.ai/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b/variations/Default_illustration_of_a_learning_management_system_0_f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b_1.jpg",
		alt: "Forget password banner"
	},
	backToLogin: "Back to login"
};

const ForgetPassword: FC = () => {
	const { startCountdown, remainMillies } = useCountdown(
		() => setDisableReset(false),
		30000
	);
	const [disableReset, setDisableReset] = useState<boolean>(true);
	useEffect(() => {
		setDisableReset(remainMillies !== null && remainMillies >= 0);
	}, [remainMillies]);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: ""
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setDisableReset(true);
		startCountdown();
		const resp = await fetch(`/api/users/forgot-password`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values)
		});
		if (resp.status === 200) {
			toast({
				title: "Recovery Email Sent",
				description:
					"Check your inbox, it should arrive within the next 30 seconds. If it does not, please try again in 30 seconds."
			});
			return;
		}
		if (resp.status >= 500) {
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem with our system, please try again later",
				variant: "destructive"
			});
			return;
		}
	}

	return (
		<div className="w-screen h-screen flex absolute z-50 top-0 left-0 bg-primary-foreground">
			<div className="hidden lg:block w-1/2 relative">
				<Image
					src={staticProps.banner.url}
					alt={staticProps.banner.alt}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex justify-center items-center">
						<staticProps.logo />
					</div>
					<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						{staticProps.header}
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{staticProps.formFields.email.label}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields.email
														.placeholder
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-center items-center">
								<Button
									type="submit"
									className="w-full"
									disabled={disableReset}
								>
									{remainMillies === null
										? staticProps.recoverTitle
										: staticProps.retryMessage.replace(
												"[countdown]",
												Math.ceil(
													remainMillies / 1000
												).toString()
										  )}
								</Button>
							</div>
							<div className="flex justify-start items-center hover:underline">
								<Link href="/login">
									{staticProps.backToLogin}
								</Link>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ForgetPassword;
