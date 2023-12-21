import { User2Schema } from "@/models/cms/user-2";
import { createContext } from "react";

export type AuthContext = {
	status: "loading" | "authenticated" | "unauthenticated";
	user: User2Schema | null;
	reauth: () => Promise<void>;
	login: (args: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext>({
	status: "loading",
	user: null,
	reauth: async () => {},
	login: async () => {},
	logout: async () => {}
});
