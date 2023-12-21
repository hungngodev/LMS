import { env } from "@/payload/env";
import { CollectionConfig } from "payload/types";

export const auth: CollectionConfig["auth"] = {
	depth: 2,
	forgotPassword: {
		generateEmailHTML: ({ req, token, user }: any) => {
			const resetPasswordURL = `${env.APP_URL}/reset-password?token=${token}`;

			return `
			<!doctype html>
			<html>
			  <body>
				<p>Hello!</p>
				<p>Click below to reset your password.</p>
				<p>
				  <a href="${resetPasswordURL}">${resetPasswordURL}</a>
				</p>
			  </body>
			</html>
		  `;
		},
		generateEmailSubject: () => {
			return `Reset Your Password To Seamless LMS`;
		}
	}
};
