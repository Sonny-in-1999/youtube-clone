import userModel from "../models/user";
import bycrypt from "bcrypt";
import fetch from "node-fetch";
import { application } from "express";


export const getJoin = (req, res) =>
res.render("join", {pageTitle:"Join"});

export const postJoin = async (req, res) => {
    console.log(req.body);
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage:"Password confirmation doesn't match."});
    };

    const exists = await userModel.exists({$or: [{username}, {email}]});
    //exists($or:~~) : 둘 중 하나라도(or) 존재하는경우
    if(exists){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage:"This username/email is already taken."});
    };
    try{
        //create an account
        await userModel.create({
            name,
            username,
            email,
            password,
            location
        });
        return res.redirect("/login");
    } catch(error){
        return res.status(400).render("join", {
            //.status(400): 브라우저에게 상태코드 400를 인식 Bad Request(잘못된 요청)!
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
    
};

export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await userModel.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login", 
        {
            pageTitle, 
            errorMessage:"An account with this username does not exists."
        });

    };
    //check if account exists
    //check if password correct
    const ok = await bycrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", 
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
        console.log(userData);
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
    return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const see = (req, res) => res.send("See User");