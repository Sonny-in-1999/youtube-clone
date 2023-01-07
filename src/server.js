import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
    return res.send("<h1>You can't access this page</h1>");
};
const handleLogin = (req,res) => {
    return res.send({message: "Login here."});
}

app.get("/", handleHome);   //request (브라우저가 홈페이지 요청)
app.get("/login", handleLogin);

const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening); //server 시작시 출력