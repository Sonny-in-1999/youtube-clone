export const trending = (req, res) => {
    const videos = [{
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
        id: 1,
    },
    {
        title: "Third Video",
        rating: 3.5,
        comments: 11,
        createdAt: "10 minutes ago",
        views: 39,
        id: 1,
    },
];
    res.render("home", {pageTitle: "Home", videos});
};

export const search = (req, res) => res.send("Search Video");
export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    return res.send(`Delete Video #${req.params.id}`);
}
