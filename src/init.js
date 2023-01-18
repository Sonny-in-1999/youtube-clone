//initializing
import "dotenv/config" //.env에 있는 string을 process.env.~~로 불러올 수 있게 해줌!
//dotenv는 반드시 가장 먼저 적용되어야함. (다른 app들 보다)
import "./db";
import videoModel from "./models/video";
import userModel from "./models/user";
import commentModel from "./models/comment.";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening); //server 시작시 출력
//handleListening = callback function(어떠한 일이 일어난 후 호출되는 function)
