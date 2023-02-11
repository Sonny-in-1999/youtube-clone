유튜브 클론코딩 입니다.
주요스택: Node.js/Pug/MongoDB/Mongoose/express/bcrypt/babel/sass/webpack

백엔드: Node.js
DOM: Pug
DB: MongoDB(Mongoose를 이용하여 유저 정보 및 영상 정보를 저장)


bcrypt를 이용하여 유저 패스워드를 5회 해싱처리하여 DB에 저장합니다(유저정보 보안)



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
1. Conditinal:
ex)login/log-out
if/else/else if

2. iteration:
showing lists of element
each ~~ in ~~

3. mixing



#CRUD
Create
Read
Update
Delete
