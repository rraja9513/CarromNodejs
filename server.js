const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const session=require('express-session');
const passport=require('passport');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var logger = require('morgan');
var favicon = require('static-favicon');
var LocalStrategy = require('passport-local').Strategy;
const User =require('./models/user.model');
const Admin =require('./models/admin.model');
require('dotenv').config();
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(logger('dev'));
app.use(favicon());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


const port=process.env.PORT || 80;
const uri=process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("Atlas started successfully")
})
passport.use('userLocal',User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(function(username, password, done) {
    Admin.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Reset.findById(id, function(err, user) {
      done(err, user);
    });
  });
const userRouter=require('./routes/users');
const paymentRouter=require('./routes/payments');
const adminRouter=require('./routes/admin');
app.use('/admin',adminRouter);
app.use('/users',userRouter);
app.use('/payments',paymentRouter);
app.listen(port,function(){
    console.log("Server started Successfully");
});