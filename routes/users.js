const router=require('express').Router();
const moment = require('moment');
const passport=require('passport');
let User=require('../models/user.model');
router.route('/').post((req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/time').post((req, res) => {
   res.json(year + "-" + month + "-" + date + "-" + hours + ":" + minutes + ":" + seconds);
  });
  router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/search').post((req, res) => {
    User.find({ $text: { $search: req.body.name } })
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/signup').post((req,res)=>{
  let a=moment().format('YYYY-MM-DD:hh:mm:ss')
    const Users=new User({ name : req.body.name,email:req.body.email,gender:req.body.gender,phonenumber:req.body.phonenumber,created:a});   
        User.register(Users,req.body.password,function(err,user){
            if(err)
            {
              var redir = { returnCode: "Failure",
                            returnMsg:"User Already Registered"};
                            return res.json(redir);
                          }
            else{
                passport.authenticate("userLocal")(req,res,function(){
                    if (req.user) {
                        var redir = { returnCode: "Success",
                                      returnMsg:"User registered Successfully",
                                      uname:user.name
                                    };
                        return res.json(redir);
                  } else {
                    res.status(400).json({ message: 'SignupFailed' });
                  }
                });
            }
        })
    });
router.route('/login').post((req,res)=>{
   if(!req.body.email){
    res.json({success: false, message: "email was not given"})
  } else {
    if(!req.body.password){
      res.json({success: false, message: "Password was not given"})
    }else{
      passport.authenticate('userLocal', function (err, user, info) { 
         if(err){
           res.json({success: false, message: err})
         } else{
          if (! user) {
            var redir={
                Code:"Fa",
                Msg:"Login Failed"
            }
            return res.json(redir)
          } else{
            req.login(user, function(err){
              if(err){
                res.json({success: false, message: err})
              }
              else{
                  var redir={
                      Code:"Su",
                      Msg:"Login Success",
                      id:user._id
                  }
                  return res.json(redir)
              }
            })
          }
         }
      })(req, res);
    }
  }
 });
 router.route('/forgotpassword').post((req,res)=>{
        User.findOne({ email: req.body.email })
        .then((user) => {
            user.setPassword(req.body.password,(err, user) => {
                if (err) return next("User Not Found");
                user.save();
                res.status(200).json({ message: 'Successful Password Reset' });
            });
        })
        .catch((err)=>{
          res.json("Customer  Not  Found")
        })
});
router.route('/changepassword').post((req,res)=>{
    if(req.isAuthenticated()){
    User.findOne({ email: req.body.email })
    .then((user) => {
        user.changePassword(req.body.oldpassword, req.body.newpassword,(err, user) => {
            if (err) return next(err);
            user.save();
            res.status(200).json({ message: 'Password Change Successful' });
        });
    })
    .catch((err)=>{
      res.json("Customer  Not  Found")
    })
}
else{
    res.redirect('/login');
}
});
router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
      .then(user => {
        user.name = req.body.name;
        user.email = req.body.email;
        user.gender=req.body.gender;
        user.phonenumber =req.body.phonenumber;
        user.save()
          .then(() => res.json('User updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/delete').post(async(req,res)=>{
    const ids=req.body.arrayids;
    await User.deleteMany({_id:{$in:ids}})
    res.status(200).json({ message: 'Deleted Successfully'});
  })
 module.exports=router;