const mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const Schema=mongoose.Schema;
const adminSchema=new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetPasswordToken: {type:String},
        resetPasswordExpires: {type:Date}
    },
    {
        timestamps:true,
    }
);
adminSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
  
  adminSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  var Admin = mongoose.model('Admin', adminSchema);

  
  module.exports=Admin;