const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const paymentSchema=new Schema(
    {
      paymentid:{
          type:String,
      },
      paymentmode:{
          type:String,
      },
      amount:{
          type:String,
      }
    },
    {
        timestamps:true,
    }
);
const Payment=mongoose.model('Payment',paymentSchema);
module.exports=Payment;