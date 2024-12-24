import postmark from 'postmark'

// Send an email:
var client = new postmark.ServerClient("ab18f3ce-cba3-4947-9a49-79db14b88d56");

async function sendEmail({jobname,jobid,userId,cloudinaryUrl}) {
    try {
      console.log(`JobId:${jobid} JobName: ${jobname} , cloudinaryUrl: ${cloudinaryUrl} , userId:${userId}`)
      const response = await client.sendEmailWithTemplate({
        From:process.env.SENDER_EMAIL,
        To: process.env.RECEIVER_EMAIL,
        TrackOpens:true,
        
        // HtmlBody: "<strong>Hello</strong> dear Postmark user.",
        // TextBody: "Hello from Postmark!",
        TemplateId: process.env.TEMPLATE_ID,
        TemplateModel: {
          product_url: "https://amber.com",
          product_name: jobid,
          name: userId,
          company_name: jobname,
          action_url: cloudinaryUrl,
          login_url: "https://google.com",
          username: "PARAM07",
          trial_length: "1 Year",
          trial_start_date: new Date(),
          trial_end_date:new Date(),
          support_email: process.env.RECEIVER_EMAIL,
          sender_name: "AMBER limited",
          company_address: "DUBAI Burj Khalifa"
        },
        MessageStream: "outbound",
        
      });
  
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
 
async function sendEmail2({jobname,jobid,userId,publicId}) {
    try {
      console.log(`JobId:${jobid} JobName: ${jobname} , PublidId: ${publicId} , userId:${userId}`)
      const response = await client.sendEmailWithTemplate({
        From:process.env.SENDER_EMAIL,
        To: process.env.RECEIVER_EMAIL,
        TrackOpens:true,
        
        // HtmlBody: "<strong>Hello</strong> dear Postmark user.",
        // TextBody: "Hello from Postmark!",
        TemplateId: process.env.TEMPLATE_ID,
        TemplateModel: {
          product_url: "https://amber.com",
          product_name: String(jobid),
          name: String(userId),
          company_name: String(jobname),
          action_url: String(publicId),
          login_url: "https://google.com",
          username: "PARAM07",
          trial_length: "1 Year",
          trial_start_date: new Date(),
          trial_end_date:new Date(),
          support_email: process.env.RECEIVER_EMAIL,
          sender_name: "AMBER limited",
          company_address: "DUBAI Burj Khalifa"
        },
        MessageStream: "outbound",
        
      });
  
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }  
  // Call the async function

async function databaseErrormail({errormsg,jobid,jobname,imageUrl,courseId,publicId,resourceType,uploadPath}){
  try{
    console.log(`JobId:${jobid} JobName: ${jobname} , PublidId: ${publicId} , courseId:${courseId}, ImageUrl:${imageUrl} , UploadPath:${uploadPath}`) 
  const response=await client.sendEmailWithTemplate({
    "From":process.env.SENDER_EMAIL,
    "To": process.env.RECEIVER_EMAIL,
    "TemplateAlias": process.env.DATABASE_ERROR_ALIAS,
    "TemplateModel": {
     "product_url": "http://amber.com",
    "product_name": "AMBER",
    "error_message": String(errormsg),
    "jobid": String(jobid),
    "jobname": String(jobname),
    "resource_type_data": String(resourceType),
    "failed_data": String(imageUrl),
    "database_table": `Course : ${courseId}`,
    "public_id": String(publicId),
    "upload_path": String(uploadPath),
    "support_email":process.env.SENDER_EMAIL,
    "support_phone": "6261******",
    "timestamp": String(new Date()),
    "company_name": "AMBER limited",
    "company_address": "200 Park Avenue, Manhattan, New York",
    "name": "name_Value",
    "action_url": "action_url_Value",
    "operating_system": "operating_system_Value",
    "browser_name": "browser_name_Value",
    "support_url": "support_url_Value"
    }
  });
  console.log("Email sent successfully:", response);
} catch (error) {
  console.error("Error sending email:", error);
}
} 

async function cleanupErrormail({errormsg,jobid,jobname,courseId,publicId,resourceType,uploadPath}){
  try{
    console.log(`JobId:${jobid} JobName: ${jobname} , PublidId: ${publicId} , courseId:${courseId}, PublicID:${publicId} , UploadPath:${uploadPath}`)
    const response=client.sendEmailWithTemplate({
      "From":process.env.SENDER_EMAIL,
      "To": process.env.RECEIVER_EMAIL,
      "TemplateAlias": process.env.CLEANUP_ERROR_ALIAS,
      "TemplateModel": {
        "product_url": "http://amber.com",
        "product_name": "AMBER",
        "error_message": String(errormsg),
        "jobid": String(jobid),
        "jobname": String(jobname),
        "courseId": String(courseId),
        "resourceType": String(resourceType),
        "uploadPath": String(uploadPath),
        "existing_public_id": String(publicId),
        "timestamp": "timestamp_Value",
        "database_table": "Course",
        "support_email":process.env.SENDER_EMAIL,
        "support_phone": "6261******",
        "company_name": "AMBER limited",
        "company_address": "200 Park Avenue, Manhattan, New York"
      }
    });
  console.log("Email sent successfully:", response);
} catch (error) {
  console.error("Error sending email:", error);
}
} 

export{
    sendEmail,
    sendEmail2,
    databaseErrormail,
    cleanupErrormail
 } 