const router=require('express').Router();
let Tournament=require('../models/tournament.model');
router.route('/').post((req, res) => {
    Tournament.find()
      .then(tournaments => res.json(tournaments))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  router.route('/add').post((req,res)=>{
    const dateandtime = req.body.dateandtime;
    const entryfee = req.body.entryfee;
    const numberofwinners=req.body.numberofwinners;
    const winningamount=req.body.winningamount 
    const newTournament=new Tournament({
     dateandtime,
     entryfee,
     numberofwinners,
     winningamount
    })
    newTournament.save()
  .then(() => res.json('Tournament added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:id').delete((req, res) => {
  Tournament.findByIdAndDelete(req.params.id)
    .then(() => res.json('Tournament deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
 module.exports=router;