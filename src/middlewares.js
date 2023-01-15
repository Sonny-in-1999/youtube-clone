import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Metube";
    res.locals.loggedInUser = req.session.user || {};
    console.log(req.session.user);
    //session의 유저정보를 백엔드로 저장 ==> 전역함수가 되어 퍼그에서도 유저정보를 사용가능
    console.log(res.locals);
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/");
    }
};

export const avatarUpload = multer({dest:"upload/avatars", limits:{
    fileSize:5000000,
}});
export const videoUpload = multer({dest:"upload/videos", limits:{
    fileSize:50000000,
}});

export const notFoundMiddleware = (req, res, next) => {
    res.status(404).render("404", {pageTitle: "Page not found"});
};