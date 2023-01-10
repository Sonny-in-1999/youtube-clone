let videos = [{
    title: "First Video",
    rating: 5,
    comments: 20,
    createdAt: "2 minutes ago",
    views: 73,
    id: 1,
},
{
    title: "Second Video",
    rating: 4,
    comments: 45,
    createdAt: "5 minutes ago",
    views: 120,
    id: 2,
},
{
    title: "Third Video",
    rating: 3.5,
    comments: 11,
    createdAt: "10 minutes ago",
    views: 39,
    id: 3,
},
];

export const trending = (req, res) => {
    res.render("home", {pageTitle: "Home", videos});
};

export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1];
    res.render("watch", {pageTitle:`Watching: ${video.title}`, video});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1];
    res.render("edit", {pageTitle:`Editing: ${video.title}`, video});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id-1].title = title;
    //form에 작성한 내용으로 title을 변경
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = (req, res) => {
    const { title } = req.body;
    //name="title"인 input(upload.pug의 text)에서 req.body(input의 내용)을 받아옴!
    const newVideo = {
        title,
        rating: 0,
        comments: 0,
        createdAt: "Just now",
        views: 0,
        id: videos.length + 1,
    };
    videos.push(newVideo);
    return res.redirect("/");
}

