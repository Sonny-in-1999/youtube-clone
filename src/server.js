import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => { //middleware 
    console.log(`${req.method} ${req.url}`);
    next(); //다음 펑션을 수행
};

const privateMiddleware = (req, res, next) => { //middleware
    const url = req.url;
    if(url == "/protected"){
        return res.send("<h1>You Are Not Allowed!</h1>");
    } //This middleware is controller.
    console.log("Allowed. You may continue.");
    next(); //다음 펑션을 수행
};

const handleHome = (req, res) => { //finalware
    return res.send("<h1>Middleware alive!</h1>");
};

const handleLogin = (req, res) => {
    return res.send({message: "Login here."});
};

const handleProtected = (req, res) => {
    return res.send("Welcome to the private lounge.");
};

app.use(logger); //middleware 사용, 반드시 get보다 위에 있어야함
app.use(privateMiddleware); //use를 사용함으로써 모든 url에 middleware를 적용함.
app.get("/", handleHome);   // "/" = router 문 같은 역할
app.get("/login", handleLogin); 
app.get("/protected", handleProtected);
//app.get(path, middleware, finalware)의 형식으로 하나의 url에만 middleware를 적용할 수 있음
const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening); //server 시작시 출력