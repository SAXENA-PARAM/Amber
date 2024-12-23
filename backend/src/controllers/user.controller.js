import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import zod from "zod"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import {amber} from "../db/index.js";
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import {uploadBanner,uploadContentVideo,uploadPromoVideo,uploadThumbnail,uploadProfile, deleteProfile} from "../utils/cloudinary.js"



const testing=asyncHandler(async(req,res)=>{
    const user=req.user;
    return res.status(201).json(
        new ApiResponse(200,user, "User Registered Successfully")
    )
})//done

const signup = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken, isExistingUser } = req;
  
    if (!user) {
      return new ApiError(400, "User creation failed");
    }
  
    try {
      // Only set cookies for manual signup (where tokens are generated)
      if (accessToken && refreshToken) {
        const options = {
          httpOnly: true,
          secure: true,
        sameSite: 'none'
        };
  
        return res
          .status(isExistingUser ? 200 : 201)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(
            isExistingUser ? 200 : 201,
            user,
            {accessToken:accessToken,refreshToken:refreshToken},
            isExistingUser ? "User logged in successfully" : "User created successfully"
          ));
      }
  
      // For Google OAuth (no tokens needed as auth is handled by Google)
      return res
        .status(isExistingUser ? 200 : 201)
        .json(new ApiResponse(
          isExistingUser ? 200 : 201,
          user,
          isExistingUser ? "User logged in successfully" : "User created successfully"
        ));
    } catch (error) {
      console.error("Signup response error:", error);
      return new ApiError(500, "An unexpected error occurred during signup");
    }
  });
  //done
  
const education= asyncHandler(async(req,res)=>{
    const  user  = req.user;
    console.log("hi")
    const {educationLevel,schoolingYear,schoolStream,degree,studyYear,specialization}=req.body
    if (!user) {
      throw new ApiError(400, "User Verification failed");
    }
    console.log("hi")
        try {
            let updatedUser;
            if(educationLevel=="SCHOOL"){
                if(schoolStream&&schoolingYear){
                    updatedUser = await amber.user.update({
                        where: {
                          id: user.id
                        },
                        data: {
                          educationLevel,
                          schoolingYear,
                          schoolStream,
                          // Reset other education fields to null
                          degree: null,
                          studyYear: null,
                          specialization: null
                        }
                      });
                      console.log(updatedUser)
                }
                else{
                    throw new ApiError(401,"Select All fields")
                }
            }
            else if(educationLevel=="UNDERGRADUATE"){
                if (!degree || !studyYear) {
                    throw new ApiError(400, "Both degree and study year are required for undergraduate");
                  }
            
                  updatedUser = await amber.user.update({
                    where: {
                      id: user.id
                    },
                    data: {
                      educationLevel,
                      degree,
                      studyYear,
                      // Reset other education fields to null
                      schoolingYear: null,
                      schoolStream: null,
                      specialization: null
                    }
                  });
            

            }
            else if(educationLevel=="POSTGRADUATE"){
                if (!degree || !specialization || !studyYear) {
                    throw new ApiError(400, "Degree, specialization, and study year are required for postgraduate");
                  }
            
                  updatedUser = await amber.user.update({
                    where: {
                      id: user.id
                    },
                    data: {
                      educationLevel,
                      degree,
                      studyYear,
                      specialization,
                      // Reset other education fields to null
                      schoolingYear: null,
                      schoolStream: null
                    }
                  });
            }
            else{
                throw new ApiError(401,"First Select EducationLevel")
            }
            return res.status(200).json({
                success: true,
                message: "Education details updated successfully",
                data: {
                  educationLevel: updatedUser.educationLevel,
                  schoolingYear: updatedUser.schoolingYear,
                  schoolStream: updatedUser.schoolStream,
                  degree: updatedUser.degree,
                  studyYear: updatedUser.studyYear,
                  specialization: updatedUser.specialization
                }
              });
        
          } catch (error) {
            console.error("Error during updation:", error);
            if (error instanceof ApiError) {
              return error;
            }
            throw new ApiError(500, "An unexpected error occurred during signup");
          }
    
}) //done

const dashboard= asyncHandler(async(req,res)=>{
    const user=req.user
    const returnUser=await amber.user.findUnique({
        where:{
            id:user.id
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profilepicture: true,
            educationLevel: true,
            schoolingYear: true,
            schoolStream: true,
            degree: true,
            studyYear: true,
            specialization: true,
            createdAt: true,
            updatedAt: true,
            purchases: {
                select: {
                    assignedAt: true,
                    course: {
                        select: {
                            id: true,
                            title: true,
                            imageUrl: true,
                            // Add any other course fields you want to include
                        }
                    }
                }
            }}
})
if (!returnUser) {
    return res.status(404).json({
        success: false,
        message: "User not found"
    });
}
return res.status(200).json(new ApiResponse(200,returnUser,"UserInfo given"));


})

const uploadpic = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        
        if (!req.file) {
            throw new ApiError(400, "Profile picture file is required");
        }

        const profilePictureLocalPath = req.file.path;
        console.log("Local file path:", profilePictureLocalPath);

        // Get current user
        const currentUser = await amber.user.findUnique({
            where: { id: user.id },
            select: { profilepicture: true }
        });

        // Upload new image
        const profilePicture = await uploadProfile(profilePictureLocalPath);
        
        if (!profilePicture?.secure_url) {
            throw new ApiError(400, "Error while uploading profile picture");
        }

        // Delete old image if exists
        const extractPublicId = (secureUrl) => {
            // Split URL by '/' and get everything after 'upload'
            const urlParts = secureUrl.split('/');
            const uploadIndex = urlParts.findIndex(part => part === 'upload');
            
            // Get the version and actual path (excluding the file extension)
            const relevantParts = urlParts.slice(uploadIndex + 2); // Skip the version number
            const publicId = relevantParts.join('/').split('.')[0];
            
            return publicId;
        }
        if (currentUser?.profilepicture) {
            const publicId = extractPublicId(currentUser.profilepicture)
            console.log(publicId)
            
            await deleteProfile(publicId);
        }

        // Update user profile
        const updatedUser = await amber.user.update({
            where: { id: user.id },
            data: { profilepicture: profilePicture.secure_url },
            select: {
                id: true,
                username: true,
                profilepicture: true
            }
        });

        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Profile picture updated successfully")
        );

    } catch (error) {
        console.error("Upload error:", error);
        
        // Clean up local file if exists
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(console.error);
        }

        throw error; // This will be caught by asyncHandler
    }
});


const getUserProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    try {
        const user = await amber.user.findUnique({
          where: {
            username: username
          },
          select: {
            username: true,
            profilepicture: true
          }
        });
    
        // Check if user exists
        if (!user) {
          return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }
    
        // Send success response if user is found
        return res
            .status(200)
            .json(
            new ApiResponse(200, user, 'User profile fetched successfully')
        );
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Handle any server errors
        return res.status(500).json(
          new ApiResponse(500, null, 'An error occurred while fetching user profile')
        );
      }
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})



const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})




const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


export {
    testing,
    signup,
    education,
    dashboard,
    uploadpic,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    getUserProfile,
    getWatchHistory
}