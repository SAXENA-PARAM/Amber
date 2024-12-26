import pkg from 'bullmq';
const { Queue, Worker, QueueScheduler, errorObject} = pkg;
import {uploadBanner,uploadContentVideo,uploadPromoVideo,uploadThumbnail,deletePromo,deleteBanner,uploadProfile,deleteProfile} from "../utils/cloudinary.js"
import {amber, redisClient} from "../db/index.js";
import { sendEmail ,sendEmail2, databaseErrormail,cleanupErrormail} from './ins_email.js';

const redisConfig={
    host:'127.0.0.1',
    port:'6379'
}

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

const course_basics_upload=new Queue('course-basics-upload',{connection:redisConfig})
const course_basics_upload_dlq=new Queue('course-basics-upload-dlq',{connection:redisConfig})

const course_basics_cleanup=new Queue('course-basics-cleanup',{connection:redisConfig})
const course_basics_cleanup_dlq=new Queue('course-basics-cleanup-dlq',{connection:redisConfig})

const profile_upload=new Queue('instructor-profile-upload',{connection:redisConfig})
const profile_cleanup=new Queue('instructor-profile-cleanup',{connection:redisConfig})

const profile_upload_dlq=new Queue('profile-upload-dlq',{connection:redisConfig})
const profile_cleanup_dlq=new Queue('profile-cleanup-dlq',{connection:redisConfig})

const upload_profile=new Worker('instructor-profile-upload',async job=>{
  console.log(`Processing upload job: ${job.id}, Attempt: ${job.attemptsMade + 1}`);
    const { 
        filePath, 
        folderpath,
        publicId,
        userId,
        to_delete,
        status,
        
      } = job.data;
      try {
        // await job.updateData({ 
        //     ...job.data, 
        //     status: JobStatus.UPLOADING 
        //   });
        let uploadResult;
        console.log(`Started processing for profile of ${userId}`)

        
        if(to_delete){
            try{
              const updated_user = await amber.instructor.update({
                where:{ id:userId },
                data:{ profilepicture:null}})
               if(updated_user){
                const data=await redisClient.get(`instructors:profile:${userId}:job`)
                let cache =JSON.parse(data);
                cache.profilepic=JobStatus.UPDATED
                let set_value=await redisClient.set(`instructors:profile:${userId}:job`,JSON.stringify(cache))
                console.log(set_value) 
               } 
              }catch(error){
                throw new Error('Database update failed')
              }
              
              // if (!updated_user) throw new Error('Database update failed');  
              
              await job.updateData({ ...job.data, status: JobStatus.UPDATED});
              console.log(`Completed deleting and updating profile for ${userId}`)
                
          }
        else {
            uploadResult = await uploadProfile(filePath,folderpath);
            if (!uploadResult) throw new Error('Upload failed');
           
            await job.updateData({ 
              ...job.data, 
              status: JobStatus.UPLOADED,
              secure_url:uploadResult.secure_url
            });
              console.log(uploadResult.secure_url)
              console.log(`Completed  profile upload on cloudinary for ${userId} and upload info:${uploadResult}`)
           
           
           
            await job.updateData({ 
              ...job.data, 
              status: JobStatus.UPDATING,
              secure_url:uploadResult.secure_url
            });
            try{
            const updated_user = await amber.instructor.update({
              where:{ id:userId },
              data:{ profilepicture:uploadResult.secure_url }})
             if(updated_user){
              const data=await redisClient.get(`instructors:profile:${userId}:job`)
              let cache =JSON.parse(data);
              cache.profilepic=JobStatus.UPDATED
              let set_value=await redisClient.set(`instructors:profile:${userId}:job`,JSON.stringify(cache))
              console.log(set_value) 
             } 
            }catch(error){
              throw new Error('Database update failed')
            }
            
            // if (!updated_user) throw new Error('Database update failed');  
            
            await job.updateData({ ...job.data, status: JobStatus.UPDATED});
            console.log(`Completed uploading and updating profile for ${userId}`)
              
          
            } 
        

        
      } catch (error) {
        if (error.message.includes('Database update failed')) {
          throw error; // Retry logic will handle this
      }

      // For other errors (e.g., upload failure), set the job status to FAILED
      await job.updateData({
          ...job.data,
          status: JobStatus.FAILED,
          error: error.message
      });

      // Re-throw the error to respect retry logic
      throw error;
      } 
},{
  connection: redisConfig,
    attempts: 3, // Retry up to 3 times
    backoff: {
        type: 'exponential', // Exponential backoff
        delay: 5000 // 5 seconds initial delay
        }
  })

