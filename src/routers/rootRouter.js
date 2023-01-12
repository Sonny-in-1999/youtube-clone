import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/login", login);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;