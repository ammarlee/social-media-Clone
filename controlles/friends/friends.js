const User = require('../../models/user')
exports.getFriendsList = async (userId) => {
    try {
      const user = await User.findOne({ _id: userId })
        .populate({
          path: "newFriendsTest",
          populate: {
            path: "friendId ",
            select: "name img email",
            model: "User",
          },
        })
        .exec();
  
      return user.newFriendsTest;
    } catch (error) {
      throw new Error(error);
    }
  };
  