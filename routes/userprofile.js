const router=require('express').Router();
const passport=require('passport');
const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);  
  }
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
// const upload=multer({dest:'uploads/'});
let Userprofile=require('../models/userprofile.model');
router.route('/').post((req, res) => {
    Userprofile.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.post('/signup',upload.single('profilephoto'),(req,res,next)=>{
    const Users=new Userprofile({ name : req.body.name,profilephoto:req.file.path});   
        Userprofile.register(Users,req.body.password,function(err,user){
            if(err)
            {
              var redir = { returnCode: "Failure",
                            returnMsg:"User Already Registered"};
                            return res.json(redir);
                          }
            else{
                passport.authenticate("userprofileLocal")(req,res,function(){
                    if (req.user) {
                        var redir = { returnCode: "Success",
                                      returnMsg:"User registered Successfully"
                                    };
                        return res.json(redir);
                  } else {
                    res.status(400).json({ message: 'SignupFailed' });
                  }
                });
            }
        })
    });

 module.exports=router;