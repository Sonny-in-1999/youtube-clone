import express from "express";
import { 
    getEdit, 
    postEdit,   
    watch, 
    getUpload, 
    postUpload,
    deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";


const videoRouter = express.Router();

// :id ==> parameter url에 변수를 입력할 수 있게 해줌.
// express는 :를 변수로 인식함
// (\\d+): 1개이상(+)의 숫자(digit)만 parameter로 사용가능. regexp
// (\\w+): 1개이상(+)의 글자(world)만 parameter로 사용가능.
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
//하나의 http에 2개 이상의 메소드를 사용할 경우 route 사용


export default videoRouter;