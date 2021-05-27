const express = require('express')
const router = express.Router()
const User =require('../models/user')
var jwt = require('jsonwebtoken')
const Multer=require('../controlles/multer')
const postController = require('../controlles/post/post')

const protect= async(req,res,next)=>{
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1]
  }
  if(!token){
    return res.status(401).json({error:'you are not authanticated'})
  }
  const decoded = await promisify(jwt.verify)(token,'shhhhh')
  // find if user still exist or not 
  const freshUser = await User.findOne({_id:decoded.id})
  if (!freshUser) {
    return res.status(401).json({
      error:'user not exist yet'
    })
    
  }
  req.userId=decoded.userId
  next()

}


router.post('/create-post',Multer.array('files', 10),postController.creatPost)
router.post('/edit-post',Multer.array('files', 10),postController.editPost)
router.post('/searching-post',postController.searchingInPosts)
router.post('/delete-post',postController.deletePost)
router.post('/create-comment',postController.createComment)
router.post('/add-like',postController.addLike)
router.post('/remove-like',postController.removeLike)
router.get('/comments',postController.getComments)
router.post('/edit-comment/:commentId',postController.editComment)
router.post('/delete-comment/:commentId',postController.deleteComment)
router.post('/save-post',postController.savePost)
router.get('/saved-posts/:userId',postController.getSavedposts)
router.post('/zremoveSaved',postController.removePostFromFavourite)
module.exports = router