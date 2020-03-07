const mongoose = require('mongoose'),
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;
//
module.exports = new Schema(
  {
      wineId: {type:ObjectId,required:true},
      photo : { type: Buffer, required:true, contentType: String },
  },
  {timestamps:true})
