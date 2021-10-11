const mongoose = require("mongoose")
const mongooseAlgolia = require('mongoose-algolia')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    img:{
        type:Array
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
    },
    comments:[
        {
            date:String,
            description:String,
            postId:{ type:Schema.Types.ObjectId,
                ref:'Post',},
            userId:{
                type:Schema.Types.ObjectId,
                 ref:'User',
            },
            img:Array,
            name:String
        }
    ],
    commentId:{
        type:Schema.Types.ObjectId,
        ref:'Comment',
    },
    reacts:[
        {
            userId:{
                type:Schema.Types.ObjectId,
                 ref:'User',
            },
        }

    ],
    reactId:{
        type:Schema.Types.ObjectId,
        ref:'react',
    },
  
})
const algolia_api ='51ba31f56313488518c91d7571cddcde'
const application_id = '5AX3QTWUTZ'
const application_index='facebook'

PostSchema.plugin(mongooseAlgolia, {
    appId: application_id,
    apiKey: algolia_api,
    indexName: application_index, 
    selector: 'description img userId comments', 
    populate: {
      path: 'userId',
      select:'name img email'
    },
    debug:true
})
let Model = mongoose.model('Post', PostSchema)
Model.SyncToAlgolia()
Model.SetAlgoliaSettings({
    searchableAttributes: ['description '], 
  })
module.exports =Model
