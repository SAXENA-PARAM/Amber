import { asyncHandler } from "../utils/asyncHandler.js";
import zod from "zod"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {amber,redisClient} from "../db/index.js";
import {uploadBanner,uploadContentVideo,uploadPromoVideo,uploadThumbnail,deletePromo,deleteBanner,uploadProfile,deleteProfile} from "../utils/cloudinary.js"
import {course_basics_upload,course_goals_update,profile_upload} from '../queue/ins_queue.js'
import { json } from "express";
import { processOperations, validateDeletions, validateUpdates,handleRedisOperations } from "../utils/course.js";

const JobStatus = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  UPDATING:'updating',
  UPDATED:'updated',
  CLEANUP_PENDING: 'cleanup_pending',
  CLEANED_UP: 'cleaned_up',
  FAILED: 'failed' 
};



const validateSectionData = (data,courseId) => {
    const errors = [];
    
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Section title is required');
    }
    
    if (!courseId) {
      errors.push('Course ID is required');
    }
    
    // if (!Array.isArray(data.contents)) {
    //   errors.push('Contents array is required');
    // }
    
    return errors;
  };
 

  // Validate content data
const validateContentData = (content) => {
    const errors = [];
    
    if (!content.title || content.title.trim().length === 0) {
      errors.push('Content title is required');
    }
    
    if (!content.type) {
      errors.push('Content type is required');
    }
    
    return errors;
  };

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
const qualification= asyncHandler(async(req,res)=>{
    const user = req.user;
    const { 
    qualificationsToAdd = [], 
    qualificationsToUpdate = [], 
    qualificationsToDelete = [] 
  } = req.body;

  if (!user) {
    throw new ApiError(400, "Instructor verification failed");
  }

  try {
    // Validate input data structure
    if (!Array.isArray(qualificationsToAdd) || 
        !Array.isArray(qualificationsToUpdate) || 
        !Array.isArray(qualificationsToDelete)) {
      throw new ApiError(400, "Invalid data format. Expected arrays for add, update, and delete operations");
    }

    // Validation helper function
    const validateQualification = (qual, requireId = false) => {
      if (requireId && !qual.id) {
        throw new ApiError(400, "Qualification ID is required for update/delete operations");
      }
      if (!qual.title || !qual.institution || !qual.year) {
        throw new ApiError(400, "Each qualification must have title, institution, and year");
      }
      const currentYear = new Date().getFullYear();
      if (qual.year < 1900 || qual.year > currentYear) {
        throw new ApiError(400, `Year must be between 1900 and ${currentYear}`);
      }
    };

    // Validate all qualification objects
    qualificationsToAdd.forEach(qual => validateQualification(qual, false));
    qualificationsToUpdate.forEach(qual => validateQualification(qual, true));
    qualificationsToDelete.forEach(id => {
      if (!Number.isInteger(id)) {
        throw new ApiError(400, "Invalid qualification ID for deletion");
      }
    });

    // Perform all operations in a transaction
    const result = await amber.$transaction(async (amber) => {
      // Verify ownership of qualifications being updated/deleted
      if (qualificationsToUpdate.length > 0 || qualificationsToDelete.length > 0) {
        const existingQuals = await amber.qualification.findMany({
          where: {
            instructorId: user.id,
            id: {
              in: [
                ...qualificationsToUpdate.map(q => q.id),
                ...qualificationsToDelete
              ]
            }
          },
          select: { id: true }
        });

        const existingIds = new Set(existingQuals.map(q => q.id));
        
        // Check if all qualifications belong to the instructor
        const invalidUpdateIds = qualificationsToUpdate
          .filter(q => !existingIds.has(q.id))
          .map(q => q.id);
          
        const invalidDeleteIds = qualificationsToDelete
          .filter(id => !existingIds.has(id));

        if (invalidUpdateIds.length > 0 || invalidDeleteIds.length > 0) {
          throw new ApiError(403, "Some qualifications do not belong to this instructor");
        }
      }

      // Handle deletions
      if (qualificationsToDelete.length > 0) {
        await amber.qualification.deleteMany({
          where: {
            id: { in: qualificationsToDelete },
            instructorId: user.id
          }
        });
      }

      // Handle updates
      const updatePromises = qualificationsToUpdate.map(qual => 
        amber.qualification.update({
          where: {
            id: qual.id,
            instructorId: user.id
          },
          data: {
            title: qual.title,
            institution: qual.institution,
            year: qual.year
          }
        })
      );
      await Promise.all(updatePromises);

      // Handle additions
      if (qualificationsToAdd.length > 0) {
        await amber.qualification.createMany({
          data: qualificationsToAdd.map(qual => ({
            title: qual.title,
            institution: qual.institution,
            year: qual.year,
            instructorId: user.id
          }))
        });
      }

      // Fetch all updated qualifications
      const updatedQualifications = await amber.qualification.findMany({
        where: {
          instructorId: user.id
        },
        orderBy: {
          year: 'desc'
        }
      });

      return updatedQualifications;
    });

    return res.status(200).json(new ApiResponse(200, result, "Qualifications Updated Successfully"));

  } catch (error) {
    console.error("Error during qualification update:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "An unexpected error occurred while updating qualifications");
  }
})

const achievement=asyncHandler(async(req,res)=>{
    const user = req.user;
  const { 
    achievementsToAdd = [], 
    achievementsToUpdate = [], 
    achievementsToDelete = [] 
  } = req.body;

  if (!user) {
    throw new ApiError(400, "Instructor verification failed");
  }

  try {
    // Validate input data structure
    if (!Array.isArray(achievementsToAdd) || 
        !Array.isArray(achievementsToUpdate) || 
        !Array.isArray(achievementsToDelete)) {
      throw new ApiError(400, "Invalid data format. Expected arrays for add, update, and delete operations");
    }

    // Validation helper function
    const validateAchievement = (achievement, requireId = false) => {
      if (requireId && !achievement.id) {
        throw new ApiError(400, "Achievement ID is required for update/delete operations");
      }
      if (!achievement.title || !achievement.referencepic || !achievement.year) {
        throw new ApiError(400, "Each achievement must have title, referencepic, and year");
      }
      const currentYear = new Date().getFullYear();
      if (achievement.year < 1900 || achievement.year > currentYear) {
        throw new ApiError(400, `Year must be between 1900 and ${currentYear}`);
      }
    };

    // Validate all achievement objects
    achievementsToAdd.forEach(achievement => validateAchievement(achievement, false));
    achievementsToUpdate.forEach(achievement => validateAchievement(achievement, true));
    achievementsToDelete.forEach(id => {
      if (!Number.isInteger(id)) {
        throw new ApiError(400, "Invalid achievement ID for deletion");
      }
    });

    // Perform all operations in a transaction
    const result = await amber.$transaction(async (amber) => {
      // Verify ownership of achievements being updated/deleted
      if (achievementsToUpdate.length > 0 || achievementsToDelete.length > 0) {
        const existingAchievements = await amber.achievement.findMany({
          where: {
            instructorId: user.id,
            id: {
              in: [
                ...achievementsToUpdate.map(a => a.id),
                ...achievementsToDelete
              ]
            }
          },
          select: { id: true }
        });

        const existingIds = new Set(existingAchievements.map(a => a.id));
        
        // Check if all achievements belong to the instructor
        const invalidUpdateIds = achievementsToUpdate
          .filter(a => !existingIds.has(a.id))
          .map(a => a.id);
          
        const invalidDeleteIds = achievementsToDelete
          .filter(id => !existingIds.has(id));

        if (invalidUpdateIds.length > 0 || invalidDeleteIds.length > 0) {
          throw new ApiError(403, "Some achievements do not belong to this instructor");
        }
      }

      // Handle deletions
      if (achievementsToDelete.length > 0) {
        await amber.achievement.deleteMany({
          where: {
            id: { in: achievementsToDelete },
            instructorId: user.id
          }
        });
      }

      // Handle updates
      const updatePromises = achievementsToUpdate.map(achievement => 
        amber.achievement.update({
          where: {
            id: achievement.id,
            instructorId: user.id
          },
          data: {
            title: achievement.title,
            referencepic: achievement.referencepic,
            year: achievement.year
          }
        })
      );
      await Promise.all(updatePromises);

      // Handle additions
      if (achievementsToAdd.length > 0) {
        await amber.achievement.createMany({
          data: achievementsToAdd.map(achievement => ({
            title: achievement.title,
            referencepic: achievement.referencepic,
            year: achievement.year,
            instructorId: user.id
          }))
        });
      }

      // Fetch all updated achievements
      const updatedAchievements = await amber.achievement.findMany({
        where: {
          instructorId: user.id
        },
        orderBy: {
          year: 'desc'
        }
      });

      return updatedAchievements;
    });

    return res.status(200).json({
      success: true,
      message: "Achievements updated successfully",
      data: result
    });

  } catch (error) {
    console.error("Error during achievement update:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "An unexpected error occurred while updating achievements");
  }
})

const dashboard = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        
        if (!user || !user.id) {
            throw new ApiError(401, "Unauthorized access or invalid user");
        }

        const instructorDetails = await amber.instructor.findUnique({
            where: {
                id: user.id
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilepicture: true,
                createdAt: true,
                updatedAt: true,
                qualification: {
                    select: {
                        id: true,
                        title: true,
                        institution: true,
                        year: true
                    },
                    orderBy: {
                        year: 'desc'
                    }
                },
                achievement: {
                    select: {
                        id: true,
                        title: true,
                        referencepic: true,
                        year: true
                    },
                    orderBy: {
                        year: 'desc'
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        purchasedBy: {
                            select: {
                                userId: true
                            }
                        },
                    },
                }
            }
        });

        if (!instructorDetails) {
            throw new ApiError(404, "Instructor not found");
        }

        // Transform the data to include student count
        const transformedData = {
            ...instructorDetails,
            course: instructorDetails.course.map(course => ({
                ...course,
                studentCount: course.purchasedBy.length
            }))
        };

        // Clean up the purchasedBy array as we don't need to send it to the client
        transformedData.course.forEach(course => {
            delete course.purchasedBy;
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                transformedData,
                "Instructor information retrieved successfully"
            )
        );

    } catch (error) {
        // Log the error for debugging
        console.error("Dashboard Error:", error);

        // If it's already an ApiError, throw it as is
        if (error instanceof ApiError) {
            throw error;
        }

        // For any other error, throw a generic API error
        throw new ApiError(500, "Error while fetching instructor details", error);
    }
});

