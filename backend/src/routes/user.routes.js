import { Router } from "express";
import { 
    testing, 
    signup,
    education,
    dashboard,
    uploadpic
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWTw,verifyJWTa,firstJWTw,firstJWTa} from "../middlewares/auth.usermiddleware.js";


const router = Router()

router.route("/web/testing").post(verifyJWTw,testing)
router.route("/app/testing").post(verifyJWTa,testing)
router.route("/web/signup").post(firstJWTw,signup)
router.route("/app/signup").post(firstJWTa,signup)
router.route("/web/education").put(verifyJWTw,education) //for changing from user dashboard also
router.route("/app/education").put(verifyJWTa,education) //for changing from user dashboard also
router.route("/web/dashboard").get(verifyJWTw,dashboard)
router.route("/app/dashboard").get(verifyJWTa,dashboard)
router.route("/web/uploadpic").patch(verifyJWTw,upload.single("profile"),uploadpic)
router.route("/app/uploadpic").patch(verifyJWTa,upload.single("profile"),uploadpic)
// router.route("/:username").get( getUserProfile)
// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
//     )


// router.route("/change-password").post( changeCurrentPassword)
// router.route("/current-user").get( getCurrentUser)
// router.route("/update-account").patch(updateAccountDetails)

// router.route("/avatar").patch( upload.single("avatar"), updateUserAvatar)
// router.route("/cover-image").patch( upload.single("coverImage"), updateUserCoverImage)

// router.route("/history").get( getWatchHistory)

export default router