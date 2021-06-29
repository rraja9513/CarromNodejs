const router=require('express').Router();
const passport=require('passport');
let Admin=require('../models/admin.model');
router.route('/').post((req, res) => {
    Admin.find()
      .then(admin => res.json(admin))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/changepassword').post((req,res)=>{
    Admin.findOne({ email: req.body.email })
    .then((admin) => {
        admin.changePassword(req.body.oldpassword, req.body.newpassword,(err, admin) => {
            if (err) return next(err);
            admin.save();
            res.status(200).json({ message: 'password change successful' });
        });
    })
});
router.route('/signup').post((req,res)=>{
    Admin.register({email:req.body.email},req.body.password,function(err,admin){
        if(err)
        {
            console.log(err);
        }
        else{
            passport.authenticate("adminLocal")(req,res,function(){
                res.status(200).json({ message: 'Signed in successful' });
            });
        }
    })
});
router.route('/login').post((req,res)=>{
    const admin=new Admin({
        email:req.body.email,
        password:req.body.password
    });
    req.login(admin,function(err){
        if(err){
            console.log(err)
        }
        else{
            passport.authenticate("adminLocal")(req,res,function(){
                if (req.user) {
                    var redir = { redirect: "/welcome" };
                    return res.json(redir);
              } else {
                    var redir = { redirect: '/signup'};
                    return res.json(redir);
              }
            });
        }
    });
 });
 module.exports=router;