const allcourses=asyncHandler(async(req,res)=>{
    const user=req.user
    const courses=[]
    try{
    courses=await amber.course.findMany(
      {
        where:{
          insId:user.id
        },
        select:{
          title:true,
          id:true,
          imageUrl:true
        }
      }
    )
    return res.status(200).json(
      new ApiResponse(200, courses)
  );}catch (error) {
    // Log the error for debugging
    console.log("Error retrieving courses:", error);

    // Handle specific amber errors
    if (error.code === 'P2002') {
      return res.status(409).json(
        new ApiResponse(409, null, "Conflict in retrieving courses")
      );
    }

    // Generic error handler
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error while fetching courses")
    );
  }

})

const getcoursebasics=asyncHandler(async(req,res)=>{
  const courseId =Number(req.params.courseId)
  if(!courseId ||isNaN(courseId)){
    throw new ApiError(400, "Valid Course ID is required")
    
  }
  const user =req.user
  try{ 
 
  const course=await amber.course.findUnique({
    where:{
        id:courseId,
        insId:user.id
    },
    select:{
      id:true,
      title:true,
      description:true,
      category:true,
      subcategory:true,
      imageUrl:true,
      introvideo:true,
    }
})
if (!course) {
  return res.status(404).json(
    new ApiResponse(404, null, "Course not found or you don't have access")
  );
}
const response=await redisClient.hGetAll(`courses:${course.id}:basics:job`)
const normalObject = { ...response };
return res.status(200).json(
  new ApiResponse(200,{
    course,
    user,
    res:normalObject
  },"user data")
);


}catch (error) {
// Log the error for debugging
console.error("Error retrieving course basics:", {
  message: error.message,
  code: error.code,
  stack: error.stack
});

// Handle specific amber errors
switch (error.code) {
  
  case 'P2025':
    return res.status(404).json(
      new ApiResponse(404, null, "Course not found")
    );
  
  default:
    // Generic error handler
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error while fetching course")
    );
}

}})

