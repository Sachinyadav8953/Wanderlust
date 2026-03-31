const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    //useranme and password creates  itself by mongoose and also hash the password and salt it and store in database
    /*userName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        unique:true
    }*/
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;