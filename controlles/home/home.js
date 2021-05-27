const Post =require('../../models/post')
const Comment =require('../../models/comment')
const algoliasearch = require("algoliasearch");
const client = algoliasearch("SRG9R6FP41", "a10e35ddd54011feeb240cf013c0f9b0");
const index = client.initIndex("amazontest");
const {cloudinary} = require('../cloudinary')

// const respo= await cloudinary.uploader.upload(thePic,{
//   upload_preset:'byr4al94'})
 

  exports.searching=(req,res,next)=>{
    index.search(req.body.name).then((result)=>{
       return res.status(200).json( result.hits)
     })
     .catch((error)=>{
       return  res.status(401).json(error)
     })
  
 }
 exports.homePage=async(req,res,next)=>{
   try {
     const posts = await Post.find({}).lean().populate('commentId').exec()
    //  const comments = await Post.find({}).populate('commentId').exec()
     res.status(200).json({msg:"fetch all data",success:true,posts})
     
   } catch (error) {
     res.status(400).json({success:false,error})
     
   }

}

 