upload_profile.on('completed',async(job)=>{
    console.log(job.id)
    console.log(job.data);
    const { 
        userId,  
        publicId,
        folderpath
      } = job.data;
    console.log("control reached to adding to cleanup queue")
    if(publicId){
    await profile_cleanup.add(`cleanup-profile-${userId}`,{
      userId,
      publicId,
      folderpath,
      status:'cleanup_pending'
    })}
    else{
        console.log("No previous records to delete")
    }

})

upload_profile.on('failed', async (job, err) => {
    console.error('Upload job failed:', err);

  if (err.message.includes('Database update failed')) {
    console.log(`Adding job ${job.id} to DLQ due to database update failure`);
    await profile_upload_dlq.add('failed-database-update', {
        originalJobId: job.id, 
        originalJobName: job.name, 
        originalJob: job.data,
        error: err.message
    });
} else {
    // For other errors, ensure the job status is set to FAILED
    const data=await redisClient.get(`instructors:profile:${job.data.userId}:job`)
          let cache =JSON.parse(data);
          cache.profilepic=JobStatus.FAILED
          let set_value=await redisClient.set(`instructors:profile:${job.data.userId}:job`,JSON.stringify(cache))
          console.log(set_value)
    await job.updateData({
        ...job.data,
        status: JobStatus.FAILED,
        error: err.message
    });
}
  });

const database_update_worker = new Worker('profile-upload-dlq', async job => {
    const { originalJobId,originalJobName,originalJob, uploadResult } = job.data;
    console.log(originalJob)
    try {
        // Attempt to send email or notification about failed database update
        await sendEmail({
            jobname: originalJobName,
            jobid: originalJobId,
            userId:originalJob.userId,
            cloudinaryUrl:originalJob.secure_url
        });

        // Mark job as processed
        await job.updateData({
            ...job.data,
            status: 'notification_sent'
        });
    } catch (notificationError) {
        // If notification fails, keep the job in DLQ
        console.error('Failed to send notification', notificationError);
        throw notificationError;
    }
}, { connection: redisConfig });


const cleanup_profile =new Worker('instructor-profile-cleanup',async job=>{
    console.log(`Processing cleanup job: ${job.id}, Attempt: ${job.attemptsMade + 1}`);
    const{
        userId,
        publicId,
        folderpath,
        status
    }=job.data
    try {
        // await job.updateData({ 
        //     ...job.data, 
        //     status: JobStatus.CLEANUP_PENDING 
        //   });
        let cleanupResult;
        console.log(`Started deletion for profile of ${userId}`)
        
        if (!publicId) {
          throw new Error('Public Id not provided');
      }
          
          cleanupResult = await deleteProfile(publicId);
          console.log(cleanupResult);
         if(cleanupResult.response.result==='ok') {
            await job.updateData({ 
                ...job.data, 
                status: JobStatus.CLEANED_UP
              });
            console.log(`Completed profile deletion on cloudinary for ${userId} and upload info:${cleanupResult}`)}
            else {
              throw new Error('Cleanup response not OK');
          }
        
        
      } catch (error) {
        console.error(`Cleanup job ${job.id} failed on attempt ${job.attemptsMade + 1}:`, error);

      // Re-throw the error to respect retry logic
      throw error;
      }
},{
  connection: redisConfig,
  attempts: 3, // Retry up to 3 times
  backoff: {
      type: 'exponential', // Exponential backoff
      delay: 5000 // 5 seconds initial delay
      }
})
 
cleanup_profile.on('completed',async(job)=>{
    console.log("All steps completed")
})

