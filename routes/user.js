const express = require("express")
const router = express.Router()
const UserControlles = require('../controlles/user/user')
const Multer=require('../controlles/multer')

router.post('/profile/:friendId',UserControlles.profile)
router.get('/getSpecificUser/:userId',UserControlles.getSpecificUser)
router.get('/getuserToken/:userToken',UserControlles.getUserWithToken)
router.get('/current-user/:id',UserControlles.currentUser)
router.post('/edit-profile/:userId',Multer.array('files', 10),UserControlles.EditProfile)
router.post('/edit-cover/:userId',Multer.array('files', 10),UserControlles.EditCover)
// send a new friend request
router.post('/add-friend-request/',UserControlles.addFriendRequest)
router.post('/accept-new-friend/',UserControlles.acceptNewFriend)
router.post('/others-msg/',UserControlles.othersMsg)

router.get('/friends/:userId',UserControlles.getFriends)
router.get('/friends-test-chat/:userId',UserControlles.testChat)
router.get('/get-message/:id',UserControlles.getMessage)
router.get('/friendsRequests/:userId',UserControlles.friendsRequests)
router.post('/delete-friend/:friendId',UserControlles.deletFriend)
router.post('/reject-new-friend/',UserControlles.rejectNewFriend)
router.post('/friends-request-notification/',UserControlles.friendRequestnotifications)
router.post('/push-all-notifications/',UserControlles.pushAllNotifications)


module.exports = router