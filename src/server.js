//Configure application
import express from "express";
import morgan from "morgan";
import session, { Store } from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware, notFoundMiddleware } from "./middlewares";



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
    secret: "process.env.COOKIE_SECRET", //cookie에 sign. backend에서 유저를 증명하는 용도.
    resave: false,
    /*
    resave: 모든 req마다 session의 변경사항이 있든 없든 세션을 다시 저장함.
    변경사항이 없음에도 세션을 저장하면 비효율적이고, 두가지 이상의 req를 동시에 
    처리하는 과정에서 충돌이 발생할 수 있으므로 false로 설정.(대부분의 경우 false)
    */
    saveUninitialized: false,
    /* 
    saveUninitialized: req때 생성된 이후 아무런 작업이 발생하지 않은 session을 저장한다.
    저장공간을 절약하기 위해 내용이 없는 빈 세션은 삭제하도록 false로 설정.(대부분 false)
    true로 설정할 경우 각 client가 서버에 총 몇회 방문하였는지 알 수 있다.
    */
    store: MongoStore.create({mongoUrl:process.env.DB_URL}),
    //session id를 server가 아닌 mongodb에 저장! mongo collections에 sessions가 추가됨!
    //server가 아닌 db에 저장하므로, 서버를 재시작해도 정보가 사라지지않음!!
  })
  );
  
  
  
  app.use(localsMiddleware); //session middleware를 실행한 다음에 실행되어야 함(session object에 접근하기 위함)
  app.use("/upload", express.static("upload"))
  app.use("/", rootRouter);
  app.use("/users", userRouter);
  app.use("/videos", videoRouter);
  app.use(notFoundMiddleware);
  
  export default app;
  



