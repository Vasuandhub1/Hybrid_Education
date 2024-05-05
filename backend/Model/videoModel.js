const mongoose= require("mongoose")

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    playlist:{
        type:mongoose.Schema.Types.ObjectId,
        req:"playlistModel"
    },
    thumbnail:{
        type:String,
        required:true
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"likeModel"
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"commentModel"
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
        type:Boolean
    },
    video_public_id:{
        type:String,
        required:true
    },
    thumbnail_public_id:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model("videoModel",videoSchema)