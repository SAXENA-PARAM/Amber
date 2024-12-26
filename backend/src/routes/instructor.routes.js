import { Router } from "express";
import { 
    testing, 
    signup,
    qualification,
    achievement,
    createCourse,
    updateCourse,
    dashboard,
    uploadpic,
    getpic,
    getuser,
    allcourses,
    getcoursebasics,
    savecoursebasics,
    getgoals,
    savegoals,
} from "../controllers/instructor.controller.js";
import {upload}from "../middlewares/multer.middleware.js";
import { verifyJWTw,verifyJWTa,firstJWTw,firstJWTa} from "../middlewares/auth.insmiddleware.js";




const router = Router()
router.route("/user").get(verifyJWTw,getuser)
router.route("/web/testing").post(verifyJWTw,testing)
router.route("/app/testing").post(verifyJWTa,testing)
router.route("/web/signup").post(firstJWTw,signup)
router.route("/app/signup").post(firstJWTa,signup)
router.route("/web/qualification").patch(verifyJWTw,qualification)
router.route("/app/qualification").patch(verifyJWTa,qualification)
router.route("/web/achievement").patch(verifyJWTw,achievement)
router.route("/app/qualification").patch(verifyJWTa,achievement)
router.route("/web/dashboard").get(verifyJWTw,dashboard)
router.route("/app/dashboard").get(verifyJWTa,dashboard)
router.route("/web/pic").get(verifyJWTw,getpic)
router.route("/web/pic/save").patch(verifyJWTw,upload.single("profilePicture"),uploadpic)
router.route("/app/pic/save").patch(verifyJWTa,upload.single("profilePicture"),uploadpic)
router.route("/web/courses").get(verifyJWTw,allcourses)
router.route("/app/courses").get(verifyJWTa,allcourses)
router.route("/web/courses/:courseId/manage/basics").get(verifyJWTw,getcoursebasics)
router.route("/app/courses/:courseId/manage/basics").get(verifyJWTa,getcoursebasics)
router.route("/web/courses/:courseId/manage/basics/save").patch(verifyJWTw,upload.fields([
  {name: 'image', maxCount:1},
  {name: 'introvideo' , maxCount:1}
]),savecoursebasics)
router.route("/app/courses/:courseId/manage/basics/save").patch(verifyJWTa,upload.fields([
  {name: 'image', maxCount:1},
  {name: 'introvideo' , maxCount:1}
]),savecoursebasics)
router.route("/web/courses/:courseId/manage/goals").get(verifyJWTw,getgoals)
router.route("/web/courses/:courseId/manage/goals/save").post(verifyJWTw,savegoals)
router.route("/web/course/create").post(verifyJWTw,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),createCourse) //add upload middleware
router.route("/app/course/create").post(verifyJWTa,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),createCourse)
router.route("/web/updateCourse/:courseId").put(verifyJWTw,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),updateCourse)  
router.route("/app/updateCourse/:courseId").put(verifyJWTa,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),updateCourse)   
export default router