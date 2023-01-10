
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{type:String}],
    meta: {
        views: Number,
        rating: Number,
    },
});
//video의 형식(schema)지정

const videoModel = mongoose.model("Video", videoSchema);
//video model 지정


export default videoModel;