
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength: 80 },
    description: { type: String, required: true, minLength: 20 },
    createdAt: { type:Date, required: true, default: Date.now },
    //Date.now() X Date.now O => 내가 새로운 video를 생성했을 때만 실행시키기위해
    //()를 붙일경우 function을 즉각 실행시킴
    hashtags: [{type:String, trim:true}],
    //hashtag는 여러개를 생성할 수 있어야 하므로 array로 생성!
    //trim: 빈칸제거
    meta: {
        views: {type:Number, default: 0, required: true},
        rating: {type:Number, default: 0, required: true},
    },
});
//video(model)의 형식(schema)지정

const videoModel = mongoose.model("Video", videoSchema);
//video model 지정

export default videoModel;