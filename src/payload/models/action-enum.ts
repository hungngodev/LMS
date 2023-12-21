/**
 * iam roles are defined as followed:
 *
 * [collection]:[crud] allows user to crud on the entire collection
 *
 * [collection]:[crud]:[custom constrain] allows user to crud on a custom
 * constraint subset of a collection
 *
 * [collection]-[field]:[crud] allows users to crud on the specific field of
 * the collection
 *
 * [collection]-[field]:[crud]:[custom constrain] allows user to crud on the
 * specific field of of a constraint subset of a collection
 */
export enum ActionEnum {
	// can crud any views
	"views:create" = "views:create",
	"views:read" = "views:read",
	"views:update" = "views:update",
	"views:delete" = "views:delete",

	// can crud any actions
	"actions:create" = "actions:create",
	"actions:read" = "actions:read",
	"actions:update" = "actions:update",
	"actions:delete" = "actions:delete",

	// can crud any role
	"roles:create" = "roles:create",
	"roles:read" = "roles:read",
	"roles:update" = "roles:update",
	"roles:delete" = "roles:delete",

	// can crud any user
	"users:create" = "users:create",
	"users:read" = "users:read",
	"users:update" = "users:update",
	"users:delete" = "users:delete",

	// can imitate mod, course mod, customer mod, teacher, etc.
	"users:imitate:admin" = "users:imitate:admin",
	"users:imitate:mod" = "users:imitate:mod",
	"users:imitate:course_mod" = "users:imitate:course_mod",
	"users:imitate:customer_mod" = "users:imitate:customer_mod",
	"users:imitate:teacher" = "users:imitate:teacher",
	"users:imitate:teaching_assistant" = "users:imitate:teaching_assistant",
	"users:imitate:student" = "users:imitate:student",
	"users:imitate:parent" = "users:imitate:parent",

	// can only rud self
	"users:read:self" = "users:read:self",
	"users:update:self" = "users:update:self",
	"users:delete:self" = "users:delete:self",

	// can crud locations
	"locations:create" = "locations:create",
	"locations:read" = "locations:read",
	"locations:update" = "locations:update",
	"locations:delete" = "locations:delete",

	// can crud subjects
	"subjects:create" = "subjects:create",
	"subjects:read" = "subjects:read",
	"subjects:update" = "subjects:update",
	"subjects:delete" = "subjects:delete",

	// can crud sessions
	"sessions:create" = "sessions:create",
	"sessions:read" = "sessions:read",
	"sessions:update" = "sessions:update",
	"sessions:delete" = "sessions:delete",

	// can read sessions if is a course member
	"sessions:read:member_only" = "sessions:read:member_only",
	"sessions:update:member_only" = "sessions:update:member_only",
	"sessions:delete:member_only" = "sessions:delete:member_only",

	// can crud courses
	"courses:create" = "courses:create",
	"courses:read" = "courses:read",
	"courses:update" = "courses:update",
	"courses:delete" = "courses:delete",

	// can rud courses where user is member
	"courses:read:member_only" = "courses:read:member_only",
	"courses:update:member_only" = "courses:update:member_only",
	"courses:delete:member_only" = "courses:delete:member_only",

	// can rud courses where user is creator
	"courses:read:creator_only" = "courses:read:creator_only",
	"courses:update:creator_only" = "courses:update:creator_only",
	"courses:delete:creator_only" = "courses:delete:creator_only",

	// can crud assignments of all courses
	"assignments:create" = "assignments:create",
	"assignments:read" = "assignments:read",
	"assignments:update" = "assignments:update",
	"assignments:delete" = "assignments:delete",

	// can crud assignments of courses where user is member
	"assignments:create:member_only" = "assignments:create:member_only",
	"assignments:read:member_only" = "assignments:read:member_only",
	"assignments:update:member_only" = "assignments:update:member_only",
	"assignments:delete:member_only" = "assignments:delete:member_only",

	// can rud assignments where user is creator
	"assignments:read:creator_only" = "assignments:read:creator_only",
	"assignments:update:creator_only" = "assignments:update:creator_only",
	"assignments:delete:creator_only" = "assignments:delete:creator_only",

	// can only cru submissions of all assignments
	"assignments-submissions:create" = "assignments-submissions:create",
	"assignments-submissions:read" = "assignments-submissions:read",
	"assignments-submissions:update" = "assignments-submissions:update",

	// can only cru submissions of assignments where user is member
	"assignments-submissions:create:member_only" = "assignments-submissions:create:member_only",
	"assignments-submissions:read:member_only" = "assignments-submissions:read:member_only",
	"assignments-submissions:update:member_only" = "assignments-submissions:update:member_only",

	// can crud submissions of all courses
	"submissions:create" = "submissions:create",
	"submissions:read" = "submissions:read",
	"submissions:update" = "submissions:update",
	"submissions:delete" = "submissions:delete",

	// can crud submissions of courses where user is member
	"submissions:create:member_only" = "submissions:create:member_only",
	"submissions:read:member_only" = "submissions:read:member_only",
	"submissions:update:member_only" = "submissions:update:member_only",
	"submissions:delete:member_only" = "submissions:delete:member_only",

	// can crud submissions of courses where user is author
	"submissions:read:author_only" = "submissions:read:author_only",
	"submissions:update:author_only" = "submissions:update:author_only",
	"submissions:delete:author_only" = "submissions:delete:author_only",

	// can cru grade of submissions of all courses
	"submissions-grade:create" = "submissions-grade:create",
	"submissions-grade:read" = "submissions-grade:read",
	"submissions-grade:update" = "submissions-grade:update",

	// can cru grade of submissions of course where user is member
	"submissions-grade:create:member_only" = "submissions-grade:create:member_only",
	"submissions-grade:read:member_only" = "submissions-grade:read:member_only",
	"submissions-grade:update:member_only" = "submissions-grade:update:member_only",

	// can cru grade of submissions of course where user is member
	"submissions-grade:create:author_only" = "submissions-grade:create:author_only",
	"submissions-grade:read:author_only" = "submissions-grade:read:author_only",
	"submissions-grade:update:author_only" = "submissions-grade:update:author_only",

	// grades
	"grades:create" = "grades:create",
	"grades:read" = "grades:read",
	"grades:update" = "grades:update",
	"grades:delete" = "grades:delete",

	// member only
	"grades:create:member_only" = "grades:create:member_only",
	"grades:read:member_only" = "grades:read:member_only",
	"grades:update:member_only" = "grades:update:member_only",
	"grades:delete:member_only" = "grades:delete:member_only",

	// submission author only
	"grades:read:submission_author_only" = "grades:read:submission_author_only",

	// grader only
	"grades:read:grader_only" = "grades:read:grader_only",
	"grades:update:grader_only" = "grades:update:grader_only",
	"grades:delete:grader_only" = "grades:delete:grader_only"
}
