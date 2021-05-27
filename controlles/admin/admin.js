var path = require('path');
const bycript = require('bcryptjs')
const fs = require('fs')
const clody = require('../cloud')
const Post =require('../../models/post')
const User =require('../../models/user')
const io = require('../../socket')
const PDFDocument = require('pdfkit');
const {cloudinary} = require('../cloudinary');
const Socket = require('../../socket');
// Socket.getIO().emit('category',{action:'createProduct',product:products,msg:'new product has been added '})
  
  exports.posts =async(req,res,next)=>{ 
    
    try {
      const posts = await Post.find({}, null, {
        sort: {
          date: -1,
        },}).lean().populate({ 
        path: 'userId',
         model: 'User',
         select:'name _id email img '
      }).populate({ 
        path: 'reacts.userId',
        model: 'User',
        select:'name _id email img '
      })
      res.status(200).json({posts,msg:'admin fetch all posts',success:true})
    } catch (error) {
      res.status(400).json({error, success:false })
      
    }
  }
 
  exports.users=async(req,res,next)=>{
    try {
      const users = await User.find({}).lean()
      res.status(200).json({users,msg:'admin fetch all users',success:true})
    } catch (error) {
      res.status(400).json({error, success:false })
    }
    }
   exports.deleteUser=async(req,res,next)=>{
     const userId = req.params.userId
    try {
      const user = await User.findOneAndRemove({_id:userId})
      res.status(200).json({user,msg:'admin has been deleted a user',success:true})
        
    } catch (error) {
      res.status(400).json({error, success:false })
    }
    }
   
    exports.deletePost=async(req,res,next)=>{
      const postId = req.params.postId
    try {
      const post = await Post.findOneAndRemove({_id:postId})
      res.status(200).json({post,msg:'admin has been deleted a post',success:true})
     
      }
     catch (error) {
          res.status(400).json({error, success:false })
        }
        }
    exports.editPost=async(req,res,next)=>{
      const postId = req.params.postId
      const description = json.parse(req.body.description)
      // const description = req.body.description
      // console.log(req.files);
    const files = req.files
  try {
          if(files.length <=0){
              const post = await Post.findOneAndUpdate({_id:postId},{description},{new:true})
             return res.status(200).json({post,msg:'you have edited your post'})
            
              }
          const uploader = async(path)=>await clody.uploads(path)
          let urls = []
          for(let file of files){
            const {path} = file
            const newpath = await uploader(path)
            urls.push(newpath)
          }
          const images = urls.map(p=>{
            return p.url
          })
          console.log(images);
          const post = await Post.findOneAndUpdate({_id:postId},{description,img:images})
         return res.status(200).json({post,msg:'you have edited your post'})
  
      
  } catch (error) {
    console.log(error);
              res.status(400).json({error, success:false })
            }
        }
