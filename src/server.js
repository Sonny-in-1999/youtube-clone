//Configure application

import express from "express";
import morgan from "morgan";
import session, { Store } from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";



const app = express();
const logger = morgan("dev"); //return middleware

app.set("view engine","pug"); //view engine을 pug 플러그인으로 set.
app.set("views", process.cwd() + "/src/views");
 /* 퍼그는 기본적으로 노드를 실행하는 json의 경로에서 views 폴더를 탐색하여 렌더링 하기 때문에
 현재 작업중인 디렉토리(경로)를 임의로 변경 하였음 */
app.use(logger); 
//사용할 middleware는 반드시 logger(morgan plugin)밑에 작성할것!
app.use(express.urlencoded({extended:true}));
//form의 value를 리턴해주는 middleware ==> form을 javascript로 변환해줌
//이 구간에서 req.body 생성


app.use( //browser가 백엔드와 상호작용 할때마다 cookie를 전송해주는 middleware
  session({
    secret: "Hello!",
    store: MongoStore.create({mongoUrl:"mongodb://127.0.0.1:27017/metube"}),
    //session id를 server가 아닌 mongodb에 저장! mongo collections에 sessions가 추가됨!
    //server가 아닌 db에 저장하므로, 서버를 재시작해도 정보가 사라지지않음!!
  })
  );
  
  
  
  app.use(localsMiddleware); //session middleware를 실행한 다음에 실행되어야 함(session object에 접근하기 위함)
  app.use("/", rootRouter);
  app.use("/users", userRouter);
  app.use("/videos", videoRouter);
  
  export default app;
  



