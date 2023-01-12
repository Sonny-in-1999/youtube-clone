import userModel from "../models/user";

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
    const exists = await userModel.exists({username, password});
    if(!exists){
        return res.status(400).render("login", 
        {
            pageTitle:"Login", 
            errorMessage:"An account with this username does not exists."
        });

    };
    //check if account exists
    //check if password correct
    res.end();
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req,res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
