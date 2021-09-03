const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const userprofileSchema=new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        profilephoto:{
            type: String,
            required: true,
        },
    },
    {
        timestamps:true,
    }
);
userprofileSchema.index({name:"text"});
userprofileSchema.plugin(passportLocalMongoose,{usernameField: 'name'});
const Userprofile=mongoose.model('Userprofile',userprofileSchema);
module.exports=Userprofile;