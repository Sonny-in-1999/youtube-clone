
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/metube");
mongoose.set('strictQuery', true);

const db = mongoose.connection;
//mongoDB에 연결!

const handleOpen = () => console.log("Connected to DB!")
const handleError = (error) => console.log("DB ERROR", error)
db.on("error", handleError);
db.once("open", handleOpen);

//on: 조건이 충족할때마다 계속 이벤트 발생(횟수제한 x)
//once: 조건이 충족한 최초 1회에 한하여 이벤트 발생(횟수제한 o)