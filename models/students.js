const mongoose = require("mongoose")

const Schema = mongoose.Schema
const StudentsSchema = new Schema({
 name:String,
 age:Number,
 lectures:[
     {lectureId: {type:Schema.Types.ObjectId, ref:'Lectures'},
      date:String,
      serialId:{ type:Schema.Types.ObjectId, ref:'Serials'}

    }
 ],
 lastThreLectures:[
     {lectureId:
        {type:Schema.Types.ObjectId, ref:'Lectures'},
        date:String,

    }]
})
module.exports = mongoose.model('Students',StudentsSchema);