const savecoursebasics=asyncHandler(async(req,res)=>{
 
    const courseId =Number(req.params.courseId)
    const user=req.user
    const thumbnail_delete=req.header('thumbnail_delete') === 'true';
    const introvideo_delete=req.header('introvideo_delete') === 'true';
    
    const updates = {};
    const {
      title,
      description,
      category,
      subcategory,
    }= req.body

    

    if (!courseId) {
      return res.status(400).json(
        new ApiResponse(400, null, "Course ID is required")
      );
    }
  
    // Prepare update data
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (subcategory) updates.subcategory = subcategory;

     // Update course with file URLs
     try{
     
      const existingCourse = await amber.course.findFirst({
        where:{
          id:courseId,
          insId:user.id
        },
        select:{
          id:true,
          imageUrl:true,
          introvideo:true
        }
      })
      if (!existingCourse) {
        return res.status(404).json(
          new ApiResponse(404, null, "Course not found or you aren't authorised")
        );
      }
     

    const updatedCourse = await amber.$transaction(async (amber) => {
      // Update course with new data
      const course = await amber.course.update({
        where: { 
          id: courseId,
          insId: user.id 
        },
        data: updates,
        select: {
          id: true,
          insId:true,
          title: true,
          description: true,
          category: true,
          subcategory: true,
          imageUrl:true,
          introvideo:true,
        }
      });

      return course;
    });
    
    if (updatedCourse) {
      const APIResponse={
        data:updatedCourse,
        thumbnailResponse:null,
        introvideoResponse:null
      }
      const is_job=await redisClient.exists(`courses:${updatedCourse.id}:basics:job`)
      let data;
      if(is_job){
         const info=await redisClient.hGetAll(`courses:${updatedCourse.id}:basics:job`) 
         data={...info} 
         console.log(data)  
      }
      
       // Image upload handling
    if(req.files?.image || thumbnail_delete){   
    if(data?.thumbnail===JobStatus.UPLOADING){
      APIResponse.thumbnailResponse='Wait until previous task is finished'
    }else {
      let publicId
      const filePath=thumbnail_delete? null : req.files.image[0].path
      const uploadPath=thumbnail_delete? null :`courses/${courseId}/thumbnail`
      const resourceType='image'
    // Prepare cleanup for existing image
    if (existingCourse.imageUrl) {
      const extractPublicId = (secureUrl) => {
        // Split URL by '/' and get everything after 'upload'
        const urlParts = secureUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        
        // Get the version and actual path (excluding the file extension)
        const relevantParts = urlParts.slice(uploadIndex + 2); // Skip the version number
        const publicId = relevantParts.join('/').split('.')[0];
        
        return publicId;
    }
    publicId=extractPublicId(existingCourse.imageUrl)
  }
 
  const response=await course_basics_upload.add(`Thumnail-upload-${courseId}`,{
    filePath, 
    resourceType,
    courseId,  
    uploadPath,
    publicId,
    status:'uploading',
    to_delete:thumbnail_delete
  })
  console.log(`Course thumnail upload id: ${response.id}`)
  if(response){
    APIResponse.thumbnailResponse=JobStatus.UPLOADING
    const set_value=await redisClient.hSet(`courses:${updatedCourse.id}:basics:job`,'thumbnail',JobStatus.UPLOADING)
    console.log(set_value)
  }
}}

  // Intro video handling
    if(req.files?.introvideo || introvideo_delete){
    if(data?.introvideo===JobStatus.UPLOADING){
      APIResponse.introvideoResponse="Wait untill previous task is completed"
    }else{
    let publicId
      const filePath=introvideo_delete? null : req.files.introvideo[0].path
      const uploadPath=introvideo_delete? null : `courses/${courseId}/promo`
      const resourceType='video'
    // Prepare cleanup for existing image
    if (existingCourse.introvideo) {
      const extractPublicId = (secureUrl) => {
        // Split URL by '/' and get everything after 'upload'
        const urlParts = secureUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        
        // Get the version and actual path (excluding the file extension)
        const relevantParts = urlParts.slice(uploadIndex + 2); // Skip the version number
        const publicId = relevantParts.join('/').split('.')[0];
        
        return publicId;
    }
      publicId = extractPublicId(existingCourse.introvideo)
  }
  const response=await course_basics_upload.add(`Promo-upload-${courseId}`,{
    filePath, 
    resourceType,
    courseId,  
    uploadPath,
    publicId,
    status:'uploading',
    to_delete:introvideo_delete
  })
  console.log(`Course promo uploadid: ${response.id}`)
  if(response){
    APIResponse.introvideoResponse=JobStatus.UPLOADING
    const set_value=await redisClient.hSet(`courses:${updatedCourse.id}:basics:job`,'introvideo',JobStatus.UPLOADING)
    console.log(set_value)
  }
  }}

  
  return res.status(200).json(
        new ApiResponse(200,APIResponse, "Course basics updation accepted successfully")
      );
    }


     }catch(error){
      console.error("Course update error:", error);
    // Handle specific error scenarios
    if (error.code === 'P2002') {
      return res.status(409).json(
        new ApiResponse(409, null, "Duplicate course data")
      );
    }

    return res.status(500).json(
      new ApiResponse(500, null, "Error updating course basics")
    ); }

})

