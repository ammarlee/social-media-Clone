
const User = require("../../models/user");
const clody =require('../cloud')

exports.uploadImg= async (files,userId) => {
    const uploader = async(path)=>await clody.uploads(path)
    const path =files[0].path
    const newpath = await uploader(path)
  const newImg = newpath.url
  const pic = await User.findOne(
      { _id: userId });
  pic.pics.push(newImg);
  await pic.save();
  return newImg
}