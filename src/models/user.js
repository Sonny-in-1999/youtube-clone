import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({ //user(model)의 형식(schema)지정
    //use validation => 데이터의 형식을 사전에 지정(문서화!)
    email: {type:String, required:true, unique:true},
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    name: {type:String, required:true},
    location: String
});

//user password 해싱처리하여 암호화
userSchema.pre('save', async function(){ //Middelware; pre hook user password
    //입력된 유저의 password를 해싱처리하여 save하는 middleware!
    this.password = await bcrypt.hash(this.password, 5);
    //saltRounds = 5 => 비밀번호 해싱을 총 5회 진행!
})
const userModel = mongoose.model("User", userSchema);

export default userModel;