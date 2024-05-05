const mongoose=require("mongoose")

const playlistSchema=new mongoose.Schema({
    playlistname:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    channelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"channelModel"
    },
    isPublic:{
        type:Boolean,
        required:false
    },
    video:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"videoModel"
    },
    

})

module.exports=mongoose.model("playlistModel",playlistSchema)