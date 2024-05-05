const channelModel = require("../Model/channelModel")
const videoModel = require("../Model/videoModel")
const cloudinary= require("cloudinary").v2
const jwt=require("jsonwebtoken")
const commentModel = require("../Model/commentModel")
const userModel = require("../Model/userModel")

// upload function
const upload=async(video,folder)=>{
    const option={folder,
    resource_type: "video",
    public_id: "video_upload_example"}
    return await cloudinary.uploader.upload(video.tempFilePath,option)
}

// thumbnail uplod function
const thubmnailUplod=async(image,folder)=>{
    const option={folder}
    return await cloudinary.uploader.upload(image.tempFilePath,option)
}

exports.videoUpload=async(req,res)=>{
    // handle the errors
    try{

        const {video,thumbnail}=req.files
        
        const {channelId,title,description,isPublic}=req.body

        const {JWT_token}=req.cookies

        // check for the required fields
        
        if(!video){
            return res.status(404).json({
                sucess:false,
                message:"plz provide video"
            })
        }
        if(!thumbnail){
            return res.status(404).json({
                sucess:false,
                message:"plz provide thumbnail"
            })
        }
        if(!channelId){
            return res.status(404).json({
                sucess:false,
                message:"plz create channel"
            })
        }
        if(!title){
            return res.status(404).json({
                sucess:false,
                message:"plz provide Title for the video"
            })
        }
        if(!description){
            return res.status(404).json({
                sucess:false,
                message:"plz provide vthe description foe the video"
            })
        }

        // now find the owner id from cookie

        token=jwt.decode(JWT_token)

        ownerId=token.userId

        // check for the channel availablity

        const isavailable=await channelModel.findOne({_id:channelId})
        

        


        const supported=[
            "mp4","avi","mov","wmv","mkv","flv","mpeg","3gp"
        ]
        const imageSupported=[
            "jpg","jpeg","png",
        ]
        const filetype=video.name.split(".")[1].toLowerCase()
        const imagetype=thumbnail.name.split(".")[1].toLowerCase()


        if(!supported.includes(filetype) && !imageSupported.includes(imagetype)){
            return res.status(404).json({
                sucess:false,
                message:"err in video file type"
            })
        }else{
            const folder="Hybrid_Education"
            const folder2="Thubmnails"
            
            // uploading the video to the cloudinary

           if(isavailable){
            const video_URL=await upload(video,folder)
            const thumbnail_URL=await thubmnailUplod(thumbnail,folder2)

            // create the database 

            const videoUploaded=await videoModel.create({title,description,isPublic,ownerId,video:video_URL.url,thumbnail:thumbnail_URL.url,channelId,
            thumbnail_public_id:thumbnail_URL.public_id,video_public_id:video_URL.public_id})

            

            if(videoUploaded){

             // now updated the video on the channle and the user 

            await channelModel.findByIdAndUpdate(isavailable._id,{$push:{video:videoUploaded._id}},{new:true})

            return res.status(200).json({
                sucess:true,
                message:video_URL
            })
            }
            else{
                return res.status(404).json({
                    sucess:false,
                    message:"video not uploded"
                }) 
            }

           }else{
            return res.status(400).json({
                sucess:false,
                message:"not found the supported channel"
            })
           }


        }

    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message
        })
    }
}

// handler to  comments on videos 

exports.createComment=async(req,res)=>{
// handel the comment
try{
    // now take the data from the req.body

    const {comment,videoId}=req.body

    // now take the data from the req.cookies

    const {JWT_token}=req.cookies

    if(comment){
       let  commentFinal=comment.trim()

        //now update the comment

        const token=jwt.decode(JWT_token)

        const userId=token.userId

        const createcomment=await commentModel.create({comment:commentFinal,user:userId,video:videoId})

        // now update the comment to user and video
        await userModel.findByIdAndUpdate(userId,{$push:{commnets:createcomment._id}},{new:true})

        // now update the comment 

        await videoModel.findByIdAndUpdate(videoId,{$push:{comments:createcomment._id}},{new:true})

        return res.status(200).json({
            sucess:true,
            message:"Sucessfully created comment"
        })
    }


}catch(err){
    return res.status(404).json({
        sucess:false,
        message:err.message
    })
}
}
// function to remove the video

const remove=async(video_id,thumbnail_id)=>{
    const options={
        resource_type:"video"
    }
    const removed_video=await cloudinary.uploader.destroy(video_id,options)
    const remove_thumbnail=await cloudinary.uploader.destroy(thumbnail_id)
    if(remove_thumbnail&& removed_video){
        return true
    }
    else{
        return false
    }
}

// controller for deleting the video from the channel

exports.removeVideo=async(req,res)=>{
    // handel the err in  the  controller
    try{
        // now take the required parameters from the body
        const {videoId,channelId}=req.body
        //  from cookies
        const {JWT_token}=req.cookies

        // now take the token from the cookie

        const token=jwt.decode(JWT_token)

        // now search for the video in the 
        const isvideo=await videoModel.findById(videoId)
        
        if(isvideo){
            // now check if the user and channel is authenticate
            
            if(isvideo.channelId==channelId && isvideo.ownerId==token.userId){

                // now we can delete the video from the channel
               
                const removeContent=await remove(isvideo.video_public_id,isvideo.thumbnail_public_id);


                if(removeContent){
                    await channelModel.findByIdAndUpdate(channelId,{$pull:{video:videoId}},{new :true})
                    await commentModel.findOneAndDelete({video:videoId})
                    await videoModel.findByIdAndDelete(videoId)
                    return res.status(200).json({
                        sucess:true,
                        message:"sucess fully deleted the video"
                    })
                }
                else{
                    return res.status(404).json({
                        sucess:false,
                        message:"unable to delete the video"
                    })
                }
            }
            else{
                return res.status(404).json({
                    sucess:false,
                    message:"your credential does not match to remove the content",
                })
            }
        }
    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message
        })
    }
}

// video handler to make it public or private  

exports.videoStatus=async(req,res)=>{
    // now handle the err using the 
    try{
        // now take the data from the req header
        const {JWT_token}=req.cookies
        // decode the token
        const token=jwt.decode(JWT_token);
        // now take the  video id from the 
        const {isPublic,videoId}=req.body

        // now check if user id is present in the video schema
        const isUser= await videoModel.findById(videoId);

        if(isUser.ownerId==token.userId){
                await videoModel.findByIdAndUpdate(videoId,{isPublic})

                return res.status(200).json({
                    sucess:true,
                    message:"sucessfully updated video status"
                })
            
        }
        else{
            return res.status(404).json({
                sucess:false,
                message:"credentia does not match"
            })
        }

    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message
        })
    }
}

// handler for the watchlist 
exports.createWatchlist=async(req,res)=>{
    // handle the err using the err
    try{

    }catch(err){
        return res.status(200).json({
            sucess:false,
            message:errmessage
        })
    }
}