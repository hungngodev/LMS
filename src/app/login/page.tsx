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
import { Spinner } from "@/components/spinner";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
	email: z.string().trim().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Must be at least 8 characters long" })
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	logo: Logo,
	header: "Login To Seamless LMS",
	formFields: {
		email: {
			label: "Email",
			placeholder: "example@email.com"
		},
		password: {
			label: "Password",
			placeholder: "🤫🤫🤫🤫"
		}
	},
	forgotTitle: "Forgot Your Password?",
	loginTitle: "Log In",
	banner: {
		url: "https://cdn.leonardo.ai/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b/variations/Default_illustration_of_a_learning_management_system_0_f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b_1.jpg",
		alt: "Login banner"
	}
};

const Login: FC = () => {
	const { status, login } = useAuth();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	async function onSubmit(values: FormSchema) {
		await login(values);
	}

	if (status === "authenticated") redirect("/");

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
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 px-8 lg:w-1/2 w-full text-primary">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex justify-center items-center">
						<staticProps.logo />
					</div>
					<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
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
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields.password
													.label
											}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields
														.password.placeholder
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
								{status === "loading" ? (
									<Spinner />
								) : (
									<Button type="submit" className="w-full">
										{staticProps.loginTitle}
									</Button>
								)}
							</div>
							<div className="flex justify-start items-center hover:underline">
								<Link href="/forget-password">
									{staticProps.forgotTitle}
								</Link>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
