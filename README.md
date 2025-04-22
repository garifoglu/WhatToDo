# Project phase 2 - Basic structure and main functionalities
Add something

## 1. Environment
The project uses:

Backend: Node.js with Express.js

Frontend: React.js

Database: PostgreSQL with Sequelize 

Development Tools: VS Code, Postman (for API testing but it didn't work well. Trying to change it.)

The app runs on:

Backend: http://localhost:5000

Frontend: http://localhost:3000

## 2. Backend
The backend handles:

API routes (GET, POST, PUT, DELETE) for todos

Database connection using Sequelize

Error handling for wrong requests

Example Code (Backend - server.js):

![image](https://github.com/user-attachments/assets/1bafe337-c1be-47cd-bcfd-faab4856e49c)

## 3. Frontend
The frontend is built with React and includes:

Todo list (shows all todos)

Add new todo (form with input)

Edit and delete (buttons for each todo)

![image](https://github.com/user-attachments/assets/e30fc556-9c13-42df-823e-118565829b65)


Example Code (Frontend - App.js):

## 4. Database
Uses PostgreSQL for storing todos.

Sequelize helps manage the database.

Tables:

Todos (id, title, completed, createdAt)

Example Code (Database - models/Todo.js):

![image](https://github.com/user-attachments/assets/6bd64346-8bc2-4293-be4f-6e8a5058a062)


## 5. Basic structure and architecture
The project is organized as:


![image](https://github.com/user-attachments/assets/9509ef86-6e9a-4fe6-a702-c816e0ecff81)

![image](https://github.com/user-attachments/assets/8222ed1c-bd98-4bad-9c31-fc1378f0e269)

Backend handles API requests.

Frontend shows the user interface.

Database stores todos.

## 6. Functionalities
The app can:
✅ Add new todos
✅ List all todos
✅ Edit todos (change text)
✅ Delete todos
✅ Mark todos as completed


## 7. Code quality and documentation
Add something

## 8. Testing and error handling

Backend tested with Postman.

Frontend tested manually.

Error handling for wrong inputs.

Example Error Handling (Backend):

![image](https://github.com/user-attachments/assets/f11f1c1d-ef04-43f4-91f8-2a8fec1ed0f7)

If the database fails, it sends an error message.



## 9. User interface and interaction
Simple design (easy to use).

Responsive (works on computers).

Clear buttons (add, edit, delete).
(screenshot could be nice but having problems on app right now.)

## Conclution
I am having troubles about authentication, planning to remove it from project. Could be easier to pick more lower technology for this project. Othervise it is good to practise it myself.

