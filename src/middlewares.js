export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Metube";
    res.locals.loggedInUser = req.session.user;
    //userModel형식으로 저장된 user의 정보를 res(도착점)에 loggedInUser 객체로 저장!
    console.log(res.locals);
    next();
};

//res.locals ==> 어떤 객체(object)든 집어넣을 수 있음. 
//전역함수 => 전역에서 사용 가능 !! pug에서도 사용이 가능하다!

//locals은 res에, sessions은 req에 있음.
//res.locals(서버반응, 도착점)에 req.session(브라우저요청, 출발점)의 객체를 할당하는 middleware!!!
//==>프론트엔드에서 받은 정보를 백엔드로 저장~~

//req.session은 브라우저마다 각각 다름.(front-end)





/*
request 범위가 지정된 response 로컬 변수를 포함하는 객체이므로 request,
response 주기동안 렌더링된 view에서만 사용할 수 있음.
*/