
import videoModel from "../models/video"

videoModel.find({}, (error, videos) => {

});
//{}: Search Term(비어있을 경우, 모든 형식을 search), db가 반응할경우 mongoose가 function 실행!

export const home = async(req, res) => { //promise 형식으로 작성되었음 (Not callback)
    try { //실행
        const videos = await videoModel.find({});
        //videoModel.find({}) => db에 있는 video를 불러옴
        //await: callback이 필요하지 않음을 의미(표시)! await이 db를 기다려줌 (중요)await은 async function 안에서만 사용가능!!
        console.log(videos);
        res.render("home", {pageTitle: "Home", videos});
        //template를 rendering
        //return이 아닌 function(render) 그 자체에 집중할 것!
    } catch(error){ //try에서 에러가 발생할 경우 catch로 점프!
        console.log(error);
        return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message })
        //error가 발생할 경우 upload페이지를 다시 렌더링!
    }
};

export const watch = (req, res) => {
    const { id } = req.params;
    res.render("watch", {pageTitle:`Watching: ${video.title}`});
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    res.render("edit", {pageTitle:`Editing: ${video.title}`});
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    //form에 작성한 내용으로 title을 변경
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    //name="title"인 input(upload.pug의 text)에서 req.body(input의 내용)을 받아옴!
    await videoModel.create({
        title,
        description,
        hashtags: hashtags.split(",").map((word) => `#${word}`),
        meta: {
            views: {type:Number, default: 0, required: true},
            rating: {type:Number, default: 0, required: true},
        },
    });
    //await video.save();
    //video.save() => 생성된 video를 return 해줌 (db에 저장!)
    return res.redirect("/");
};

