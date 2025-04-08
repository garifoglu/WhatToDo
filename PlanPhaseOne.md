# Definition and planning

A To do list application.

# 1. User Personas (Who will use your app?)

## Persona 1: Busy Student
Name: Alex

Age: 20

"Quickly add homework deadlines."

"If I close the app by mistake, my task disappears."

Needs offline access.

## Persona 2: Organized Professional
1. The Professional (Tomris)

 "I type my homework deadline, but the app doesn’t show me how many days are left."

 "If I close the app by mistake, my task disappears."

## Persona 3:  Grandpa:
Name: Kari
Age: 65
Occupation: Retired
Goals:

"I want to quickly add a task without clicking 3 buttons."

"I can’t see small fonts."

# 2. Use Cases and User Flows:
Use Cases & User Flows 

## Use Cases:

### 1. Core Features
Add Task: Type + press Enter → list updates.

Complete Task: Click checkbox → task moves to "Done".

Delete Task: Click trash icon → task removed (with undo option).

Edit Task: User can edit the added to dos. 

Also e-mail notifications for reminding deadlines(API).

### 2. Authentication (Basic)

Log In: Email + password → access todos.

Log Out: Button in upper right side.

Open App → (Authentication Screen) → Home → (Add/Complete/Delete) → Log Out  

# 3. UI Prototypes 

![WhatsApp Image 2025-04-08 at 22 49 16_7f3df4a5](https://github.com/user-attachments/assets/bbdcc069-608e-4397-92d0-334ac0adb5e5)

# 4. Information Architecture & Technical Design
Log In: Email + password → access todos.

##Data structure blueprint:
interface Todo {
  id: string;                 
  task: string;               // "Buy groceries"
  dueDate?: Date;             // Optional (Tomris's requirement)
  category: "work"|"personal";// Kari's requirement
  completed: boolean;
  userId: string;             
}


interface User {
  id: string;
  email: string;
  passwordHash: string;
  verified: boolean;
}
## Used tech
Frontend: JavaScript, HTML/CSS, React
Backend: Node.js Express.js
Database: SQLite(Local), PostgreSQL(Azure Cloud)
Deployment: GitHub, Docker(???).
 
# 5. Project Management and User Testing
Timeline:

## Week Todo App Development Plan

Week 1: Define personas and use cases

Outline core app functionalities

Week 2-4: Develop frontend and backend, Create UI prototypes.

Design basic screens and user flows

Build user interface components

Implement server-side logic

Connect frontend to backend

Week 5: Connect database + test flows

Set up and integrate database

Test all user interactions

Fix connection issues

Week 6: Final testing + polish

Conduct comprehensive testing

UI/UX details

Prepare for deployment

## Testing:
One or two tests according to need:

1. Unit Test

2. End-to-End (E2E) Test

3. Collecting feedback on usability.

   

