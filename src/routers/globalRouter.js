import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");
const handleJoin = (req, res) => res.send("Join");
const handleLogin = (req, res) => res.send("Login");
const handleSearch = (req, res) => res.send("Search");


globalRouter.get("/", handleHome);
globalRouter.get("/join", handleJoin);
globalRouter.get("/login", handleLogin);
globalRouter.get("/search", handleSearch);

export default globalRouter;
//default export = import할때 원하는 이름으로 설정가능
//ex) import global from "./routers/globalRouter";