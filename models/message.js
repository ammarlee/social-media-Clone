const mongoose = require("mongoose")

const Schema = mongoose.Schema
const MessageSchema = new Schema({
  chatId:{type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",},
    content:String,
    sender:{ type: mongoose.Schema.Types.ObjectId,
        ref: "User",},
    timeStamp:String
})
module.exports = mongoose.model('Message', MessageSchema);