cleanup_profile.on('failed', async (job, err) => {
  console.error(`Cleanup job ${job.id} permanently failed after ${job.attemptsMade} attempts:`, err);

  const existingDlqJobs = await profile_cleanup_dlq.getJobs(['waiting', 'active']);
  const isDuplicate = existingDlqJobs.some(dlqJob => dlqJob.data.originalJob.id === job.id);

  if (!isDuplicate) {
      console.log(`Adding cleanup job ${job.id} to DLQ`);
      console.log(`jibId:${job.id}, JobName:${job.name}`)
      await profile_cleanup_dlq.add('failed-cleanup', {
          originalJobId: job.id, 
          originalJobName: job.name,
          originalJob: job.data,
          status: JobStatus.CLEANUP_PENDING,
          error: err.message
      });
  }

  // Update the job status
  await job.updateData({
      ...job.data,
      status: JobStatus.CLEANUP_PENDING,
      error: err.message
  });
  }); 

const cleanup_dlq_worker = new Worker('profile-cleanup-dlq', async job => {
    const { originalJob,originalJobId, originalJobName } = job.data;
    console.log(job.data);
    console.log(`jobId:${originalJobId}, JobName: ${originalJobName}`)
    try {
        // Send notification email about cleanup failure
        await sendEmail2({
            userId: originalJob.userId,
            publicId: originalJob.publicId,
            jobid:originalJobId, // Include original job ID
            jobname:originalJobName,
            // error: job.data.error,
            // status:job.data.status,
            // context: 'Profile Cleanup Failure'
    });

        // Mark job as processed
        await job.updateData({
            ...job.data,
            status: 'notification_sent'
        });
    } catch (notificationError) {
        console.error('Failed to send notification', notificationError);
        throw notificationError;
    }
},{connection: redisConfig });



//COURSE BASICS QUEUE AND WORKERS


const upload_course_basics=new Worker('course-basics-upload',async job=>{
    console.log(`Processing course upload job: ${job.id}, Attempt: ${job.attemptsMade + 1}`);
      const { 
        filePath, 
        resourceType,
        courseId,  
        uploadPath,
        publicId,
        status,
        to_delete
        } = job.data;
       
        try {
          // await job.updateData({ 
          //     ...job.data, 
          //     status: JobStatus.UPLOADING 
          //   });
          let uploadResult;
          console.log(`Started processing for course of ${courseId}`)
  
          if(to_delete){
            try{
              if(resourceType==='image'){
                const updated_course = await amber.course.update({
                where:{ id:courseId },
                data:{ imageUrl:null }})
              
              let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'thumbnail',JobStatus.UPDATED)
              console.log(set_value)
              }
              else if(resourceType==='video'){
              
              const updated_course = await amber.course.update({
                where:{ id:courseId },
                data:{ introvideo:null }})
              
                let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'introvideo',JobStatus.UPDATED)
                console.log(set_value)
              } 

              await job.updateData({ ...job.data, status: JobStatus.UPDATED});
              if(resourceType==='image'){
              console.log(`Completed uploading and updating thumbnail for ${courseId}`)}
              else if(resourceType==='video'){
                console.log(`Completed uploading and updating promo-video for ${courseId}`)}
             
            }catch(error){
              throw new Error('Database update failed')
            }
            
            // if (!updated_user) throw new Error('Database update failed');  
            
           
          }else{
            if(resourceType==='image'){ 
            uploadResult = await uploadThumbnail(filePath,uploadPath);
            if (!uploadResult) throw new Error('Upload failed');
           
            await job.updateData({ 
              ...job.data, 
              status: JobStatus.UPLOADED,
              secure_url:uploadResult.secure_url
            });
              console.log(uploadResult.secure_url)
              console.log(`Completed  thumbnail upload on cloudinary for ${courseId} and upload info:${uploadResult}`)
          }
            else if(resourceType==='video'){
            uploadResult = await uploadPromoVideo(filePath,uploadPath);
            if (!uploadResult) throw new Error('Upload failed');
           
            await job.updateData({ 
              ...job.data, 
              status: JobStatus.UPLOADED,
              secure_url:uploadResult.secure_url
            });
              console.log(uploadResult.secure_url)
              console.log(`Completed promo-video upload on cloudinary for ${courseId} and upload info:${uploadResult}`)
          }
           
            await job.updateData({ 
              ...job.data, 
              status: JobStatus.UPDATING,
              secure_url:uploadResult.secure_url
            });

          try{
              if(resourceType==='image'){
                const updated_course = await amber.course.update({
                where:{ id:courseId },
                data:{ imageUrl:uploadResult.secure_url }})
                
                let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'thumbnail',JobStatus.UPDATED)
                console.log(set_value)
              }
              else if(resourceType==='video'){
              
              const updated_course = await amber.course.update({
                where:{ id:courseId },
                data:{ introvideo:uploadResult.secure_url }})
              
                let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'introvideo',JobStatus.UPDATED)
                console.log(set_value)
              } 
            }catch(error){
              throw new Error('Database update failed')
            }
            
            // if (!updated_user) throw new Error('Database update failed');  
            
            await job.updateData({ ...job.data, status: JobStatus.UPDATED});
            if(resourceType==='image'){
            console.log(`Completed uploading and updating thumbnail for ${courseId}`)}
            else if(resourceType==='video'){
              console.log(`Completed uploading and updating promo-video for ${courseId}`)}
            }
          
        } catch (error) {
          if (error.message.includes('Database update failed')) {
            throw error; // Retry logic will handle this
        }
  
        // For other errors (e.g., upload failure), set the job status to FAILED
        if(resourceType==='image'){
        
          let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'thumbnail',JobStatus.FAILED)
          console.log(set_value)
        }
        else if(resourceType==='video'){
          let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'introvideo',JobStatus.FAILED)
          console.log(set_value)
        }
        await job.updateData({
            ...job.data,
            status: JobStatus.FAILED,
            error: error.message
        });
  
        // Re-throw the error to respect retry logic
        throw error;
        } 
  },{
    connection: redisConfig,
      attempts: 3, // Retry up to 3 times
      backoff: {
          type: 'exponential', // Exponential backoff
          delay: 5000 // 5 seconds initial delay
          }
    })
  
  
