const mongoose = require('mongoose'),
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;
//
module.exports = new Schema(
  {
      cellarId: {type:ObjectId,required:true},
      stock : Number,
      photo:String,
      favorite : Boolean,
      appelation: String,
      domain: String,
      temperature: String,
      photo : { type: Buffer,contentType: String },
      annee : {type:Number,min:1900,max:2050},
      before : {type:Number,min:1900,max:2050},
      apogee : {type:Number,min:1900,max:2050},
      carafage : String,
      typologie : String,
      country:String,
      region:String,
      color:String,
      commentaire:String,
      price:{type:Number,min:0,max:10000},
      vendor:String,
      legumes:[String],viandes:[String],poissons:[String],desserts:[String],aperitif:[String],fromages:[String],cuisine_monde:[String],
      bouche:[String],
      pastilles:[String],
      accords:[String],
      cepage:[String],
      vue:[String],
  },
  {timestamps:true})
