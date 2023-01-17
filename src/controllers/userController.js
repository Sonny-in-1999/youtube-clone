import userModel from "../models/user";
import videoModel from "../models/video";
import bycrypt from "bcrypt";
import fetch from "node-fetch";
import { application } from "express";

const HTTP_BAD_REQUEST = 400;

export const getJoin = (req, res) =>
res.render("join", {pageTitle:"Join"});

export const postJoin = async (req, res) => {
    const { body: { name, username, email, password, password2, location } } = req;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle,
            errorMessage: "Password Confirmation does not match",
        });
    }
    const exists = await userModel.exists({ $or: [{ username }, { email }] });

    if (exists) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    };

    try {
        await userModel.create({
            name,
            username,
            email,
            password,
            location
        });
        res.redirect("/login");
    } catch (error) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle: "Join",
            errorMessage: error._message
        });
    }
};

export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const {body: {username, password}} = req;
    const user = await userModel.findOne({username, socialOnly: false});
    if(!user){
        return res.status(HTTP_BAD_REQUEST).render("login", {
            pageTitle, 
            errorMessage:"An account with this username does not exists."
        });
    };
    const ok = await bycrypt.compare(password, user.password);
    if(!ok){
        return res.status(HTTP_BAD_REQUEST).render("login", 
        {
            pageTitle, 
            errorMessage:"Wrong Password."
        });

    };
    //유저를 로그인 상태로 전환!
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};


export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config ={
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    //URLSearchParams: URL의 쿼리 문자열에 대해 작업할 수 있는 유틸리티 메서드를 정의함.
    //.toString(): URL에서 사용할 수 있는 쿼리 문자열을 리턴
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, { //URL에 data 요청(fetch)
        method:"POST",
        headers: {
            Accept: "application/json"
        },
    })).json(); //data를 JSON으로 추출
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        //JSON에서 access_token을 꺼냄.
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }, //access token 값을 이용하여 URL에 github api(유저정보)를 요청(fetch)
        })
        ).json(); //fetch(유저정보를 요청)한 뒤 fetch가 돌아오면 해당 fetch(유저정보)의 JSON을 추출
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
            const emailObj = emailData.find(
                (email) => email.primary == true && email.verified == true
            );
            if(!emailObj){
                return res.redirect("/login")
            }
            let user = await userModel.findOne({email: emailObj.email});
            if(!user){
                //create an account
                user = await userModel.create({
                    avatarUrl:userData.avatar_url,
                    name:userData.name,
                    username:userData.login,
                    email:emailObj.email,
                    password:"",
                    socialOnly:true,
                    location:userData.location,
                });
            }
                req.session.loggedIn = true;
                req.session.user = user;
                return res.redirect("/");
            }else{
                return res.redirect("/login");
    };
};

export const logout = (req,res) => {
    req.session.destroy(); //session 삭제 ==> 로그인한 상태(정보/세션)를 삭제
    req.flash("info", "Good Bye");
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    res.render("edit-profile", {pageTitle: "Edit Profile"});
};

export const postEdit = async (req, res) => {
    const {
    session: {
    user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, location },
    file,
    } = req;
    // 바뀐 값이 있다면 겹치는지 알아보기 위해 빈 array 생성
    let searchParam = [];
    // 값을 수정했는지 확인
    if (sessionEmail !== email) {
        searchParam.push({ email });
    }
    if (sessionUsername !== username) {
        searchParam.push({ username });
    }
    // 변경된 값이 있다면 실행되는 if문
    if (searchParam.length > 0) {
        // 같은 username OR email을 사용하는 유저가 있는지 확인
        const foundUser = await userModel.findOne({ $or: searchParam });
        if (foundUser && foundUser._id.toString() !== _id) {
            // 겹치는 유저가 존재하는데, 그게 본인이 아님 (다른 누군가가 사용중)
            return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This username/email is already taken.",
            });
        }
    }
    // 사용중인 다른 유저가 없는 username AND email이라면, 내껄로 저장 & UPDATE
    const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
        avatarUrl: file ? file.path:avatarUrl, 
        //?(if):새로운 프로필사진을 업로드 할경우(file이 존재할 경우) avatarUrl의 값을 file.path로 변경 (:)else:avatarUrl값 유지
        //DB에 절대 파일을 저장하지 않는다! 파일의 경로를 저장할 뿐
    name,
    email,
    username,
    location,
    },
    { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
    };
export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly){ //깃허브로 로그인한 경우 변경 불가
        req.flash("error", "Can't change password");
        return res.redirect("/")
    }
    return res.render("users/change-password", {pageTitle:"Change Password"});
}

export const postChangePassword = async (req, res) => {
    const {
        session: {
        user: { _id, password},
        },
        body: { oldPassword, newPassword, newPassword1 },
        } = req;
        const ok = await bycrypt.compare(oldPassword, password);
        if(!ok){
            return res.status(HTTP_BAD_REQUEST).render("users/change-password", {
                pageTitle:"Change Password", 
                errorMessage:"The Old Password is incorrect"
            });
        }
        if(newPassword != newPassword1){
            return res.status(HTTP_BAD_REQUEST).render("users/change-password", {
                pageTitle:"Change Password", 
                errorMessage:"The Password does not match with Confirmation"
            });
        }
    const user = await userModel.findById(_id);
    user.password = newPassword;
    await user.save(); //새로운 패스워드를 해싱처리하기 위해 user.js에서 만들어둔 save 함수를 실행.
    req.session.user.password = user.password; //session에 해싱처리된 새로운 패스워드를 저장
    req.flash("info", "Password updated");
    return res.redirect("/users/logout")
}
export const see = async (req, res) => {
    const {id} = req.params;
    const user = await userModel.findById(id).populate({
        path: "videos",
        populate: {
          path: "owner",
          model: "User",
        },
      });
    if(!user){
        return res.status(404).render("404", {pageTitle:"User Not Found."});
    }
    const videos = await videoModel.find({owner:user._id});
    return res.render("users/profile", {
        pageTitle:`${user.name}'s Profile`, 
        user,
        videos,
    });
};