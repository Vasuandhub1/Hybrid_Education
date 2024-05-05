const userModel = require("../Model/userModel")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const channelModel=require("../Model/channelModel")
const playlistModel=require("../Model/playlist")
const videoModel = require("../Model/videoModel")
const { trusted } = require("mongoose")

// handeling the create new playlist 

exports.createPlaylist=async(req,res)=>{
//  handel the errors
try{
    // now take the data from the request body
    const {Title,Description,channelId}=req.body
    // now take the user info from the cookies
    const{JWT_token}=req.cookies
    const token=jwt.decode(JWT_token)
    // now check for the authenticate user
    const isChannel=await channelModel.findById(channelId)

    // now check for the owner of the channel
    if(isChannel.channelOwner==token.userId){
        //  now create the new playlist 
        const playlist=await playlistModel.create({playlistname:Title,description:Description,ownerId:token.userId})

        // now update the channel

        await channelModel.findByIdAndUpdate(isChannel._id,{$push:{playlist:playlist._id}},{new:true})

        return res.status(200).json({
            sucess:true,
            message:"Sucessfully created the playlist"
        })
    }
    else{
        return res.status(404).json({
            sucess:false,
            message:"cred not match"
        })
    }

}catch(err){
    return res.status(404).json({
        sucess:false,
        message:err.message
    })
}
}

// handelig the add the to the pplaylist 

exports.addVideo=async(req,res)=>{
    // handel the err in the model
    try{
        // take the playlist id , video ID , and channel Id to add the video to the play list 
            const {videoId,channelId,playlistId}=req.body

            // now take the user details through the 

            const {JWT_token}=req.cookies
            const token=jwt.decode(JWT_token)

            // now find the channel in the database

            const channel=await channelModel.findById(channelId);

            //  now verify the authenticate user
            if(channel.channelOwner==token.userId){

                //  now check the video and playlist from same channel

                await playlistModel.findByIdAndUpdate(playlistId,{$push:{video:{$each:[...videoId]}}},{new:true})

                videoId.map(async(elem)=>{
                    await videoModel.findByIdAndUpdate(elem,{$push:{playlist:elem}},{new:true})
                })

                return res.status(200).json({
                    sucess:true,
                    message:"sucessfully added videos to the playl  ist"
                })
            }else{
                return res.status(404).json({
                    sucess:false,
                    message:"the user does not match"
                })
            }

    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message 
        })
    }
}