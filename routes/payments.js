const router=require('express').Router();
let Payment=require('../models/payment.model');
router.route('/').post((req, res) => {
    Payment.find()
      .then(payments => res.json(payments))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/search').post((req, res) => {
    Payment.find({paymentid : req.body.paymentid})
      .then(payments => res.json(payments))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/add').post((req,res)=>{
    const paymentid = req.body.paymentid;
    const paymentmode=req.body.paymentmode;
    const amount = req.body.amount;
    const newPayment=new Payment({
       paymentid,
       paymentmode,
       amount
    })
    newPayment.save()
  .then(() => res.json('Payment added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});
 module.exports=router;