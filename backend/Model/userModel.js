const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({

    username:{type:String,
              required:true},
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    avtar:{
        type:String
    },
    avtar_id:{
        type:String
    },
    Fullname:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    channel:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"ChannelModel"
    },
    commnets:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"CommentsModel"
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"LikesModel"
    },
    watchLater:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"videoModel"
    },
    Subscribed:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"channelModel"
    }
})

module.exports=mongoose.model("userModel",userSchema)