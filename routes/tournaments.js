const router=require('express').Router();
let Tournament=require('../models/tournament.model');
router.route('/').post((req, res) => {
    Tournament.find()
      .then(tournaments => res.json(tournaments))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/add').post((req,res)=>{
    const time = req.body.time;
    const date=req.body.date;
    const winningamount = req.body.winningamount;
    const numberofwinners=req.body.numberofwinners;
    const percentage=req.body.percentage
    const newTournament=new Tournament({
      time,
      date,
      winningamount,
      numberofwinners,
      percentage
    })
    newTournament.save()
  .then(() => res.json('Tournament added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});
 module.exports=router;