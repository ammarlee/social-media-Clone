const mongoose = require("mongoose")

const Schema = mongoose.Schema
const LecturesSchema = new Schema({
 chapter:String,
 text:String,
 contnent:{
     img:String,
     text:String,
     vedio:String
 },
 duration:Number,
 StudentAttendance:[
     {
         studentId:{ type:Schema.Types.ObjectId, ref:'Students'},
         serialId:{ type:Schema.Types.ObjectId, ref:'Serials'},
         date:String,
    }
 ],

})
module.exports = mongoose.model('Lectures',LecturesSchema);
