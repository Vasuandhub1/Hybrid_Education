const express= require("express")
const app=express()
require("dotenv").config()
const databaseConfig=require("./config/databaseConfig")
const cloudConfig=require("./config/cloudinaryConfig")
const routes=require("./Routes/userRoutes")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

// database

databaseConfig.dbConnect()

// fileupluad

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

//  cloud connection
cloudConfig.cloudConnect()

// coookieparser

app.use(cookieParser())

// bodyparser

app.use(express.json())

// routes

app.use("/api/v1",routes)




app.listen(process.env.PORT,()=>{
    console.log(`connected to the server at port ${process.env.PORT}`)
})