"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User2Schema } from "@/models/cms/user-2";
import { FC, ReactNode, useEffect, useState } from "react";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [auth, setAuth] = useState<{
		status: AuthContext["status"];
		user: AuthContext["user"];
	}>({ status: "loading", user: null });

	const { toast } = useToast();

	const checkAuthenticated = async () => {
		const resp = await fetch("/api/users/me");

		if (!resp.ok) {
			setAuth({ status: "unauthenticated", user: null });
		}

		const session = await resp.json();

		if (session.user === null)
			setAuth({ status: "unauthenticated", user: null });
		else
			setAuth({
				status: "authenticated",
				user: User2Schema.parse(session.user)
			});
	};

	useEffect(() => {
		(async () => await checkAuthenticated())();
		const interval = setInterval(checkAuthenticated, 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const login = async ({
		email,
		password
	}: {
		email: string;
		password: string;
	}) => {
		setAuth({ status: "loading", user: null });
		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				if (response.status === 401) {
					toast({
						title: "Incorrect email or password",
						description: "Please try again"
					});
				}
				if (response.status >= 500) {
					toast({
						title: "Uh oh, something went wrong on our end",
						description:
							"There was a problem with our system, please try again later"
					});
				}
				if (response.status == 429) {
					toast({
						title: "Too many failed login attempts!!!",
						description:
							"This account is temporarily locked, please try again later",
						variant: "destructive"
					});
					return;
				}
			}
			await checkAuthenticated();
		} catch (error) {
			console.error(error);
			toast({
				title: "Uh oh, something went wrong",
				description: "There was a problem with your request."
			});
		}
	};

	const logout = async () => {
		await fetch("/api/users/logout", {
			method: "POST",
			headers: { "Content-Type": "application/json" }
		});
		await checkAuthenticated();
	};

	return (
		<AuthContext.Provider
			value={{
				status: auth.status,
				user: auth.user,
				login,
				logout,
				reauth: checkAuthenticated
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
