const express= require("express")
const routes=express.Router()

const {signUp,signIn,createAvtar}=require("../Controllers/userController")
const {createChannel,updateChannel,subscribe}= require("../Controllers/channelController")
const {videoUpload,createComment,removeVideo,videoStatus}= require("../Controllers/videoControllers")
const {createPlaylist,addVideo}=require("../Controllers/playlistControl")

//  now handel the routes

routes.post("/createUser",signUp)
routes.post("/signIn",signIn)
routes.post("/createChannel",createChannel)
routes.post("/videoUpload", videoUpload)
routes.post("/updatechannel",updateChannel)
routes.post("/createComment",createComment)
routes.post("/removeVideo",removeVideo)
routes.post("/createAvatar",createAvtar)
routes.post("/subscribe",subscribe)
routes.post("/videoStatus",videoStatus)
routes.post("/createPlaylist",createPlaylist)
routes.post("/addVideo",addVideo)

module.exports=routes

