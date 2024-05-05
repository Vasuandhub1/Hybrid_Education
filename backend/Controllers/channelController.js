const userModel = require("../Model/userModel")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const channelModel=require("../Model/channelModel")

//  handle to create the channel

exports.createChannel=async(req,res)=>{
    // handel the err
    try{
        // take data from the 
        const {channelname,description}=req.body

        // check for the channelname availablity
         const ispresent=await channelModel.findOne({channelname})

        // now take the data from cookie

        const {JWT_token}=req.cookies

        if(channelname&&description&&!ispresent){
            if(JWT_token){
                const token=jwt.decode(JWT_token)
                const createdChannel=await channelModel.create({channelname,description,channelOwner:token.userId})
                if(createdChannel){
                    //  now update the channel to the user schema
                    await userModel.findByIdAndUpdate(token.userId,{$push:{channel:createdChannel._id}},{new:true})
                    return res.status(200).json({
                        sucess:true,
                        message:"sucessfully created channel"
                    })
                }else{
                    return res.status(400).json({
                        sucess:false,
                        message:"err in channle creation"
                    })
                }
            }else{
                return res.status(400).json({
                    sucess:false,
                    message:"err in cookie"
                })
            }
        }else{
            return res.status(400).json({
                sucess:true,
                message:"please enter both the parameters"
            })
        }
    }catch(err){
        return res.status(400).json({
            sucess:false,
            message:err.message
        })
    }
}

//  handler for updating the channel

exports.updateChannel=async(req,res)=>{
// handel the error
try{
    // take the updating parameters of the channel

    const {channelname,description,channelId}=req.body

    // if there is channel name or description

    if(channelname){
        // now check if the name is available

        const isavailable=await channelModel.findOne({channelname})
        if(!isavailable){
            // now updath the channel
            await channelModel.findByIdAndUpdate(channelId,{channelname:channelname})
            console.log("updated")
        }else{
            return res.status(404).json({
                sucess:false,
                message:"The Chnnel Name is Not Available"
            })
        }

    }
    if(description){
        // now upadathe the description
        await channelModel.findByIdAndUpdate(channelId,{description}) 
    }

    return res.status(200).json({
        sucess:true,
        message:"parameters are sucesssfully updated"
    })


}catch(err){
    return res.status(404).json({
        sucess:false,
        message:err.message
    })

}
}

// add subscriber to the channel
exports.subscribe=async(req,res)=>{
    // handel the err
    try{
        // take the data from the body
        const {channelId}=req.body
        // now take the user data from the cookies
        const {JWT_token}=req.cookies
        console.log(JWT_token)
        const token=jwt.decode(JWT_token)
        console.log(token)

        // now check the auth user and accoout
        const isUser=await userModel.findById(token.userId);
        const isChannel=await channelModel.findById(channelId);

        if(isUser&&isChannel){
            await channelModel.findByIdAndUpdate(channelId,{$push:{subscribers:token.userId}},{new:true})
            await userModel.findByIdAndUpdate(token.userId,{$push:{Subscribed:channelId}},{new:true})
            return res.status(200).json({
                sucess:true,
                message:"sucessfully updated subscriber"
            }) 
        }else{
            return res.status(404).json({
                sucess:false,
                message:"channel or user not found "
            })        }

    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message
        })
    }
}

