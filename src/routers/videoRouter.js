import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";


const videoRouter = express.Router();

videoRouter.get("/upload", upload);
/*upload를 :id보다 아래에서 get할 경우 동일한 자리에 있는 upload를 변수로 인식해버리므로,
  반드시 :id보다 먼저 get해야함!*/
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
// :id ==> parameter url에 변수를 입력할 수 있게 해줌.
// express는 :를 변수로 인식함
// (\\d+): 1개이상(+)의 숫자(digit)만 parameter로 사용가능. regexp
// (\\w+): 1개이상(+)의 글자(world)만 parameter로 사용가능.
export default videoRouter;