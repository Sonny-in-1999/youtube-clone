
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type:Date, required: true, default: Date.now },
    //Date.now() X Date.now O => 내가 새로운 video를 생성했을 때만 실행시키기위해
    //()를 붙일경우 function을 즉각 실행시킴
    hashtags: [{type:String}],
    meta: {
        views: Number,
        rating: Number,
    },
});
//video(model)의 형식(schema)지정

const videoModel = mongoose.model("Video", videoSchema);
//video model 지정

export default videoModel;