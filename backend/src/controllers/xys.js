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
  
      // Validation functions
      const validateBasicData = (data) => {
        const errors = [];
        if (data.price && isNaN(parseInt(data.price))) {
          errors.push("Price must be a valid number");
        }
        if (data.validityPeriod && isNaN(parseInt(data.validityPeriod))) {
          errors.push("Validity period must be a valid number");
        }
        return errors;
      };
  
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
  
      // Validate basic course data
      const basicDataErrors = validateBasicData(req.body);
      if (basicDataErrors.length > 0) {
        throw new ApiError(400, `Validation failed: ${basicDataErrors.join(', ')}`);
      }
  
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
              `courses/${courseId}/thumbnail`
            );
            uploadedFiles.imageUrl = courseUpdateData.imageUrl;
          }
  
          // Handle banner upload
          if (req.files.banner) {
            filesToDelete.banner = existingCourse.banner;
            courseUpdateData.banner = await uploadBanner(
              req.files.banner[0],
              `courses/${courseId}/banner`
            );
            uploadedFiles.banner = courseUpdateData.banner;
          }
  
          // Handle intro video upload
          if (req.files.introvideo) {
            filesToDelete.introvideo = existingCourse.introvideo;
            courseUpdateData.introvideo = await uploadPromoVideo(
              req.files.introvideo[0],
              `courses/${courseId}/promo`
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
              courseId
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
              section: { courseId }
            }
          });
        }
  
        // 5. Handle section updates
        for (const section of sectionsToUpdate) {
          await amber.section.update({
            where: {
              id: section.id,
              courseId
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