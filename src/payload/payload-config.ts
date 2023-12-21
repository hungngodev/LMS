import {
	actionConfig,
	assignmentConfig,
	assignmentsMediaConfig,
	coursesConfig,
	gradesConfig,
	gradesMediaConfig,
	locationsConfig,
	rolesConfig,
	sessionsConfig,
	sessionsRecurrenceConfig,
	subjectsConfig,
	submissionsConfig,
	submissionsMediaConfig,
	usersConfig,
	viewsConfig
} from "@/payload/collections";
import { env } from "@/payload/env";
import { transport } from "@/payload/services/mail";
import { storageAdapter } from "@/payload/services/storage";
import { seedActions } from "@/payload/utils/seed-actions";
import { seedAdmin } from "@/payload/utils/seed-admin";
import { seedAdminRole } from "@/payload/utils/seed-admin-role";
import { seedMockLocations } from "@/payload/utils/seed-locations";
import { seedMockSubjects } from "@/payload/utils/seed-subjects";
import { seedViews } from "@/payload/utils/seed-views";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import path from "path";
import { buildConfig } from "payload/config";

export default buildConfig({
	email: {
		transport,
		fromName: "Seamless LMS",
		fromAddress: "seamlesstech@email.wilsonle.me"
	},
	collections: [
		usersConfig,
		rolesConfig,
		actionConfig,
		viewsConfig,
		coursesConfig,
		assignmentConfig,
		assignmentsMediaConfig,
		submissionsConfig,
		submissionsMediaConfig,
		gradesConfig,
		gradesMediaConfig,
		locationsConfig,
		subjectsConfig,
		sessionsConfig,
		sessionsRecurrenceConfig
	],
	plugins: [
		cloudStorage({
			collections: {
				assignmentsMedia: {
					adapter: storageAdapter,
					prefix: "assignments-media"
				},
				submissionsMedia: {
					adapter: storageAdapter,
					prefix: "submissions-media"
				},
				gradesMedia: {
					adapter: storageAdapter,
					prefix: "grades-media"
				}
			}
		})
	],
	onInit: async (payload) => {
		try {
			payload.logger.info("Seeding...");
			await seedActions(payload);
			await seedViews(payload);
			await seedAdminRole(payload);
			await seedAdmin(payload);
			await seedMockLocations(payload);
			await seedMockSubjects(payload);
			payload.logger.info("Seed complete");
		} catch (error) {
			payload.logger.error(error);
		}
	},
	typescript: { outputFile: path.resolve(__dirname, "payload-types.ts") },
	csrf: [env.APP_URL, "https://lms.seamlesstech.io"],
	defaultDepth: 0,
	maxDepth: 2
});
