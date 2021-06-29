const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        gender:{
            type:String,
            required: true,
        },
        phonenumber:{
            type:String,
            required: true,
        } 
    },
    {
        timestamps:true,
    }
);
userSchema.plugin(passportLocalMongoose,{usernameField: 'email'});
const User=mongoose.model('User',userSchema);
module.exports=User;