upload_course_basics.on('completed',async(job)=>{
      console.log(job.id)
      console.log(job.data);
      const { 
          courseId,  
          publicId,
          resourceType,
          uploadPath
        } = job.data;
      console.log("control reached to adding to cleanup queue")
      if(publicId){
      if(resourceType==='image')  {
      await course_basics_cleanup.add(`cleanup-thumbnail-${courseId}`,{
        courseId,
        publicId,
        resourceType,
        uploadPath,
        status:'cleanup_pending'
      })}
      else if(resourceType==='video'){
        await course_basics_cleanup.add(`cleanup-promo-${courseId}`,{
          courseId,
          publicId,
          resourceType,
          uploadPath,
          status:'cleanup_pending'
        })
      }
    }
      else{
          console.log("No previous records to delete")
      }
  
  })
  
upload_course_basics.on('failed', async (job, err) => {
      console.error('Upload job failed:', err);
  
    if (err.message.includes('Database update failed')) {
      console.log(`Adding job ${job.id} to DLQ due to database update failure`);
      if(job.data.resourceType==='image'){
      await course_basics_upload_dlq.add('failed-database-thumbnail-update', {
          originalJobId: job.id, 
          originalJobName: job.name, 
          originalJob: job.data,
          error: err.message
      });}
      else if(job.data.resourceType==='video'){
        await course_basics_upload_dlq.add('failed-database-promo-update', {
          originalJobId: job.id, 
          originalJobName: job.name, 
          originalJob: job.data,
          error: err.message
      });
      }
  } else {
      // For other errors, ensure the job status is set to FAILED
      if(resourceType==='image'){
        let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'thumbnail',JobStatus.FAILED)
        console.log(set_value)
      }
      else if(resourceType==='video'){
        let set_value=await redisClient.hSet(`courses:${courseId}:basics:job`,'introvideo',JobStatus.FAILED)
        console.log(set_value)
      }
      await job.updateData({
          ...job.data,
          status: JobStatus.FAILED,
          error: err.message
      });
  }
    });
  
const dlq_course_basics_upload= new Worker('course-basics-upload-dlq', async job => {
      const { originalJobId,originalJobName,originalJob, error } = job.data;
      console.log(originalJob)
      try {
          // Attempt to send email or notification about failed database update
          await databaseErrormail({
            errormsg:error,
            jobid:originalJobId,
            jobname:originalJobName,
            imageUrl:originalJob.secure_url,
            courseId:originalJob.courseId,
            publicId:originalJob.publicId,
            resourceType:originalJob.resourceType,
            uploadPath:originalJob.uploadPath
          });
  
          // Mark job as processed
          await job.updateData({
              ...job.data,
              status: 'notification_sent'
          });
      } catch (notificationError) {
          // If notification fails, keep the job in DLQ
          console.error('Failed to send notification', notificationError);
          throw notificationError;
      }
  }, { connection: redisConfig });
  
  
