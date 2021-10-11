const Message = require('../../models/message')
const User = require('../../models/user')

exports.createNewMessage = async (data) => {
    const { chatId, content } = data;
    const { img, name, _id } = data.sender;
    const timeStamp = new Date()
    try {
      const msg = await new Message({
        chatId,
        content,
        sender: _id,
        timeStamp,
      });
      let user = await User.findOne({ _id: data.friendId });
      let me = await User.findOne({ _id:_id });
      // save the
      let msgIndex = user.messageNotifications.findIndex((i) => {
        return i.chatId.toString() == chatId.toString();
      });

      let msgIndexForMe = me.messageNotifications.findIndex((i) => {
        return i.chatId.toString() == chatId.toString();
      });

      let newMessage = {
        chatId,
        content,
        senderImg: img,
        senderName: name,
        senderId: _id,
        date: Date.now(),
      };
      if (msgIndex >= 0) {
        user.messageNotifications[msgIndex] = newMessage;
      } else {
        user.messageNotifications.push(newMessage);
      }

      if (msgIndexForMe >= 0) {
        me.messageNotifications[msgIndexForMe] = newMessage;
      } else {
        me.messageNotifications.push(newMessage);
      }
  
      await msg.save();
      await user.save();
      await me.save();
      return { msg, user };
    } catch (error) {
      console.log(error);
    }
  };
