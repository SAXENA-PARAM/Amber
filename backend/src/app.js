import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {ApiError} from './utils/ApiError.js'
import expressStatusMonitor from 'express-status-monitor';
import { GetUrl } from "./controllers/instructor.controller.js";



const app = express()

app.use(expressStatusMonitor())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import courseRouter from './routes/course.routes.js'
import insRouter  from './routes/instructor.routes.js'

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/instructor",insRouter)



app.post("/getSignedUrl"  , async(req,res)=>{
  try{
    const {filetype , fileName}  = req.body ; 
    const url = await GetUrl(filetype , fileName)
    res.status(200).json({success  : true  , url : url})
  }catch(e){
    res.status(500).json({success  : false})
  }

})


app.post("/TranscodeVideo"  , async(req,res)=>{
  try {
    const {fileurl ,filename  , videoname } = req.body ; 
    console.log(fileurl)
    console.log(filename)      
    res.status(200).json({success : true})
    
  } catch (error) {
    res.status(500).json({success  : false})
  }
})


app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: err.data,
      success: err.success,
      errors: err.errors.length ? err.errors : [err.message],
      message: err.message,
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      data: null,
      success: false,
      errors: ["Internal Server Error",err],
      message: "Something went wrong",
    });
  }
});

export{app}