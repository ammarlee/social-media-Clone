const multer=require('multer')

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
      // cb(null,file.originalname)
      cb(null,  Date.now() +'-' +file.originalname )
    }
  })
let upload = multer({storage:fileStorage})
module.exports =upload