const getpic=asyncHandler(async(req,res)=>{
  const user=req.user;
  try{
    const hashkey=await redisClient.exists(`instructors:profile:${user.id}:job`)
    if(hashkey){
      const data=await redisClient.get(`instructors:profile:${user.id}:job`)
      const cache=JSON.parse(data);
      if(cache.profilepic===JobStatus.FAILED || cache.profilepic===JobStatus.UPDATED){
        const response=await redisClient.del(`instructors:profile:${user.id}:job`)
      }
      return res.status(200).json(
        new ApiResponse(200,user,cache.profilepic)
      )
    }
    else if(!hashkey){
      const user_exists=await redisClient.exists(`instructors:profile:${user.id}`)
     if(!user_exists){
      const response=await redisClient.set(`instructors:profile:${user.id}`,JSON.stringify(user))
      console.log(response)
      return res.status(200).json(
        new ApiResponse(200,user,"User data retrieved successfully")
      )
    }
      else{
        const cache=await redisClient.get(`instructors:profile:${user.id}`);
        const user_data=JSON.parse(cache)
        return res.status(200).json(
          new ApiResponse(200,user_data,"User data retrieved successfully")
        )
      }
    }
    
  }catch(error){
    console.error("Error retrieving user:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    switch (error.code) {
  
      case 'P2025':
        return res.status(404).json(
          new ApiResponse(404, null, "User not found")
        );
      
      default:
        // Generic error handler
        return res.status(500).json(
          new ApiResponse(500, null, "Internal server error while fetching course")
        );
    }
  }

})

const getuser=asyncHandler(async(req,res)=>{
  const user =req.user
  return res.status(200).json(
   new ApiResponse(200,user,'here is ur user'))
})

