#Dependencies
Use npm install initially for dependencies included with package.json
You may have to run this in both the root of the project and in ./apps/api/

#Configure database

This can be done by setting up a postgres docker container with docker-compose (make sure you have docker installed locally)
Or use npm
`npm run db:start`

#database tables should be created upon using the npm commands above

#start with the following npm command
npm run dev

#test automatically with the following npm command
npm run test

#ROUTES SUPPORTED
GET /tasks returns a list.
POST /tasks creates a task.
GET /tasks/:id returns one task.
PATCH /tasks/:id updates a task.
DELETE /tasks/:id deletes a task.

#MANUAL TESTS
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Create API","status":"todo"}'
curl http://localhost:3000/tasks/1
curl -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"status":"done"}'
curl -X DELETE http://localhost:3000/tasks/1
curl http://localhost:3000/tasks/9999
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"status":"todo"}'

#REFLECTION QUESTIONS
1) the difference is in memory is ephemeral and storing in a database is persistent, if your server reboots with in memory data you lose all of your data

2) separation of concerns makes it easier to work on site code, it makes it easier to fix problems, it makes it easier to read

3) Following status codes were used
200 	ok request
201 	created task
400 	bad task request
404 	task not found
500 	server error

4) Client gets a 404 task not found error

5) The hardest part of connecting to the PostgresQL API was having a separate postgresql database running through a brew service on my mac and not realizing it and pulling my hair out wondering why the app wouldn't connect to the database pool even though all of the information was correct. Then realizing the service was running. Only afterwards to resolve that problem, realize I had added the wrong data into my git commit, removing it (and literally two weeks of work) with git rm -rf and having to redo everything last minute in a panic.
