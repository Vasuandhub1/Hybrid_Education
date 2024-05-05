const cloudinary= require("cloudinary").v2
require("dotenv").config()

exports.cloudConnect=()=>{
   const connected= cloudinary.config({
        cloud_name:"dzj42ebpy",
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    });
    if(connected){
        console.log("cloudinary is sucessfully connected")
    }
    else{
        console.log("err in cloud connection")
    }
}