const uploadpic = asyncHandler(async (req, res) => {
  try {
      const user = req.user;
      const to_delete=req.header('to_delete') === 'true';
      const hashkey=await redisClient.exists(`instructors:profile:${user.id}:job`)
      if(hashkey){
      const data=await redisClient.get(`instructors:profile:${user.id}:job`)
      const cache=JSON.parse(data);
      if(cache.profilepic===JobStatus.UPLOADING){
        return res.status(200).json(
          new ApiResponse(200,user,"Wait until previous task is finished")
        )
      }
      
    }
      let publicId
      if (!req.file && !to_delete) {
          throw new ApiError(400, "Profile picture file is required");
      }

      // const profilePictureLocalPath = req.file?.path;
      // console.log("Local file path:", profilePictureLocalPath);

      // Get current user

      const extractPublicId = (secureUrl) => {
        // Split URL by '/' and get everything after 'upload'
        const urlParts = secureUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        
        // Get the version and actual path (excluding the file extension)
        const relevantParts = urlParts.slice(uploadIndex + 2); // Skip the version number
        const publicId = relevantParts.join('/').split('.')[0];
        
        return publicId;
    }
    if (user?.profilepicture) {
         publicId = extractPublicId(user.profilepicture)
        console.log(publicId)
    }
    let response;
      // Upload new image
     
     const jobData = {
        filePath: to_delete ? null : req.file?.path ,
        publicId,
        folderpath: to_delete ? null : `profilePictures/instructors/${user.id}`,
        userId: user.id,
        status: JobStatus.UPLOADING,
        to_delete
      };
  
     response = await profile_upload.add(`profile-upload-${user.id}`, jobData);
  

      console.log(response)
      console.log(`userid: ${user.id}`)
      console.log(`jobId in controller: ${response.id}`)

      const redisData = {
        profilepic: JobStatus.UPLOADING,
      }
      const set_value=await redisClient.set(`instructors:profile:${user.id}:job`,JSON.stringify(redisData))
      console.log(`Set_Value: ${set_value}`)
      const response2=await redisClient.del(`instructors:profile:${user.id}`)
      console.log(response2)
      return res.status(200).json(
          new ApiResponse(200, response, "Profile picture updation in process")
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

const getgoals= asyncHandler(async(req,res)=>{

})

const savegoals=asyncHandler(async (req, res) => {
  const courseId =Number(req.params.courseId)
  const user=req.user
  const { prerequisites = [], learnings = [] } = req.body;
  if(!courseId ||isNaN(courseId)){  
      throw new ApiError(400, "Valid Course ID is required")
  }

  try {
    const existingCourse = await amber.course.findFirst({
      where:{
        id:courseId,
        insId:user.id
      },
      select:{
        id:true,
        imageUrl:true,
        introvideo:true
      }
    })
    if (!existingCourse) {    
       throw new ApiError(404, "Course not found or you aren't authorised")     
    }

    let prerequisitesMapper, learningsMapper;
    // await amber.$transaction(async (amber) => {
      [prerequisitesMapper, learningsMapper] = await Promise.all([
        processOperations(amber, 'prerequisites', courseId, prerequisites),
        processOperations(amber, 'learnings', courseId, learnings)
      ]);
    //});
    
    // Fetch updated data
    const [updatedPrerequisites, updatedLearnings] = await Promise.all([
      amber.prerequisites.findMany({
        where: { courseId },
        orderBy: { orderId: 'asc' }
      }),
      amber.learnings.findMany({
        where: { courseId },
        orderBy: { orderId: 'asc' }
      })
    ]);

    return res.json(
      new ApiResponse(200, {
        prerequisites: updatedPrerequisites,
        learnings: updatedLearnings,
        idMappings: {
          prerequisites: Object.fromEntries(prerequisitesMapper.mapping),
          learnings: Object.fromEntries(learningsMapper.mapping)
        }
      }, "Goals updated successfully")
    );

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
  }
  
  if (error.code === 'P2002') {
      throw new ApiError(400, "Duplicate order number detected", 
          ["Each item must have a unique order number within the course"]);
  }

  // Map specific error messages to appropriate API errors
  const errorMessage = error.message.toLowerCase();
  if (errorMessage.includes('order cannot be less than 1')) {
      throw new ApiError(400, "Invalid order value", 
          ["Order number must be greater than 0"]);
  }
  if (errorMessage.includes('order cannot exceed total items')) {
      throw new ApiError(400, "Invalid order value", 
          ["Order number exceeds the maximum allowed value"]);
  }
  if (errorMessage.includes('item with order') && errorMessage.includes('already exists')) {
      throw new ApiError(400, "Duplicate order number", 
          ["Each item must have a unique order number"]);
  }
  if (errorMessage.includes('not found')) {
      throw new ApiError(404, error.message);
  }

  // Generic error for unexpected cases
  throw new ApiError(500, "An unexpected error occurred while saving goals", 
      [error.message]);

  }
});

const savegoals2=asyncHandler(async(req,res)=>{
  const courseId =Number(req.params.courseId)
  const user=req.user
  const {  currentState, // Full JSON state including items with temp IDs
    additions = [], // Array of temp IDs to be added
    updates = [], // Array of {id, content} objects
    deletions = [] } = req.body;
  if(!courseId ||isNaN(courseId)){  
      throw new ApiError(400, "Valid Course ID is required")
  }
  try {
    const existingCourse = await amber.course.findFirst({
      where:{
        id:courseId,
        insId:user.id
      },
      select:{
        id:true,
        imageUrl:true,
        introvideo:true
      }
    })
    if (!existingCourse) {    
       throw new ApiError(404, "Course not found or you aren't authorised")     
    }

     // Validate currentState order sequence
    const orderIds = Object.values(currentState).map(item => Number(item.orderId)).sort((a, b) => a - b);
    for (let i = 0; i < orderIds.length; i++) {
      if (orderIds[i] !== i + 1) {
        throw new ApiError(400, "Current state items must be in sequential order starting from 1")
      }
    }

    const existingPrerequisites = await amber.prerequisites.findMany({
      where: { courseId: courseId},
      select: { id: true }
    });

    let existingIds
    if(existingPrerequisites) existingIds = new Set(existingPrerequisites.map(p => p.id));
    const currentStateIds = new Set(Object.values(currentState).map(item => 
      typeof item.id === 'number' ? item.id : null
    ).filter(id => id !== null));

   let addedPrerequisites=[]
   if(additions && additions.length>0){
    const findItemByTempId = (tempId) => {return Object.values(currentState).find(item => item.id === tempId);     }
    const itemsToAdd = additions.map(tempId => {
      const item = findItemByTempId(tempId);
      if (!item) {
        throw new ApiError(400, `Item with temp ID ${tempId} not found in currentState`);
      }
      return {
        tempId,
        value: item.value,
        orderId: Number(item.orderId)
      };
    });
    addedPrerequisites = await amber.$transaction(async (prisma) => {
      return Promise.all(
        itemsToAdd.map(async (item) => {
         
          
          const newPrerequisite = await prisma.prerequisites.create({
            data: {
              value: item.value,
              orderId: Number(item.orderId),
              courseId: courseId,
            },
          });

          return { tempId:item.tempId, realId: newPrerequisite.id };
        })
      );
    }, {
      maxWait: 5000, // 5 seconds max wait time
      timeout: 10000 // 10 seconds timeout
    });
  }

    // Validate deletions array
    if( deletions && deletions.length>0 && existingIds)validateDeletions(deletions,existingIds,currentStateIds)
    // Validate updates array
    if(updates && updates.length>0 && existingIds)validateUpdates(updates, existingIds, currentStateIds);

    // Process additions - handle string temp IDs
    

    // Map temporary IDs to real IDs in currentState
    const tempToRealIdMap = addedPrerequisites.length > 0 
      ? Object.fromEntries(addedPrerequisites.map(({ tempId, realId }) => [tempId, realId]))
      : {};

     // Update currentState with real IDs
     const updatedCurrentState = { ...currentState };
     Object.entries(updatedCurrentState).forEach(([orderId, item]) => {
       if (tempToRealIdMap[item.id]) {
         updatedCurrentState[orderId] = {
           ...item,
           id: tempToRealIdMap[item.id]
         };
       }
     });

     const response= await course_goals_update.add(`Goals-Update-${courseId}`,{
      currentState,
      tempToRealIdMap,
      updates,
      deletions,
      courseId
     })

     console.log(`Goals updates set with jobid: ${response.id}`)

     await handleRedisOperations(existingCourse.id, updatedCurrentState, response.id);

     return res.json(
      new ApiResponse(200,{
        currentState,
        realId:tempToRealIdMap
      },"Goals added to update process")
     )

  }catch(error){
    console.error('SaveGoals Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new ApiError(404, "Record to update not found");
    }

    if (error.code === 'P2003') {
      throw new ApiError(400, "Foreign key constraint failed");
    }

    if (error.code === 'P2002') {
      throw new ApiError(400, "Unique constraint failed");
    }

    throw new ApiError(500, "An error occurred while saving goals");
  }})

const createCourse=asyncHandler(async(req,res)=>{
      // Store uploaded file URLs for rollback if needed
      console.log("Reached controller")
      const user=req.user
      const uploadedFiles = {
        imageUrl: null,
        banner: null,
        introvideo: null,
        sectionVideos: []
      };
  
      try {
        const {
          title,
          description,
          prerequisites,
          category,
          subcategory,
          currency,
          price,
          validityPeriod,
          openToEveryone,
          sections
        }= JSON.parse(req.body.data)
        console.log(title)
        const insId=user.id
        // Validate required fields
        if (!title) {
          return res.status(400).json({ error: 'Title and instructor ID are required' });
        }
  
        // Generate slug from title
        const slug = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  
        const result = await amber.$transaction(async (amber) => {
            // First, create course with basic data
            const courseData = {
              title,
              insId,
              slug,
              openToEveryone: openToEveryone === 'true'
            };
    
            // Add optional text fields if provided
            if (description) courseData.description = description;
            if (prerequisites) courseData.prerequisites = prerequisites;
            if (category) courseData.category = category;
            if (subcategory) courseData.subcategory = subcategory;
            if (currency) courseData.currency = currency;
            if (price) courseData.price = parseInt(price);
            if (validityPeriod) courseData.validityPeriod = parseInt(validityPeriod);
    
            // Create course first to ensure data consistency
            const createdCourse = await amber.course.create({
              data: courseData
            });
    
            // Handle main course file uploads
            if (req.files) {
              const updates = {};
    
              if (req.files.image) {
                
                let imageUrltemp = await uploadThumbnail(
                  req.files.image[0].path,
                  `courses/${createdCourse.id}/thumbnail`
                );
                updates.imageUrl=imageUrltemp.secure_url
                uploadedFiles.imageUrl = updates.imageUrl;
              }
    
              if (req.files.banner) {
                 
                let bannertemp= await uploadBanner(
                  req.files.banner[0].path,
                  `courses/${createdCourse.id}/banner`
                );
                updates.banner=bannertemp.secure_url
                uploadedFiles.banner = updates.banner;
              }
    
              if (req.files.introvideo) {
                
                let introvideotemp= await uploadPromoVideo(
                  req.files.introvideo[0].path,
                  `courses/${createdCourse.id}/promo`
                );
                updates.introvideo =introvideotemp.secure_url
                uploadedFiles.introvideo = updates.introvideo;
              }
    
              // Update course with file URLs
              if (Object.keys(updates).length > 0) {
                await amber.course.update({
                  where: { id: createdCourse.id },
                  data: updates
                });
              }
            }
    
            // Process sections if provided
            if (sections) {
              let sectionsData;
              try {
                // Check if sections is a string that needs parsing
                sectionsData = typeof sections === 'string' ? JSON.parse(sections) : sections;
              } catch (error) {
                throw new Error('Invalid sections data format');
              }
              
              
              for (const sectionData of sectionsData) {
                const { title: sectionTitle, contents } = sectionData;
    
                // Validate section data
                const sectionErrors = validateSectionData(sectionData,createdCourse.id);
                if (sectionErrors.length > 0) {
                  throw new Error(`Section validation failed: ${sectionErrors.join(', ')}`);
                }
    
                // Create section
                const section = await amber.section.create({
                  data: {
                    title: sectionTitle,
                    courseId: createdCourse.id
                  }
                });
    
                // Process each content item
                for (const content of contents) {
                  // Validate content data
                  const contentErrors = validateContentData(content);
                  if (contentErrors.length > 0) {
                    throw new Error(`Content validation failed: ${contentErrors.join(', ')}`);
                  }
    
                  let lectureData = null;
    
                  // Handle lecture creation if content type is LECTURE
                  if (content.type === 'LECTURE') {
                    lectureData = {
                      create: {
                        article: content.article || null,
                        videoUrl: null // Will be updated later if video is provided
                      }
                    };
                  }
    
                  // Create content with optional lecture
                  const createdContent = await amber.content.create({
                    data: {
                      title: content.title,
                      type: content.type,
                      description: content.description || null,
                      sectionId: section.id,
                      lecture: lectureData
                    }
                  });
    
                  // Handle video upload if provided and content type is LECTURE
                  if (content.type === 'LECTURE' &&  content.videoFileName) {
                    const sectionVideos = req.files?.sectionVideos || [];
                    // Find the video file that matches this content's videoFileName
                    const videoFile = Array.isArray(sectionVideos) 
                ? sectionVideos.find(file => file.originalname === content.videoFileName)
                : null;
      
                    if (videoFile) {
                      try {
                        
                        let videoUrltemp = await uploadContentVideo(
                          videoFile.path,
                          `courses/${createdCourse.id}/${section.id}/${createdContent.id}`
                        );
                        const videoUrl=videoUrltemp.public_id
                        uploadedFiles.sectionVideos.push({
                          url: videoUrl,
                          contentId: createdContent.id
                        });
      
                        // Update lecture with video URL
                        await amber.lecture.update({
                          where: { contentId: createdContent.id },
                          data: { videoUrl }
                        });
                      } catch (uploadError) {
                        console.error(`Failed to upload video for content ${createdContent.id}:`, uploadError);
                        throw new Error(`Video upload failed for content: ${content.title}`);
                      }
                    }
                  }
                }
              }
            }
    
            // Return created course with all related data
            return await amber.course.findUnique({
              where: { id: createdCourse.id },
              include: {
                sections: {
                  include: {
                    contents: {
                      include: {
                        lecture: true
                      }
                    }
                  }
                }
              }
            });
          },{
            maxWait:5000,
            timeout: 30000 
          });
    
          res.status(201).json(result);
  
      } catch (error) {
        console.error('Course creation error:', error);
        
      try{
       if(uploadedFiles.introvideo) {
        console.log(uploadedFiles.introvideo)
        const deletePromoResponse = await deletePromo(uploadedFiles.introvideo.public_id)
        if (deletePromoResponse && deletePromoResponse.result === 'ok') {
            console.log("Video successfully deleted");
        } else {
            console.log("Video deletion failed or not found");
        };}
        if(uploadedFiles.banner) {
            const deleteBannerResponse = await deleteBanner(uploadedFiles.banner.public_id)
            if (deleteBannerResponse && deleteBannerResponse.result === 'ok') {
                console.log("Banner successfully deleted");
            } else {
                console.log("Banner deletion failed or not found");
            };}
        if(uploadedFiles.imageUrl) {
            const deleteThumbnailResponse = await deleteBanner(uploadedFiles.imageUrl.public_id)
            if (deleteThumbnailResponse && deleteThumbnailResponse.result === 'ok') {
                    console.log("Banner successfully deleted");
            } else {
                    console.log("Banner deletion failed or not found");
            };} 
        for (const video of uploadedFiles.sectionVideos) {
                const deleteVideoResponse = await deleteVideo(video.url.public_id);
                if (deleteVideoResponse?.result === 'ok') {
                  console.log(`Section video successfully deleted for content ${video.contentId}`);
                }
                else {
                    console.log("Section Videos deletion failed or not found");
            }
              }       
        
      } catch (cleanupError) {
        console.error("Error during file cleanup:", cleanupError);
      }

      // Handle specific amber errors
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Unique constraint violation' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Foreign key constraint violation' });
      }

      // Handle validation errors
      if (error.message.includes('validation failed')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Failed to create course and sections' });
    }
  });

const updateCourse = asyncHandler(async (req, res) => {
    const user = req.user;
    const { courseId } = req.params;
  
    // Track both new uploads and files to delete
    const uploadedFiles = {
      imageUrl: null,
      banner: null,
      introvideo: null,
      sectionVideos: []
    };
  
    const filesToDelete = {
      imageUrl: null,
      banner: null,
      introvideo: null,
      sectionVideos: []
    };
  
    try {
      const {
        // Course basic data
        title,
        description,
        prerequisites,
        category,
        subcategory,
        currency,
        price,
        validityPeriod,
        openToEveryone,
        // Operations arrays
        sectionsToAdd = [],
        sectionsToUpdate = [],
        sectionsToDelete = [],
        contentsToAdd = [],
        contentsToUpdate = [],
        contentsToDelete = []
      } = req.body;
  
      if (!user) {
        throw new ApiError(400, "Instructor verification failed");
      }
  
      // Verify course exists and user has permission
      const existingCourse = await amber.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              contents: {
                include: {
                  lecture: true
                }
              }
            }
          }
        }
      });
  
      if (!existingCourse) {
        throw new ApiError(404, "Course not found");
      }
  
      if (existingCourse.insId !== user.id) {
        throw new ApiError(403, "Not authorized to update this course");
      }
    
      const validateSection = (section, requireId = false) => {
        if (requireId && !section.id) {
          throw new ApiError(400, "Section ID is required for update operations");
        }
        if (!section.title) {
          throw new ApiError(400, "Section title is required");
        }
        const sectionErrors = validateSectionData(section, courseId);
        if (sectionErrors.length > 0) {
          throw new ApiError(400, `Section validation failed: ${sectionErrors.join(', ')}`);
        }
      };
  
      const validateContent = (content, requireId = false) => {
        if (requireId && !content.id) {
          throw new ApiError(400, "Content ID is required for update operations");
        }
        const contentErrors = validateContentData(content);
        if (contentErrors.length > 0) {
          throw new ApiError(400, `Content validation failed: ${contentErrors.join(', ')}`);
        }
      };
  
    //   // Validate basic course data
    //   const basicDataErrors = validateBasicData(req.body);
    //   if (basicDataErrors.length > 0) {
    //     throw new ApiError(400, `Validation failed: ${basicDataErrors.join(', ')}`);
    //   }
  
      // Validate arrays
      sectionsToAdd.forEach(section => validateSection(section, false));
      sectionsToUpdate.forEach(section => validateSection(section, true));
      contentsToAdd.forEach(content => validateContent(content, false));
      contentsToUpdate.forEach(content => validateContent(content, true));
  
      // Perform all operations in a transaction
      const result = await amber.$transaction(async (amber) => {
        // 1. Update basic course data
        const courseUpdateData = {};
        
        if (title) {
          courseUpdateData.title = title;
          courseUpdateData.slug = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        }
        if (description) courseUpdateData.description = description;
        if (prerequisites) courseUpdateData.prerequisites = prerequisites;
        if (category) courseUpdateData.category = category;
        if (subcategory) courseUpdateData.subcategory = subcategory;
        if (currency) courseUpdateData.currency = currency;
        if (price) courseUpdateData.price = parseInt(price);
        if (validityPeriod) courseUpdateData.validityPeriod = parseInt(validityPeriod);
        if (openToEveryone !== undefined) courseUpdateData.openToEveryone = openToEveryone === 'true';
  
        // 2. Handle file uploads and updates
        if (req.files) {
          // Handle image upload
          if (req.files.image) {
            filesToDelete.imageUrl = existingCourse.imageUrl;
            courseUpdateData.imageUrl = await uploadThumbnail(
              req.files.image[0],
              `courses/${existingCourse.id}/thumbnail`
            );
            uploadedFiles.imageUrl = courseUpdateData.imageUrl;
          }
  
          // Handle banner upload
          if (req.files.banner) {
            filesToDelete.banner = existingCourse.banner;
            courseUpdateData.banner = await uploadBanner(
              req.files.banner[0],
              `courses/${existingCourse.id}/banner`
            );
            uploadedFiles.banner = courseUpdateData.banner;
          }
  
          // Handle intro video upload
          if (req.files.introvideo) {
            filesToDelete.introvideo = existingCourse.introvideo;
            courseUpdateData.introvideo = await uploadPromoVideo(
              req.files.introvideo[0],
              `courses/${existingCourse.id}/promo`
            );
            uploadedFiles.introvideo = courseUpdateData.introvideo;
          }
        }
  
        // Update course with all changes
        if (Object.keys(courseUpdateData).length > 0) {
          await amber.course.update({
            where: { id: courseId },
            data: courseUpdateData
          });
        }
  
        // 3. Handle section deletions
        if (sectionsToDelete.length > 0) {
          const sectionsToRemove = existingCourse.sections
            .filter(section => sectionsToDelete.includes(section.id));
          
          for (const section of sectionsToRemove) {
            for (const content of section.contents) {
              if (content.lecture?.videoUrl) {
                filesToDelete.sectionVideos.push({
                  url: content.lecture.videoUrl,
                  contentId: content.id
                });
              }
            }
          }
  
          await amber.section.deleteMany({
            where: {
              id: { in: sectionsToDelete },
              courseId:existingCourse.id
            }
          });
        }
  
        // 4. Handle content deletions
        if (contentsToDelete.length > 0) {
          const contentsToRemove = existingCourse.sections
            .flatMap(section => section.contents)
            .filter(content => contentsToDelete.includes(content.id));
  
          for (const content of contentsToRemove) {
            if (content.lecture?.videoUrl) {
              filesToDelete.sectionVideos.push({
                url: content.lecture.videoUrl,
                contentId: content.id
              });
            }
          }
  
          await amber.content.deleteMany({
            where: {
              id: { in: contentsToDelete },
            }
          });
        }
  
        // 5. Handle section updates
        for (const section of sectionsToUpdate) {
          await amber.section.update({
            where: {
              id: section.id,
            },
            data: {
              title: section.title,
              // Add any additional section fields here
            }
          });
        }
  
        // 6. Handle new sections
        if (sectionsToAdd.length > 0) {
          await amber.section.createMany({
            data: sectionsToAdd.map(section => ({
              title: section.title,
              courseId
            }))
          });
        }
  
        // 7. Handle content updates
        for (const content of contentsToUpdate) {
          const contentData = {
            title: content.title,
            type: content.type,
            description: content.description || null
          };
  
          if (content.type === 'LECTURE') {
            // Update lecture content
            await amber.content.update({
              where: {
                id: content.id,
                section: { courseId }
              },
              data: {
                ...contentData,
                lecture: {
                  update: {
                    article: content.article || null
                  }
                }
              }
            });
  
            // Handle video update if provided
            if (req.files?.sectionVideos && content.videoFileName) {
              const videoFile = req.files.sectionVideos.find(
                file => file.originalname === content.videoFileName
              );
  
              if (videoFile) {
                const existingContent = existingCourse.sections
                  .flatMap(s => s.contents)
                  .find(c => c.id === content.id);
  
                if (existingContent?.lecture?.videoUrl) {
                  filesToDelete.sectionVideos.push({
                    url: existingContent.lecture.videoUrl,
                    contentId: existingContent.id
                  });
                }
  
                const videoUrl = await uploadContentVideo(
                  videoFile,
                  `courses/${courseId}/${content.sectionId}/${content.id}`
                );
                uploadedFiles.sectionVideos.push({
                  url: videoUrl,
                  contentId: content.id
                });
  
                await amber.lecture.update({
                  where: { contentId: content.id },
                  data: { videoUrl }
                });
              }
            }
          } else {
            // Update non-lecture content
            await amber.content.update({
              where: {
                id: content.id,
                section: { courseId }
              },
              data: contentData
            });
          }
        }
  
        // 8. Handle new contents
        for (const content of contentsToAdd) {
          let lectureData = null;
          if (content.type === 'LECTURE') {
            lectureData = {
              create: {
                article: content.article || null,
                videoUrl: null
              }
            };
          }
  
          const createdContent = await amber.content.create({
            data: {
              title: content.title,
              type: content.type,
              description: content.description || null,
              sectionId: content.sectionId,
              lecture: lectureData
            }
          });
  
          // Handle video upload for new content
          if (content.type === 'LECTURE' && req.files?.sectionVideos && content.videoFileName) {
            const videoFile = req.files.sectionVideos.find(
              file => file.originalname === content.videoFileName
            );
  
            if (videoFile) {
              const videoUrl = await uploadContentVideo(
                videoFile,
                `courses/${courseId}/${content.sectionId}/${createdContent.id}`
              );
              uploadedFiles.sectionVideos.push({
                url: videoUrl,
                contentId: createdContent.id
              });
  
              await amber.lecture.update({
                where: { contentId: createdContent.id },
                data: { videoUrl }
              });
            }
          }
        }
  
        // Return updated course with all related data
        return await amber.course.findUnique({
          where: { id: courseId },
          include: {
            sections: {
              include: {
                contents: {
                  include: {
                    lecture: true
                  }
                }
              }
            }
          }
        });
      });
  
      // Clean up old files after successful update
      try {
        if (filesToDelete.introvideo) {
          await deletePromo(filesToDelete.introvideo.public_id);
        }
        if (filesToDelete.banner) {
          await deleteBanner(filesToDelete.banner.public_id);
        }
        if (filesToDelete.imageUrl) {
          await deleteThumbnail(filesToDelete.imageUrl.public_id);
        }
        for (const video of filesToDelete.sectionVideos) {
          await deleteVideo(video.url.public_id);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up old files:', cleanupError);
      }
  
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: result
      });
  
    } catch (error) {
      console.error('Course update error:', error);
  
      // Clean up newly uploaded files in case of error
      try {
        if (uploadedFiles.introvideo) {
          await deletePromo(uploadedFiles.introvideo.public_id);
        }
        if (uploadedFiles.banner) {
          await deleteBanner(uploadedFiles.banner.public_id);
        }
        if (uploadedFiles.imageUrl) {
          await deleteThumbnail(uploadedFiles.imageUrl.public_id);
        }
        for (const video of uploadedFiles.sectionVideos) {
          await deleteVideo(video.url.public_id);
        }
      } catch (cleanupError) {
        console.error('Error during file cleanup:', cleanupError);
      }
  
      if (error instanceof ApiError) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ApiError(400, "Unique constraint violation");
      }
      if (error.code === 'P2003') {
        throw new ApiError(400, "Foreign key constraint violation");
      }
      throw new ApiError(500, "An unexpected error occurred while updating course");
    }
  }); 
  export {
    testing,
    signup,
    qualification,
    achievement,
    dashboard,
    allcourses,
    getcoursebasics,
    savecoursebasics,
    savegoals,
    savegoals2,
    getgoals,
    uploadpic,
    getpic,
    getuser,
    createCourse,
    updateCourse,
  }