import express from "express";

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");
const handleEditVideo  = (req, res) => res.send("Edit Video");
const handleDeleteVideo  = (req, res) => res.send("Delete Video");
const handleCommentVideo  = (req, res) => res.send("Comment Video");
const handleCommentDeleteVideo  = (req, res) => res.send("Delete Comment");

videoRouter.get("/watch", handleWatchVideo);
videoRouter.get("/edit", handleEditVideo);
videoRouter.get("/delete", handleDeleteVideo);
videoRouter.get("/comments", handleCommentVideo);
videoRouter.get("/comments/delete", handleCommentDeleteVideo);

export default videoRouter;
//default export = import할때 원하는 이름으로 설정가능
//ex) import video from "./routers/videoRouter";