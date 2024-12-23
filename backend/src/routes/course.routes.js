import { Router } from "express";
import { verifyJWTa,verifyJWTw,firstJWTw,firstJWTa } from "../middlewares/auth.usermiddleware.js";
import {getCourse} from '../controllers/course.controller.js'
const router = Router()

router.route("/:title").post(verifyJWTw,getCourse)

export default router