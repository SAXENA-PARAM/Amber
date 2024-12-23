import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {ApiError} from './utils/ApiError.js'
import expressStatusMonitor from 'express-status-monitor';

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


app.use((err, req, res, next) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: err.data,
      success: err.success,
      errors: err.errors.length ? err.errors : [err.message],
      message: err.message,
    });
  } else {
    // Fallback for unexpected errors
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