const cleanup_course_basics  =new Worker('course-basics-cleanup',async job=>{
      console.log(`Processing cleanup job: ${job.id}, Attempt: ${job.attemptsMade + 1}`);
      const{
          courseId,
          publicId,
          uploadPath,
          resourceType,
          status
      }=job.data
      try {
          // await job.updateData({ 
          //     ...job.data, 
          //     status: JobStatus.CLEANUP_PENDING 
          //   });
          let cleanupResult;
          if(resourceType==='image'){
          console.log(`Started deletion for thumbnail of ${courseId}`)}
          else if(resourceType==='video'){
            console.log(`Started deletion for promo-video of ${courseId}`)
          }
          
          if (!publicId) {
            throw new Error('Public Id not provided');
        }
            if(resourceType==='image'){
            cleanupResult = await deleteProfile(publicId);
            console.log(cleanupResult);
            if(cleanupResult.response.result==='ok') {
              await job.updateData({ 
                  ...job.data, 
                  status: JobStatus.CLEANED_UP
                });
                console.log(`Completed thumnail deletion on cloudinary for ${courseId} and upload info:${cleanupResult}`)
          }
          else {
            throw new Error('Cleanup response not OK');
        }
          
        }
            else if(resourceType==='video'){
              cleanupResult= await deletePromo(publicId)
              console.log(cleanupResult)
              if(cleanupResult.result==='ok') {
                await job.updateData({ 
                    ...job.data, 
                    status: JobStatus.CLEANED_UP
                  });
                  console.log(`Completed promo-video deletion on cloudinary for ${courseId} and upload info:${cleanupResult}`)
              }
              else {
                throw new Error('Cleanup response not OK');
            }
             
            }
              
          
          
        } catch (error) {
          console.error(`Cleanup job ${job.id} failed on attempt ${job.attemptsMade + 1}:`, error);
  
        // Re-throw the error to respect retry logic
        throw error;
        }
  },{
    connection: redisConfig,
    attempts: 3, // Retry up to 3 times
    backoff: {
        type: 'exponential', // Exponential backoff
        delay: 5000 // 5 seconds initial delay
        }
  })
   
cleanup_course_basics.on('completed',async(job)=>{
      console.log("All steps completed")
  })
  
cleanup_course_basics.on('failed', async (job, err) => {
    console.error(`Cleanup job ${job.id} permanently failed after ${job.attemptsMade} attempts:`, err);
  
    if (err.message.includes('Cleanup response not OK')) {
      console.log(`Adding job ${job.id} to DLQ due to cleanup failure`);
  
    
        console.log(`Adding cleanup job ${job.id} to DLQ`);
        console.log(`jobId:${job.id}, JobName:${job.name}`)
        await course_basics_cleanup_dlq.add('failed-cleanup', {
            originalJobId: job.id, 
            originalJobName: job.name,
            originalJob: job.data,
            status: JobStatus.CLEANUP_PENDING,
            error: err.message
        });
    }
  
    // Update the job status
    await job.updateData({
        ...job.data,
        status: JobStatus.CLEANUP_PENDING,
        error: err.message
    });
    }); 
  
const dlq_course_basics_cleanup = new Worker('course-basics-cleanup-dlq', async job => {
      const { originalJob,originalJobId, originalJobName ,error} = job.data;
      console.log(job.data);
      console.log(`jobId:${originalJobId}, JobName: ${originalJobName}`)
      try {
          // Send notification email about cleanup failure
          await cleanupErrormail({
            errormsg:error,
            jobid:originalJobId,
            jobname:originalJobName,
            courseId:originalJob.courseId,
            publicId:originalJob.publicId,
            resourceType:originalJob.resourceType,
            uploadPath:originalJob.uploadPath
      });
  
          // Mark job as processed
          await job.updateData({
              ...job.data,
              status: 'notification_sent'
          });
      } catch (notificationError) {
          console.error('Failed to send notification', notificationError);
          throw notificationError;
      }
  },{connection: redisConfig });

export{
    course_basics_upload,
    profile_upload,
}