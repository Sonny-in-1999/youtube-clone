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
}
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1];
    res.render("edit", {pageTitle:`Editing: ${video.title}`, video});
}
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id-1].title = title;
    //form에 작성한 내용으로 title을 변경
    return res.redirect(`/videos/${id}`);
}

