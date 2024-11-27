Flatmate Flow - Backend

Flatmate Flow is a backend service for managing roommate groups, shared expenses, tasks, and notes. Built with the MERN stack, the backend provides a secure and efficient API for user and group management, task assignments, recurring tasks, and expense tracking.

Technologies Used

Node.js: JavaScript runtime for server-side development.
Express.js: Framework for building robust RESTful APIs.
MongoDB: Database for storing user, group, task, and expense data.
JWT: Secure token-based authentication.
Bcrypt.js: Password hashing for user and group authentication.

Features

User Authentication:
Secure login and registration.
JWT-based authentication.

Group Management:
Create and join groups with password protection.
Add and remove members (admin only).
Delete group functionality (admin only).

Task Management:
Create tasks with due dates and assigned members.
Mark tasks as complete.
Recurring task functionality (in progress).

Expense Tracking:
Record and split expenses among group members (in progress).
Track unsettled balances.

Notes:
Add, view, and pin important group notes.


Work To Be Done

Handle Expired Tasks: Implement cron jobs to manage overdue tasks and notify users.
Recurring Tasks: Enhance recurring task functionality to auto-assign users and set new due dates. Have a script taskScheduler.js need to make frontend work with it
Expense Tracking: Finalize APIs for expense recording and balance settlement.
Sign in with Google: Add google authentication through firebase
verify email: Add verification email when registering user


API Endpoints

Authentication
POST /api/users/register        : Register a new user.
POST /api/users/login           : Login a user.
GET /api/users/profile          : Get user profile details.

Group Management
POST /api/groups/               : Create a group.
POST /api/groups/join           : Join a group.
POST /api/groups/addmember      : Add a member to a group.
POST /api/groups/removemember   : Remove a member from a group.
POST /api/groups/deletegroup    : Delete a group.

Task Management
POST /api/tasks/                   : Create a task.
GET /api/tasks/:groupId            : Get tasks for a group.
PUT /api/tasks/:taskId/complete    : Mark a task as complete.