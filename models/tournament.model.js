const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tournamentSchema=new Schema(
    {
      dateandtime:{
          startdate:{type:String},
          enddate:{type:String}
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
      ]
    },
    {
        timestamps:true,
    }
);
tournamentSchema.path('winningamount').validate(function (value) {
    console.log(value.length)
    if (value.length > 1000 ){
      throw new Error("Assigned person's size can't be greater than 1000!");
    }
  });
  
const Tournament=mongoose.model('Tournament',tournamentSchema);
module.exports=Tournament;