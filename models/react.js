const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ReactSchema = new Schema({
   
    like:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
    love:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
    sad:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
    laugh:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
    cry:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
    angry:{
      userId:
      { type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
      },
      count:Number
    },
})
module.exports = mongoose.model('React', ReactSchema);
