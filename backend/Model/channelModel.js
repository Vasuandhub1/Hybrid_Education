const mongoose= require("mongoose")

const channelSchema=new mongoose.Schema({
    channelname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    subscribers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"userModel"
    },
    channelOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    playlist:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"PlaylistModel"
    },
    // posts:{
    //     type:[mongoose.Schema.Types.ObjectId],
    //     ref:"PostModel"
    // },
    video:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"videoModel"
    },
},{timestamps:true})

module.exports=mongoose.model("channelModel",channelSchema)