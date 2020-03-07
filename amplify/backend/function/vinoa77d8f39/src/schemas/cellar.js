const mongoose = require('mongoose'),
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
  userId : ObjectId,
  name : String,
  description:String,
  stock:{type:Number,default:0,min:0}
},{timestamps:true})
