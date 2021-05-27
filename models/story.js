const mongoose = require("mongoose");
const Schema = mongoose.Schema
const StorySchema = new Schema({
    title:{ 
        type: String ,
    },
      img:{
        type: String,
      },
     
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
 
    },
   
})

module.exports = mongoose.model('Story',StorySchema)