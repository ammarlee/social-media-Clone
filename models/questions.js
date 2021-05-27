const mongoose = require("mongoose")

const Schema = mongoose.Schema
const QuestionsSchema = new Schema({
    questions:[
        { 
            q:String,
            image:String,
            answers:[{ a:String,correct:Boolean}] 
        }
    ],
    chapter:String,
    time:Date,
    Duration:Number,
    fullMarks:Number,
    usersDidExams:[
        { 
            srudentId:
             { type:Schema.Types.ObjectId,
                ref:'User',
                required:true 
              },
            results:Number

        }
    ]
   
})
module.exports = mongoose.model('Questions', QuestionsSchema);
