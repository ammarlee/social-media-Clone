const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ExamsSchema = new Schema({
  questions:[
      {QuestionId:{type:Schema.Types.ObjectId,
        ref:'Questions',}}
  ]
   ,
  chapter:String

})
module.exports = mongoose.model('Exams',ExamsSchema);
