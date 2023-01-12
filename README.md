Router

#Global Router
/ -> Home
/join -> Join
/login -> Login
/search -> Search a video

#User Router
/users/:id -> See User(Profile)
/users/logout -> Log out
/users/edit -> Edit my profile
/users/delete -> Delete my profile

#Video Router
/videos/:id -> See video
/videos/:id/edit -> Edit video
/videos/:id/delete -> Delete video
/videos/upload -> Upload video


Router(경로설정) <--- Controller(Router의 기능 설정)



#Template
1. Conditinal
ex)login/log-out
if/else/else if

2. iteration
showing lists of element
each ~~ in ~~

3. mixing

#CRUD
Create
Read
Update
Delete