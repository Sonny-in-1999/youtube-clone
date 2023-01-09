import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); //return middleware

app.set("view engine","pug"); //view engine을 pug 플러그인으로 set.
app.set("views", process.cwd() + "/src/views");
 /* 퍼그는 기본적으로 노드를 실행하는 json의 경로에서 views 폴더를 탐색하여 렌더링 하기 때문에
 현재 작업중인 디렉토리(경로)를 임의로 변경 하였음 */
app.use(logger); 
//사용할 middleware는 반드시 logger(morgan plugin)밑에 작성할것!
app.use(express.urlencoded({extended:true}));
//form의 value를 리턴해주는 middleware
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);



const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening); //server 시작시 출력

