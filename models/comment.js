const mongoose = require("mongoose")
const Schema = mongoose.Schema
const CommentSchema = new Schema({
   
    description:{
        type:String,
        required:true

    },
    date:{
        type:String,
        default:Date.now()
        
    },  
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        required:true 
    },
   
  
})
module.exports = mongoose.model('Comment', CommentSchema);
