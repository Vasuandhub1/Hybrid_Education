const mongoose=require("mongoose")

const commentsSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"postModel"
    }
})

module.exports= mongoose.model("commentModel",commentsSchema)