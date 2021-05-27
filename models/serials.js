const mongoose = require("mongoose")

const Schema = mongoose.Schema
const SerialsSchema = new Schema({
 serialNumber:String,
 CardId:String,
 valid:Boolean,
 lectureDetails:[{
     date:String,
     StudentId:{ type:Schema.Types.ObjectId, ref:'Students'},
     lectureId:{ type:Schema.Types.ObjectId, ref:'Lectures'}
 }]
 
})
module.exports = mongoose.model('Serials',SerialsSchema);
