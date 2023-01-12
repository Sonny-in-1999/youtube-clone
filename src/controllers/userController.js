import userModel from "../models/user";

export const getJoin = (req, res) =>
res.render("join", {pageTitle:"Join"});

export const postJoin = async (req, res) => {
    console.log(req.body);
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.render("join", {
            pageTitle,
            errorMessage:"Password confirmation doesn't match."});
    };
    const exists = await userModel.exists({$or: [{username}, {email}]});
    //exists($or:~~) : 둘 중 하나라도(or) 존재하는경우
    if(exists){
        return res.render("join", {
            pageTitle,
            errorMessage:"This username/email is already taken."});
    };
    await userModel.create({
        name,
        username,
        email,
        password,
        location
    });
    return res.redirect("/login");
};
export const login = (req, res) => res.send("Login");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req,res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
