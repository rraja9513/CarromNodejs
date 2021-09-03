const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const kycSchema=new Schema(
    {
      adharnumber:{
          type:String
      },
      pannumber:{
          type:String
      },
      adharproof:{
          type:String
      },
      panproof:{
          type:String
      }
    },
    {
        timestamps:true,
    }
);
const Kyc=mongoose.model('Kyc',kycSchema);
module.exports=Kyc;