import express from "express";
import { getEdit, postEdit, upload, deleteVideo, watch, getUpload, postUpload } from "../controllers/videoController";


const videoRouter = express.Router();

// :id ==> parameter url에 변수를 입력할 수 있게 해줌.
// express는 :를 변수로 인식함
// (\\d+): 1개이상(+)의 숫자(digit)만 parameter로 사용가능. regexp
// (\\w+): 1개이상(+)의 글자(world)만 parameter로 사용가능.
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);
//하나의 http에 2개 이상의 메소드를 사용할 경우 route 사용


export default videoRouter;