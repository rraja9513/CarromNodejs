const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tournamentSchema=new Schema(
    {
      time:{
          type:String
      },
      date:{
          type:String
      },
      winningamount:{
          type:String
      },
      numberofwinners:{
          type:String
      },
      percentage:{
          type:String
      }
    },
    {
        timestamps:true,
    }
);
const Tournament=mongoose.model('Tournament',tournamentSchema);
module.exports=Tournament;