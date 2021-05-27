const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ChatSchema = new Schema({
   users:{
       userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
       friendId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
   }
})
module.exports = mongoose.model('Chat', ChatSchema);
