const router=require('express').Router();
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
let Kyc=require('../models/kyc.model');
router.route('/').post((req, res) => {
    Kyc.find()
      .then(kyc => res.json(kyc))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.post('/add',upload.array('images',2),(req,res,next)=>{
    const adharnumber = req.body.adharnumber;
    const pannumber=req.body.pannumber;
    const adharproof = req.files[0].path;
    const panproof=req.files[1].path;
    const newKyc=new Kyc({
       adharnumber,
       pannumber,
       adharproof,
       panproof
    })
    newKyc.save()
  .then(() => res.json('Kyc added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});
 module.exports=router;