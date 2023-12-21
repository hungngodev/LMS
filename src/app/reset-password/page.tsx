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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
	.object({
		newPassword: z.string().min(8),
		confirmNewPassword: z.string().min(8)
	})
	.refine((obj) => obj.newPassword === obj.confirmNewPassword);

const staticProps = {
	logo: Logo,
	header: "Reset Password To Seamless LMS",
	formFields: {
		newPassword: {
			label: "New Password",
			placeholder: "🤫🤫🤫🤫"
		},
		confirmNewPassword: {
			label: "Confirm new Password",
			placeholder: "🤫🤫🤫🤫"
		}
	},
	resetTitle: "Reset Password",
	banner: {
		url: "https://cdn.leonardo.ai/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b/variations/Default_illustration_of_a_learning_management_system_0_f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b_1.jpg",
		alt: "Reset password banner"
	},
	backToLogin: "Back to login"
};

const ResetPassword: FC = () => {
	const params = useSearchParams();

	const router = useRouter();

	const token = params?.get("token");

	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmNewPassword: ""
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (!token) {
				toast({
					title: "Uh oh, the link you clicked is no longer valid"
				});
				return;
			}
			const resp = await fetch("/api/users/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					token: token,
					password: values.confirmNewPassword
				})
			});
			if (resp.status === 200) {
				toast({ title: "New Password Set" });
				return;
			}
			if (resp.status >= 500) {
				toast({
					title: "Uh oh, something bad happened",
					description:
						"There was a problem in our system, please try again later"
				});
				return;
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Uh oh, something went wrong",
				description: "An error occured, please try again later"
			});
		} finally {
			router.push("/login");
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
						Recover Password To Seamless LMS
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
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields
													.newPassword.label
											}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields
														.newPassword.placeholder
												}
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmNewPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields
													.confirmNewPassword.label
											}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields
														.confirmNewPassword
														.placeholder
												}
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-center items-center">
								<Button type="submit" className="w-full">
									Reset Password
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

export default ResetPassword;
