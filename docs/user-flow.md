# User Flow

-   [User Flow](#user-flow)
-   [Login](#login)
-   [Forgot Password](#forgot-password)
-   [Reset Password](#reset-password)
-   [Dashboard](#dashboard)
    -   [Dashboard Imitate Role Card](#dashboard-imitate-role-card)
    -   [Dashboard Role Card](#dashboard-role-card)
    -   [Dashboard Users Role Card](#dashboard-users-role-card)
    -   [Dashboard Courses Card](#dashboard-courses-card)
    -   [Dashboard Assignments Card](#dashboard-assignments-card)
    -   [Dashboard Submissions Card](#dashboard-submissions-card)
    -   [Dashboard Grades Card](#dashboard-grades-card)
-   [Roles](#roles)
-   [Users](#users)
-   [Courses](#courses)
    -   [Course ID](#course-id)
        -   [Course Dashboard](#course-dashboard)
            -   [Course Dashboard Assignments Card](#course-dashboard-assignments-card)
            -   [Course Dashboard Submissions Card](#course-dashboard-submissions-card)
            -   [Course Dashboard Grades Card](#course-dashboard-grades-card)
            -   [Course Dashboard Members Card](#course-dashboard-members-card)
            -   [Course Dashboard Sessions Card](#course-dashboard-sessions-card)
            -   [Course Dashboard Users Role Card](#course-dashboard-users-role-card)
        -   [Course Assignments](#course-assignments)
        -   [Course Submissions](#course-submissions)
        -   [Course Grades](#course-grades)
        -   [Course Sessions](#course-sessions)
        -   [Course Members](#course-members)
-   [Assignments](#assignments)
-   [Submissions](#submissions)
-   [Grades](#grades)
-   [Locations](#locations)
-   [Subjects](#subjects)

# Login

# Forgot Password

# Reset Password

# Dashboard

-   [x] Renders for all user role

## Dashboard Imitate Role Card

-   [ ] Renders if user has "dashboard:imitate" view
-   [ ] Render dropdown option for [role-1] if user has "dashboard:imitate:[role-1]"
-   WIP

## Dashboard Role Card

-   [x] Renders if user has "dashboard:roles" view
-   [ ] Render roles count if user has "dashboard:roles:count" view
-   [ ] Render View button if user has "dashboard:roles:read" view
    -   [x] On click: links to [/roles](#roles)
-   [ ] Render Create button if user has "dashboard:roles:create" view
    -   [ ] On click: open create role form

## Dashboard Users Role Card

-   [x] Renders [role-1] card if user has "dashboard:users:[role-1]"
-   [ ] Render user-with-[role-1] count if user has "dashboard:users:[role-1]:count" view
-   [ ] Renders View button if user has "dashboard:users:[role-1]:read"
    -   [x] On click: links to [/users?role=\[role-1\]](#users)
-   [ ] Renders Create button if user has "dashboard:users:[role-1]:create"
    -   [] On click: open create user form

## Dashboard Courses Card

-   [x] Renders if user has "dashboard:courses" view
-   [ ] Render all courses count if user has "dashboard:courses:allCount" view
-   [ ] Render currently (enrolling) courses count if user has "dashboard:courses:currentCount" view
-   [ ] Render past (enrolled) courses count if user has "dashboard:courses:pastCount" view
-   [ ] Renders View button if user has "dashboard:courses:read" view
    -   [x] On click: links to [/courses](#courses)
-   [ ] Renders Create button if user has "dashboard:courses:create" view
    -   [ ] On click: open create course form

## Dashboard Assignments Card

-   [ ] Renders if user has "dashboard:assignments" view
-   [ ] Render assignments count if user has "dashboard:assignments:allCount" view
-   [ ] Render upcoming-assignments count if user has "dashboard:assignments:upcomingCount" view
-   [ ] Render past-assignments count if user has "dashboard:assignments:pastCount" view
-   [ ] Render ontime-assignments count if user has "dashboard:assignments:onTimeCount" view
-   [ ] Render late-assignments count if user has "dashboard:assignments:lateCount" view
-   [ ] Render submitted-assignments count if user has "dashboard:assignments:submittedCount" view
-   [ ] Render not-submitted-assignments count if user has "dashboard:assignments:notSubmittedCount" view
-   [ ] Render graded-assignments-count if user has "dashboard:assignments:gradedCount" view
-   [ ] Render not-graded-assignments count if user has "dashboard:assignments:notGradedCount" view
-   [ ] Renders View button if user has "dashboard:assignments:read" view
    -   [x] On click: links to [/assignments](#assignments)
-   [ ] Renders Create button if user has "dashboard:assignments:create" view
    -   [ ] On click: open dialog to prompt for which course to create new assignment in. Contain button to proceed to create assignment
    -   [ ] On choose course and click proceed, render create assignment form

## Dashboard Submissions Card

-   [ ] Renders if user has "dashboard:submissions" view
-   [ ] Render submissions count if user has "dashboard:submissions:allCount" view
-   [ ] Render on-time-submissions-of-all-courses count if user has "dashboard:submissions:onTimeAllCoursesCount" view
-   [ ] Render on-time-submissions-of-current-courses count if user has "dashboard:submissions:onTimeCurrentCoursesCount" view
-   [ ] Render on-time-submissions-of-past-courses count if user has "dashboard:submissions:onTimePastCoursesCount" view
-   [ ] Render late-submissions-of-all-courses count if user has "dashboard:submissions:lateAllCoursesCount" view
-   [ ] Render late-submissions-of-current-courses count if user has "dashboard:submissions:lateCurrentCoursesCount" view
-   [ ] Renders View button if user has "dashboard:submissions:read" view
    -   [x] On click: links to [/submissions](#submissions)
-   [ ] Renders Create button if user has "dashboard:submissions:create" view
    -   [ ] On click: open dialog to prompt for which course to create new submission in. Contain button to proceed to choose which assignment in chosen course
    -   [ ] On proceed: prompt for which assignment to create new submission in. User can query for assignments that are submitted or not, past or current courses, late or ontime assignments (total of 3 metadata, represented by 3 dropdown inputs). Also, dialog contain button to proceed to create submission.
    -   [ ] On choose assignment and click proceed, render create submission form

## Dashboard Grades Card

-   [ ] Renders if user has "dashboard:grades" view
-   [ ] Render grades count if user has "dashboard:grades:allCount" view
-   [ ] Renders View button if user has "dashboard:grades:read" view
    -   [x] On click: links to [/grades](#grades)
-   [ ] Renders Create button if user has "dashboard:grades:create" view
    -   [ ] On click: open dialog to prompt for which course to create new grade in. Contain button to proceed to choose which assignment in chosen course
    -   [ ] On proceed: prompt for which assignment to create new grade in. User can query for assignments that are fully graded or not, past or current courses (total of 2 metadata, represented by 2 dropdown inputs). Also, dialog contain button to proceed to create grade for the chosen assignment.
    -   [ ] On choose assignment and click proceed, render table displaying assignment grade status

# Roles

-   [x] Render tabs for table and card view if user has "roles:table" and "roles:card" views
-   [x] Render just table view if user has "roles:table" view only
    -   [x] Render create role button if user has "roles:table:create" view
        -   [x] On click: render create role form
    -   [x] Render detail button in extra actions at each table row if user has "roles:table:read" view
        -   [ ] On click: render role detail sheet
    -   [x] Render edit button in extra actions at each table row if user has "roles:table:update" view
        -   [x] On click: render edit role sheet
    -   [x] Render delete button in extra actions at each table row if user has "roles:table:delete" view
        -   [x] On click: render delete role dialog
    -   [ ] Implement pagination
-   [x] Render just card view if user has "roles:card" view only
-   [ ] Implement pagination

# Users

-   [x] Render tabs for table and card view if user has "users:table" and "users:card" views
-   [x] Render just table view if user has "users:table" view only
    -   [x] Render create role button if user has "users:table:create" view
        -   [x] On click: render create user form
    -   [x] Render detail button in extra actions at each table row if user has "users:table:read" view
        -   [x] On click: render user detail sheet
    -   [x] Render edit button in extra actions at each table row if user has "users:table:edit" view
        -   [x] On click: render edit user sheet
    -   [x] Render delete button in extra actions at each table row if user has "users:table:delete" view
        -   [x] On click: render delete user dialog
    -   [ ] Implement pagination
-   [x] Render just card view if user has "users:card" view only
    -   [x] On click: render user detail sheet
-   [ ] Implement pagination

# Courses

-   [x] Render tabs for table and card view if user has "courses:table" and "courses:card" views
-   [x] Render just table view if user has "courses:table" view only
    -   [x] Render create course button if user has "courses:table:create" view
        -   [x] On click: render create course form
    -   [x] Render detail button in extra actions at each table row if user has "courses:table:read" view
        -   [x] On click: link to [/courses/\[courseId\]](#course-id)
    -   [x] Render edit button in extra actions at each table row if user has "courses:table:edit" view
        -   [x] On click: render edit course sheet
    -   [x] Render delete button in extra actions at each table row if user has "courses:table:delete" view
        -   [x] On click: render delete course dialog
    -   [ ] Implement pagination
-   [x] Render just card view if user has "courses:card" view only
    -   [x] On click: link to [/courses/\[courseId\]](#course-id)
-   [ ] Implement pagination

## Course ID

### Course Dashboard

-   [x] Renders for all user role

#### Course Dashboard Assignments Card

WIP (needs double check with code base)

-   [x] Renders if user has "courses:course:dashboard:assignments" view
-   [x] Render assignments count if user has "courses:course:dashboard:assignments:allCount" view
-   [x] Render upcoming-assignments count if user has "courses:course:dashboard:assignments:upcomingCount" view
-   [x] Render past-assignments count if user has "courses:course:dashboard:assignments:pastCount" view
-   [ ] Render ontime-assignments count if user has "courses:course:dashboard:assignments:onTimeCount" view
-   [ ] Render late-assignments count if user has "courses:course:dashboard:assignments:lateCount" view
-   [x] Render submitted-assignments count if user has "courses:course:dashboard:assignments:submittedCount" view
-   [ ] Render not-submitted-assignments count if user has "courses:course:dashboard:assignments:notSubmittedCount" view
-   [ ] Render graded-assignments-count if user has "courses:course:dashboard:assignments:gradedCount" view
-   [ ] Render not-graded-assignments count if user has "courses:course:dashboard:assignments:notGradedCount" view
-   [ ] Renders View button if user has "courses:course:dashboard:assignments:read" view
    -   [ ] On click: links to [/[courseId]/assignments](#course-assignments)
-   [ ] Renders Create button if user has "courses:course:dashboard:assignments:create" view
    -   [ ] Render create assignment form

#### Course Dashboard Submissions Card

WIP

#### Course Dashboard Grades Card

WIP

#### Course Dashboard Members Card

WIP

#### Course Dashboard Sessions Card

WIP

#### Course Dashboard Users Role Card

WIP

### Course Assignments

WIP

### Course Submissions

-   [ ] Render tabs for table and card view if user has "courses:course:submissions:table" and "courses:course:submissions:card" views
-   [ ] Render just table view if user has "courses:course:submissions:table" view only
    -   [ ] Render create course button if user has "courses:course:submissions:table:create" view
        -   [ ] On click: render dialog prompting user which assignment to create this submisison to. Also, the dialog has a button to proceed to create submission
        -   [ ] When user click proceed, render create submission form
    -   [ ] Render detail button in extra actions at each table row if user has "courses:course:submissions:table:read" view
        -   [ ] On click: render submission detail
    -   [ ] Render edit button in extra actions at each table row if user has "courses:course:submissions:table:edit" view
        -   [ ] On click: render edit submission sheet
    -   [ ] Render delete button in extra actions at each table row if user has "courses:course:submissions:table:delete" view
        -   [ ] On click: render delete submission dialog
    -   [ ] Implement pagination
-   [ ] Render just card view if user has "courses:course:submissions:card" view only
    -   [ ] On click: render submission detail
-   [ ] Implement pagination

### Course Grades

WIP

### Course Sessions

WIP

### Course Members

WIP

# Assignments

WIP

# Submissions

WIP

# Grades

WIP

# Locations

-   [x] Render tabs for table and card view if user has "locations:table" and "locations:card" views
-   [x] Render just table view if user has "locations:table" view only
    -   [x] Render create location button if user has "locations:table:create" view
        -   [x] On click: render create location form
    -   [x] Render detail button in extra actions at each table row if user has "locations:table:read" view
        -   [ ] On click: render location detail sheet
    -   [x] Render edit button in extra actions at each table row if user has "locations:table:edit" view
        -   [x] On click: render edit location sheet
    -   [x] Render delete button in extra actions at each table row if user has "locations:table:delete" view
        -   [x] On click: render delete location dialog
    -   [ ] Implement pagination
-   [x] Render just card view if user has "locations:card" view only
-   [ ] Implement pagination

# Subjects

-   [x] Render tabs for table and card view if user has "subjects:table" and "subjects:card" views
-   [x] Render just table view if user has "subjects:table" view only
    -   [x] Render create subject button if user has "subjects:table:create" view
        -   [x] On click: render create subject form
    -   [x] Render detail button in extra actions at each table row if user has "subjects:table:read" view
        -   [ ] On click: render subject detail sheet
    -   [x] Render edit button in extra actions at each table row if user has "subjects:table:edit" view
        -   [x] On click: render edit subject sheet
    -   [x] Render delete button in extra actions at each table row if user has "subjects:table:delete" view
        -   [x] On click: render delete subject dialog
    -   [ ] Implement pagination
-   [x] Render just card view if user has "subjects:card" view only
-   [ ] Implement pagination
