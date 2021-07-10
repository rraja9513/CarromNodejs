const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tournamentSchema=new Schema(
    {
      dateandtime:{
          startdate:{type:Date},
          enddate:{type:Date}
      },
      entryfee:{
          type:String
      },
      numberofwinners:{
          type:String
      },
      winningamount:[
          {
              type:String
          }
      ],
      percentage:{
          type:String
      }
    },
    {
        timestamps:true,
    }
);
tournamentSchema.path('winningamount').validate(function (value) {
    console.log(value.length)
    if (value.length > 10 ){
      throw new Error("Winners List Size Can't Be Greater Than 10!");
    }
  });
  
const Tournament=mongoose.model('Tournament',tournamentSchema);
module.exports=Tournament;