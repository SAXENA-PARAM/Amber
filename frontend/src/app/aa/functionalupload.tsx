'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface VideoUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  message?: string;
}

interface Subtopic {
  id: string;
  name: string;
  videoFile: File | null;
  videoUrl?: string;
  publicId?: string;
  duration?: number;
  videoDescription: string;
  uploadProgress?: VideoUploadProgress;
}

interface Chapter {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

interface CourseDetails {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  prerequisites: string;
  price: string;
  promoVideoUrl: string;
  thumbnailUrl: string;
  bannerUrl: string;
}

export default function CourseUpload({ className }: { className?: string }) {
  const [courseId, setCourseId] = useState<string>('');
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    prerequisites: '',
    price: '',
    promoVideoUrl: '',
    thumbnailUrl: '',
    bannerUrl: ''

  });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedPromoVideo, setSelectedPromoVideo] = useState<File | null>(null);
  const [promoUploadProgress, setPromoUploadProgress] = useState<VideoUploadProgress>({
    progress: 0,
    status: 'idle'
  });

  const createCourse = async () => {
    try {
      const response = await axios.post('http://localhost:5002/create-course', courseDetails);
      setCourseId(response.data.courseId);
      return response.data.courseId;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  };

  const saveCourseStructure = async (courseId: string) => {
    try {
      await axios.post('http://localhost:5002/save-course-structure', {
        courseId,
        chapters
      });
    } catch (error) {
      console.error('Error saving course structure:', error);
      throw error;
    }
  };

  const handlePromoVideoUpload = async (file: File) => {
    if (!courseId) {
      try {
        const newCourseId = await createCourse();
        setCourseId(newCourseId);
      } catch (error) {
        console.error('Error creating course before promo upload:', error);
        return;
      }
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('courseId', courseId);
    formData.append('courseName', courseDetails.name);

    setPromoUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const response = await axios.post('http://localhost:5002/upload-promo-video', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setPromoUploadProgress({
            progress,
            status: 'uploading',
            message: `Uploading: ${progress}%`
          });
        }
      });

      setPromoUploadProgress({
        progress: 100,
        status: 'completed',
        message: 'Upload complete!'
      });

      console.log('Promo video uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading promo video:', error);
      setPromoUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Upload failed!'
      });
    }
  };
  const handleThumbnailUpload = async (file: File) => {
    if(!courseId){
      try {
        const newCourseId = await createCourse();
        setCourseId(newCourseId);
      } catch (error) {
        console.error('Error creating course before thumbnail upload:', error);
        return;
      }
    }
    const formData = new FormData();
    formData.append('thumbnail', file);
    formData.append('courseId', courseId);
    formData.append('courseName', courseDetails.name);

    setPromoUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const response = await axios.post('http://localhost:5002/upload-thumbnail', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setPromoUploadProgress({
            progress,
            status: 'uploading',
            message: `Uploading: ${progress}%`
          });
        }
      });

      setPromoUploadProgress({
        progress: 100,
        status: 'completed',
        message: 'Upload complete!'
      });
      console.log('Thumbnail uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      setPromoUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Upload failed!'
      });
    }
  };

  const handleBannerUpload = async (file: File) => {
    if(!courseId){
      try {
        const newCourseId = await createCourse();
        setCourseId(newCourseId);
      } catch (error) {
        console.error('Error creating course before banner upload:', error);
        return;
      }
    }
    const formData = new FormData();
    formData.append('banner', file);
    formData.append('courseId', courseId);
    formData.append('courseName', courseDetails.name);

    setPromoUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const response = await axios.post('http://localhost:5002/upload-banner', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setPromoUploadProgress({
            progress,
            status: 'uploading',
            message: `Uploading: ${progress}%`
          });
        }
      });

      setPromoUploadProgress({
        progress: 100,
        status: 'completed',
        message: 'Upload complete!'
      });
      console.log('Banner uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading banner:', error);
      setPromoUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Upload failed!'
      });
    }
  }

  const handleSubtopicVideoUpload = async (
    chapterId: string,
    subtopicId: string,
    file: File
  ) => {
    if (!courseId) {
      try {
        const newCourseId = await createCourse();
        setCourseId(newCourseId);
      } catch (error) {
        console.error('Error creating course before video upload:', error);
        return;
      }
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('courseId', courseId);
    formData.append('courseName', courseDetails.name);
    formData.append('chapterId', chapterId);
    formData.append('subtopicId', subtopicId);
    

    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? {
          ...chapter,
          subtopics: chapter.subtopics.map(subtopic =>
            subtopic.id === subtopicId
              ? {
                ...subtopic,
                uploadProgress: { progress: 0, status: 'uploading' }
              }
              : subtopic
          )
        }
        : chapter
    ));

    try {
      const response = await axios.post('http://localhost:5002/upload-subtopic-video', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setChapters(prev => prev.map(chapter =>
            chapter.id === chapterId
              ? {
                ...chapter,
                subtopics: chapter.subtopics.map(subtopic =>
                  subtopic.id === subtopicId
                    ? {
                      ...subtopic,
                      uploadProgress: {
                        progress,
                        status: 'uploading',
                        message: `Uploading: ${progress}%`
                      }
                    }
                    : subtopic
                )
              }
              : chapter
          ));
        }
      });

      setChapters(prev => prev.map(chapter =>
        chapter.id === chapterId
          ? {
            ...chapter,
            subtopics: chapter.subtopics.map(subtopic =>
              subtopic.id === subtopicId
                ? {
                  ...subtopic,
                  videoUrl: response.data.videoUrl,
                  publicId: response.data.publicId,
                  duration: response.data.duration,
                  uploadProgress: {
                    progress: 100,
                    status: 'completed',
                    message: 'Upload complete!'
                  }
                }
                : subtopic
            )
          }
          : chapter
      ));

      console.log('Subtopic video uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading subtopic video:', error);
      setChapters(prev => prev.map(chapter =>
        chapter.id === chapterId
          ? {
            ...chapter,
            subtopics: chapter.subtopics.map(subtopic =>
              subtopic.id === subtopicId
                ? {
                  ...subtopic,
                  uploadProgress: {
                    progress: 0,
                    status: 'error',
                    message: 'Upload failed!'
                  }
                }
                : subtopic
            )
          }
          : chapter
      ));
    }
  };

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      name: `Chapter ${chapters.length + 1}`,
      subtopics: []
    };
    setChapters(prev => [...prev, newChapter]);
  }, [chapters.length]);

  const addSubtopic = useCallback((chapterId: string) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? {
          ...chapter,
          subtopics: [
            ...chapter.subtopics,
            {
              id: `subtopic-${Date.now()}`,
              name: `Subtopic ${chapter.subtopics.length + 1}`,
              videoFile: null,
              videoDescription: ''
            }
          ]
        }
        : chapter
    ));
  }, []);

  const updateChapterName = useCallback((chapterId: string, name: string) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, name }
        : chapter
    ));
  }, []);

  const updateSubtopicName = useCallback((chapterId: string, subtopicId: string, name: string) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? {
          ...chapter,
          subtopics: chapter.subtopics.map(subtopic =>
            subtopic.id === subtopicId
              ? { ...subtopic, name }
              : subtopic
          )
        }
        : chapter
    ));
  }, []);

  const updateSubtopicDescription = useCallback((
    chapterId: string,
    subtopicId: string,
    description: string
  ) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? {
          ...chapter,
          subtopics: chapter.subtopics.map(subtopic =>
            subtopic.id === subtopicId
              ? { ...subtopic, videoDescription: description }
              : subtopic
          )
        }
        : chapter
    ));
  }, []);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!courseId) {
        const newCourseId = await createCourse();
        setCourseId(newCourseId);
        await saveCourseStructure(newCourseId);
      } else {
        await saveCourseStructure(courseId);
      }
      console.log('Course structure saved successfully!');
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  return (
    <div className={cn("p-6 text-slate-500", className)}>
       <div className="space-y-4">
        <p className='text -4xl font-bold'>UPLOAD YOUR COURSES ON OUR PLATFORM</p>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Your course landing page is crucial to your success. If it's done right, it can also help you gain visibility in search engines.
          </p>
        </div>
      <form onSubmit={handleCourseSubmit} className='space-y-6'>
        <div>
          <label className=" font-medium mb-1">Course Title</label>
          <input
            type="text"
            value={courseDetails.name}
            onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
            required
          />
           <p className="text-sm text-gray-500 mt-1">
              Your title should be a mix of attention-grabbing, informative, and optimized for search
            </p>
        </div>


        <div className=''>
          <label>Course Description</label>
          <textarea
            value={courseDetails.description}
            onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
            required
          />
          <p className='text-sm'>Give basic information about your course here,you re recommended to giv around 200 words</p>
        </div>

        <div>



        



          <h3>Chapters</h3>
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <div>
                <label>Chapter Name</label>
                <input
                  type="text"
                  value={chapter.name}
                  onChange={(e) => updateChapterName(chapter.id, e.target.value)}
                />
              </div>

              <div>
                <h4>Subtopics</h4>
                {chapter.subtopics.map((subtopic) => (
                  <div key={subtopic.id}>
                    <div>
                      <label>Subtopic Name</label>
                      <input
                        type="text"
                        value={subtopic.name}
                        onChange={(e) => updateSubtopicName(chapter.id, subtopic.id, e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Subtopic Description</label>
                      <textarea
                        value={subtopic.videoDescription}
                        onChange={(e) =>
                          updateSubtopicDescription(chapter.id, subtopic.id, e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label>Subtopic Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files && handleSubtopicVideoUpload(
                          chapter.id,
                          subtopic.id,
                          e.target.files[0]
                        )}
                      />
                      {subtopic.uploadProgress?.status === 'uploading' && (
                        <p>{subtopic.uploadProgress.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addSubtopic(chapter.id)}>Add Subtopic</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addChapter}>Add Chapter</button>
        </div>

        <div>
          <h3>Promo Video</h3>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files && handlePromoVideoUpload(e.target.files[0])}
          />
          {promoUploadProgress.status === 'uploading' && (
            <p>{promoUploadProgress.message}</p>
          )}
        </div>

          <div>
            <h3>Thumbnail</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])}
              />
            {promoUploadProgress.status === 'uploading' && (
              <p>{promoUploadProgress.message}</p>
            )}
          </div>

          <div>
            <h3>Banner</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleBannerUpload(e.target.files[0])}
              />
            {promoUploadProgress.status === 'uploading' && (
              <p>{promoUploadProgress.message}</p>
            )}
            </div>


        <button type="submit">Submit Course</button>
      </form>
    </div>
    </div>
  );
}