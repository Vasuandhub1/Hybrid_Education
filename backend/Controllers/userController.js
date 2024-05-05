const userModel = require("../Model/userModel")
const UserModel=require("../Model/userModel")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const channelModel=require("../Model/channelModel")
const videoModel = require("../Model/videoModel")
const cloudinary= require("cloudinary").v2


// controller to handle the signUp

exports.signUp=async(req,res)=>{
    // handel the err
    try{
        const {username,email,Fullname,password}=req.body

        // now check if the email is already rejistered

        const isPresent=await UserModel.findOne({email})

        if(isPresent){
           return  res.status(404).json({
                sucess:false,
                message:"Eamil id already Exist"
            })
        }
        else{
            // now secure the password 

            bcrypt.hash(password,10)
            .then(async(hashedPassword)=>{
                const  createdUser= await UserModel.create({username,Fullname,email,password:hashedPassword})
                if(createdUser){
                    return res.status(200).json({
                        sucess:true,
                        message:"sucessfully created the account"
                    })
                }
            })
            .catch((err)=>{
                return res.status(421).json({
                    sucess:false,
                    message:"err in  hashing password"
                })
            })
            
        }

    }catch(err){
        return res.status(406).json({
            sucess:false,
            message:err.message
        })
    }
}

// controller to handle the 

exports.signIn=async(req,res)=>{

// handle the err 

try{

    // take the details from the req body

    const {email,password}=req.body

    //  check for email

    const isPresent=await userModel.findOne({email})

    if(isPresent){
       const istrue=await bcrypt.compare(password,isPresent.password)
       if(istrue){
        const payload={
            userId:isPresent._id,
           email:isPresent.email,
           username: isPresent.username,
            Fullname:isPresent.Fullname
        }
        const token=jwt.sign(payload,process.env.KEY,{expiresIn:"2h"})

        return res.cookie("JWT_token",token,{expiresIn:"2h"}).status(200).json({
            sucess:true,
            message:"sucessfully loged in to the account"
        })
       }else{
        return res.status(400).json({
            sucess:false,
            message:"Password does't match"
        })
       }
    }
    else{
        return res.status(406).json({
            sucess:false,
            message:"Plz create the account"
        })
    }

}catch(err){
    return res.status(400).json({
        sucess:false,
        message:err.message
    })
}
}

// update the user to 

exports.updateUser_credential=async(req,res)=>{
    // handel the error
    try{
        // now take the user parameters
        const {username,fullname,phone}=req.body

        const {JWT_token}=req.cookies
        const token=jwt.decode(JWT_token)

        // now check the parameter to update 
   
        if(username){
            await userModel.findByIdAndUpdate(token.userId,{username})
        }
        if(fullname){
            await userModel.findByIdAndUpdate(token.userId,{fullname})
        }
        if(phone){
            await userModel.findByIdAndUpdate(token.userId,{username})
        }
        return res.status(200).json({
            sucess:true,
            message:"credentials sucess fully updated"
        })

}catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message
        })
    }
}
// upload avatar

const isUpload=async(folder,avatar)=>{
    const option={
        folder
    }
    const ret=await cloudinary.uploader.upload(avatar.tempFilePath,option)
    return ret
}

// controller to upload the avtar 
exports.createAvtar=async(req,res)=>{
    // handel the err
    try{
        // take the avatar from the file 

        const {avtar}=req.files

        // now take the token from the cookies
        const {JWT_token}=req.cookies
        const token=jwt.decode(JWT_token)
        //  now find the user in the database
        const isUser=await UserModel.findById(token.userId)
        // 
        const suppoted=["jpg","png","jpeg"]

        const file_type=avtar.name.split(".")[1].toLowerCase()

        if(isUser){
            const folder="Avatar"
            if(suppoted.includes(file_type)){
                const upload= await isUpload(folder,avtar)

                if(upload){
                    await userModel.findByIdAndUpdate(isUser._id,{avtar:upload.url,avtar_id:upload.public_id})
                    return res.status(200).json({
                        sucess:true,
                        message:"sucess fully uploded avatar"
                    })
                }
            }
            else{
                return res.status(404).json({
                    sucess:false,
                    message:"file does not supported"
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

// create watchlater controller

exports.createWatchLater=async(req,res)=>{
    // now handle the err 

    try{

        //  now take userId,videoId,
        const {videoId}=req.header
        // now take the 
        const {JWT_token}=req.cookies
        const token=jwt.decode(JWT_token)

        // now check if there is video 
        if(videoId){
        if(await videoModel.findById(videoId)){
            // now update the watch list
            await userModel.findByIdAndUpdate(token.userId,{watchLater:videoId},{new:true});
        }
        else{
            return res.staus(404).json({
                sucess:false,
                message:"did not found the video"
            })
        }
        }
        else{
            return res.status(404).json({
                sucess:false,
                message:"did not get the video in the"
            })
        }



    }catch(err){
        return res.status(404).json({
            sucess:false,
            message:err.message 
        })
    }
}









