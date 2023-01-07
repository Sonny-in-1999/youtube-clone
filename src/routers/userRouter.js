import express from "express";

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");
const handleDeleteUser = (req, res) => res.send("Delete User");

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);

export default userRouter;
//default export = import할때 원하는 이름으로 설정가능
//ex) import user from "./routers/userRouter";