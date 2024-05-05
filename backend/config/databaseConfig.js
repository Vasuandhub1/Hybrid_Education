const mongoose= require("mongoose")
require("dotenv").config()

exports.dbConnect= async()=>{
    const connected= await mongoose.connect(process.env.URL,{family:4})
    if(connected){
        console.log("connected to the database")
    }
    else{
        console.log("err in database")
    }
}