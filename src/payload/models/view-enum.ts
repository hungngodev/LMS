export enum ViewEnum {
	// nav views
	"nav:users" = "nav:users",
	"nav:roles" = "nav:roles",
	"nav:actions" = "nav:actions",
	"nav:courses" = "nav:courses",
	"nav:assignments" = "nav:assignments",
	"nav:submissions" = "nav:submissions",
	"nav:grades" = "nav:grades",
	"nav:locations" = "nav:locations",
	"nav:subjects" = "nav:subjects",
	"nav:sessions" = "nav:sessions",
	"nav:profile" = "nav:profile",

	// dashboard views
	"dashboard:imitate" = "dashboard:imitate",

	// dashboard views roles
	"dashboard:roles" = "dashboard:roles",
	"dashboard:roles:count" = "dashboard:roles:count",
	"dashboard:roles:read" = "dashboard:roles:read",
	"dashboard:roles:create" = "dashboard:roles:create",

	// dashboard views courses
	"dashboard:courses" = "dashboard:courses",
	"dashboard:courses:allCount" = "dashboard:courses:allCount",
	"dashboard:courses:currentCount" = "dashboard:courses:currentCount",
	"dashboard:courses:pastCount" = "dashboard:courses:pastCount",
	"dashboard:courses:read" = "dashboard:courses:read",
	"dashboard:courses:create" = "dashboard:courses:create",

	// dashboard views assignments
	"dashboard:assignments" = "dashboard:assignments",
	"dashboard:assignments:allCount" = "dashboard:assignments:allCount",
	"dashboard:assignments:upcomingCount" = "dashboard:assignments:upcomingCount",
	"dashboard:assignments:pastCount" = "dashboard:assignments:pastCount",
	"dashboard:assignments:onTimeCount" = "dashboard:assignments:onTimeCount",
	"dashboard:assignments:lateCount" = "dashboard:assignments:lateCount",
	"dashboard:assignments:submittedCount" = "dashboard:assignments:submittedCount",
	"dashboard:assignments:notSubmittedCount" = "dashboard:assignments:notSubmittedCount",
	"dashboard:assignments:gradedCount" = "dashboard:assignments:gradedCount",
	"dashboard:assignments:notGradedCount" = "dashboard:assignments:notGradedCount",
	"dashboard:assignments:read" = "dashboard:assignments:read",
	"dashboard:assignments:create" = "dashboard:assignments:create",

	// dashboard views submissions
	"dashboard:submissions" = "dashboard:submissions",
	"dashboard:submissions:allCount" = "dashboard:submissions:allCount",
	"dashboard:submissions:onTimeAllCoursesCount" = "dashboard:submissions:onTimeAllCoursesCount",
	"dashboard:submissions:onTimeCurrentCoursesCount" = "dashboard:submissions:onTimeCurrentCoursesCount",
	"dashboard:submissions:onTimePastCoursesCount" = "dashboard:submissions:onTimePastCoursesCount",
	"dashboard:submissions:lateAllCoursesCount" = "dashboard:submissions:lateAllCoursesCount",
	"dashboard:submissions:lateCurrentCoursesCount" = "dashboard:submissions:lateCurrentCoursesCount",
	"dashboard:submissions:latePastCoursesCount" = "dashboard:submissions:latePastCoursesCount",
	"dashboard:submissions:read" = "dashboard:submissions:read",
	"dashboard:submissions:create" = "dashboard:submissions:create",

	// dashboard views grades
	"dashboard:grades" = "dashboard:grades",
	"dashboard:grades:count" = "dashboard:grades:count",
	"dashboard:grades:read" = "dashboard:grades:read",
	"dashboard:grades:create" = "dashboard:grades:create",

	// users
	"users:table" = "users:table",
	"users:card" = "users:card",

	// users:table
	"users:table:create" = "users:table:create",
	"users:table:read" = "users:table:read",
	"users:table:update" = "users:table:update",
	"users:table:delete" = "users:table:delete",

	// courses
	"courses:table" = "courses:table",
	"courses:card" = "courses:card",
	"courses:course:assignments:card:detail:title" = "courses:course:assignments:card:detail:title",
	"courses:course:assignments:card:detail:dueAt" = "courses:course:assignments:card:detail:dueAt",
	"courses:course:assignments:card:detail:content" = "courses:course:assignments:card:detail:content",
	"courses:course:assignments:card:detail:documents" = "courses:course:assignments:card:detail:documents",
	"courses:course:assignments:card:detail:submissionsStatus" = "courses:course:assignments:card:detail:submissionsStatus",
	"courses:course:assignments:card:detail:assignmentGradesStatus" = "courses:course:assignments:card:detail:assignmentGradesStatus",
	"courses:course:assignments:card:detail:submissionsGradeStatus" = "courses:course:assignments:card:detail:submissionsGradeStatus",
	"courses:course:assignments:card:detail:submissions" = "courses:course:assignments:card:detail:submissions",
	"courses:course:assignments:card:detail:submissions:create" = "courses:course:assignments:card:detail:submissions:create",
	"courses:course:assignments:table" = "courses:course:assignments:table",
	"courses:course:assignments:card" = "courses:course:assignments:card",
	"courses:course:assignments:card:title" = "courses:course:assignments:card:title",
	"courses:course:assignments:card:dueAt" = "courses:course:assignments:card:dueAt",
	"courses:course:assignments:card:submissionsStatus" = "courses:course:assignments:card:submissionsStatus",
	"courses:course:assignments:card:assignmentGradesStatus" = "courses:course:assignments:card:assignmentGradesStatus",
	"courses:course:assignments:card:submissionsGradeStatus" = "courses:course:assignments:card:submissionsGradeStatus",
	"courses:course:assignments:card:detail" = "courses:course:assignments:card:detail",
	"courses:course:submissions:table" = "courses:course:submissions:table",
	"courses:course:submissions:card" = "courses:course:submissions:card",
	"courses:course:submissions:table:create" = "courses:course:submissions:table:create",

	// courses:table
	"courses:table:read" = "courses:table:read",
	"courses:table:create" = "courses:table:create",
	"courses:table:update" = "courses:table:update",
	"courses:table:delete" = "courses:table:delete",

	// courses:nav
	"courses:nav:calendar" = "courses:nav:calendar",
	"courses:nav:assignments" = "courses:nav:assignments",
	"courses:nav:submissions" = "courses:nav:submissions",
	"courses:nav:grades" = "courses:nav:grades",
	"courses:nav:members" = "courses:nav:members",
	"courses:nav:sessions" = "courses:nav:sessions",
	"courses:nav:documents" = "courses:nav:documents",

	// courses:dashboard
	"courses:course:dashboard:assignments" = "courses:course:dashboard:assignments",
	"courses:course:dashboard:assignments:allCount" = "courses:course:dashboard:assignments:allCount",
	"courses:course:dashboard:assignments:upcomingCount" = "courses:course:dashboard:assignments:upcomingCount",
	"courses:course:dashboard:assignments:pastCount" = "courses:course:dashboard:assignments:pastCount",
	"courses:course:dashboard:assignments:onTimeCount" = "courses:course:dashboard:assignments:onTimeCount",
	"courses:course:dashboard:assignments:lateCount" = "courses:course:dashboard:assignments:lateCount",
	"courses:course:dashboard:assignments:submittedCount" = "courses:course:dashboard:assignments:submittedCount",
	"courses:course:dashboard:assignments:notSubmittedCount" = "courses:course:dashboard:assignments:notSubmittedCount",
	"courses:course:dashboard:assignments:gradedCount" = "courses:course:dashboard:assignments:gradedCount",
	"courses:course:dashboard:assignments:notGradedCount" = "courses:course:dashboard:assignments:notGradedCount",
	"courses:course:dashboard:assignments:read" = "courses:course:dashboard:assignments:read",
	"courses:course:dashboard:assignments:create" = "courses:course:dashboard:assignments:create",

	"courses:dashboard:submissions" = "courses:dashboard:submissions",
	"courses:dashboard:submissions:count" = "courses:dashboard:submissions:count",
	"courses:dashboard:submissions:create" = "courses:dashboard:submissions:create",

	"courses:dashboard:grades" = "courses:dashboard:grades",
	"courses:dashboard:grades:count" = "courses:dashboard:grades:count",
	"courses:dashboard:grades:create" = "courses:dashboard:grades:create",

	"courses:dashboard:members" = "courses:dashboard:members",
	"courses:dashboard:members:count" = "courses:dashboard:members:count",
	"courses:dashboard:members:add" = "courses:dashboard:members:add",

	"courses:dashboard:sessions" = "courses:dashboard:sessions",
	"courses:dashboard:sessions:count" = "courses:dashboard:sessions:count",
	"courses:dashboard:sessions:create" = "courses:dashboard:sessions:create",

	"courses:dashboard:documents" = "courses:dashboard:documents",
	"courses:dashboard:documents:count" = "courses:dashboard:documents:count",
	"courses:dashboard:documents:create" = "courses:dashboard:documents:create",

	// assignments
	"assignments:table" = "assignments:table",
	"assignments:card" = "assignments:card",

	// assignments:table
	"assignments:table:update" = "assignments:table:update",
	"assignments:table:delete" = "assignments:table:delete",
	"assignments:table:grade" = "assignments:table:grade",

	// locations
	"locations:table" = "locations:table",
	"locations:card" = "locations:card",

	// locations:table
	"locations:table:create" = "locations:table:create",
	"locations:table:read" = "locations:table:read",
	"locations:table:update" = "locations:table:update",
	"locations:table:delete" = "locations:table:delete",

	// subjects
	"subjects:table" = "subjects:table",
	"subjects:card" = "subjects:card",

	// subjects:table
	"subjects:table:create" = "subjects:table:create",
	"subjects:table:read" = "subjects:table:read",
	"subjects:table:update" = "subjects:table:update",
	"subjects:table:delete" = "subjects:table:delete",

	// roles
	"roles:table" = "roles:table",
	"roles:card" = "roles:card",

	// roles:table
	"roles:table:create" = "roles:table:create",
	"roles:table:read" = "roles:table:read",
	"roles:table:update" = "roles:table:update",
	"roles:table:delete" = "roles:table:delete"
}
