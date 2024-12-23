import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import zod from "zod"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import {amber} from "../db/index.js";

const getCourse=asyncHandler(async(req,res)=>{
    const user=req.user;
    return res.status(201).json(
        new ApiResponse(200,user, "User Registered Successfully")
    )
})

export{
    getCourse
}