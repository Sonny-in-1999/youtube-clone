//Configure application

import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";



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


app.use(
    session({
      secret: "Hello!"
    })
  );

app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        //browser마다 다른 cookie(session id)를 보냄. browser 구분 가능.
        next();
    });
});

app.get("/add-one", (req, res, next) => {
    req.session.potato += 1;
    return res.send(`${req.session.id}\n${req.session.potato}`);
})

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;




