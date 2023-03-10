import userModel from "../models/user";
import videoModel from "../models/video";
import commentModel from "../models/comment.";
import User from "../models/user";

videoModel.find({}, (error, videos) => {});
//{}: Search Term(비어있을 경우, 모든 형식을 search), db가 반응할경우 mongoose가 function 실행!
//promise 형식으로 작성(async - await)

export const home = async(req, res) => { 
    try { //실행
        const videos = await videoModel.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");
        //sort: ~~를 기준으로 영상을 분류
        //videoModel.find({}) => db에 있는 video를 불러옴
        //await: callback이 필요하지 않음을 의미(표시)! await이 db를 기다려줌 (중요)await은 async function 안에서만 사용가능!!
       
        res.render("home", {pageTitle: "Home", videos});
        //template를 rendering
        //return이 아닌 function(render) 그 자체에 집중할 것!
    } catch(error){ //try에서 에러가 발생할 경우 catch로 점프!
        return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message })
        //error가 발생할 경우 upload페이지를 다시 렌더링!
    }
};

export const watch = async (req, res) => {
    const { id } = req.params; //영상의 링크마다 존재하는 난수(id)를 id로 지정. id를 통해 영상을 구분!!
    const video = await videoModel.findById(id).populate("owner").populate("comments"); //populate를 통해 다른 컬렉션의 문서를 참조할 수 있음.
    //populate: 문서의 지정된 경로를 다른 컬렉션의 문서로 자동 교체하는 프로세스
    if(!video){
        return res.render("404", {pageTitle: "Video not found."});
        //존재하지 않는 영상(존재하지 않는 id)을 검색한 경우
    };
    res.render("watch", {pageTitle: video.title, video});
};

export const getEdit = async (req, res) => {
    const { id } = req.params; //영상의 링크마다 존재하는 난수(id)를 id로 지정. id를 통해 영상을 구분!!
    const {user: {_id}} = req.session;
    const video = await videoModel.findById(id) 
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
        //존재하지 않는 영상(존재하지 않는 id)을 검색한 경우
    };
    if(String(video.owner) !== String(_id)){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    };
    res.render("edit", {pageTitle:`Edit ${video.title}`, video});
};

export const postEdit = async (req, res) => {
    const {user: {_id}} = req.session;
    const { id } = req.params; //영상의 링크마다 존재하는 난수(id)를 id로 지정. id를 통해 영상을 구분!!
    const {title, description, hashtags} = req.body; //form의 내용을 받아옴!
    const video = await videoModel.exists({ _id: id });
    //exists() => ()안의 내용이 존재하는지 찾을 수 있음
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
        //존재하지 않는 영상(존재하지 않는 id)을 검색한 경우
    };
    if(String(video.owner) !== String(_id)){
        req.flash("error", "You are not the owner of the video");
        return res.status(403).redirect("/");
    };
    await videoModel.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: videoModel.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {
        user:{_id},
    } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body; //form의 내용을 받아옴!
    //name="title"인 input(upload.pug의 text)에서 req.body(input의 내용)을 받아옴!
    try {
        const newVideo = await videoModel.create({
            title,
            description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            owner:_id,
            hashtags: videoModel.formatHashtags(hashtags),
        });
        const user = await userModel.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", {
            //.status(400): 브라우저에게 상태코드 400를 인식시켜 영상을 저장하지 못하게 함
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
    
};

export const deleteVideo = async (req, res) => {
    const {user: {_id}} = req.session;
    const {id} = req.params; //영상의 링크마다 존재하는 난수(id)를 id로 지정. id를 통해 영상을 구분!!
    const video = await videoModel.findById(id);
    const user = await userModel.findById(_id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
        //존재하지 않는 영상(존재하지 않는 id)을 검색한 경우
    };
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    };
    await videoModel.findByIdAndDelete(id);
    //delete video
    //몽고DB는 롤백기능을 지원하지 않으므로 대부분의 상황에서 Remove가 아닌 Delete를 사용!
    user.videos.splice(user.videos.indexOf(id),1);
    user.save(); //유저db에 남아있는 videos도 함께 삭제
    return res.redirect("/");
};

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){ //keyword(검색한 내용)가 있을경우 title이 keyword와 일치한 video를 search
        videos = await videoModel.find({
            title: { //$regex : keyword를 포함(contains)하여 검색!
                $regex: new RegExp(keyword, "i") //"i": 대/소문자 구분없이 검색
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle:"Search", videos});
};


export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await videoModel.findById(id);
    if (!video) {
        return res.sendStatus(404);
        //상태코드를 보내고 연결을 종료!
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        session: {user},
        body: {text},
        params: {id},
    } = req;
    
    const video = await videoModel.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await commentModel.create({
        text,
        owner:user._id,
        video:id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId:comment._id});
    //request를 보낼경우 backend에서 comment._id로 응답함
    //201 = Created(새로운 리소스를 생성함)
};

export const deleteComment = async (req, res) => {
    const { id, videoid } = req.body; // comment id, video id
    const { _id } = req.session.user; // user id
    const { owner } = await commentModel.findById(id);
    const video = await videoModel.findById(videoid);
    if (String(owner) !== _id) return res.sendStatus(403);
    else {
      await commentModel.findByIdAndDelete(id);
      video.comments.splice(video.comments.indexOf(videoid), 1);
      video.save();
      return res.sendStatus(200);
    }
};