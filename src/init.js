//initializing

import app from "./server";
import "./db";
import videoModel from "./models/video";

const PORT = 4000;

const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening); //server 시작시 출력
//handleListening = callback function(어떠한 일이 일어난 후 호출되는 function)
