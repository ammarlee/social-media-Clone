const User = require("../models/user");
const Posts = require("../models/post");
module.exports = {

  fetchPosts: async function () {
    const allPosts = await Posts.find({}).lean();
    console.log(allposts);
    return {
      posts: allPosts.map((i) => {
        return {
          _id: i._id.toString(),
        };
      }),
    };
  },
  
  singlUser:async function({id},req){
    const user = await User.findOne({_id:id}).populate('userId')
    console.log(user);
    return {
      ...user,
      _id:user._id.toString(),
      
    }
  }
 ,
  singlPost:async function({id},req){
    const post = await Posts.findOne({_id:id}).populate('userId')
    console.log(post);
    return {
      ...post,
      _id:post._id.toString(),
      user:post.userId,
    }
  }
};
