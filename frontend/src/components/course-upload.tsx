'use client'

import { useState } from 'react'
import { Bold, Italic, List, ListOrdered, Plus, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subtopic {
  id: string
  name: string
  videoFile: File | null
  videoDescription: string
  subtitleFile: File | null
  notesFile: File | null
}

interface Chapter {
  id: string
  name: string
  subtopics: Subtopic[]
}

interface CourseDetails {
  name: string
  description: string
  imageUrl: string
  promoVideoUrl: string
  category: string
  subCategory: string
  prerequisites: string
  price: string
}

export default function CourseUpload({ className }: { className?: string }) {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: '',
    description: '',
    imageUrl: '',
    promoVideoUrl: '',
    category: '',
    subCategory: '',
    prerequisites: '',
    price: ''
  })
  const [chapters, setChapters] = useState<Chapter[]>([])

  // State for selected files
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [selectedPromoVideo, setSelectedPromoVideo] = useState<File | null>(null);

  const updateCourseDetails = (field: keyof CourseDetails, value: string) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }))
  }

  const addChapter = () => {
    setChapters([...chapters, { id: Date.now().toString(), name: '', subtopics: [] }])
  }

  const addSubtopic = (chapterId: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: [...chapter.subtopics, { id: Date.now().toString(), name: '', videoFile: null, videoDescription: '', subtitleFile: null, notesFile: null }] }
        : chapter
    ))
  }

  const updateChapter = (id: string, name: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === id ? { ...chapter, name } : chapter
    ))
  }

  const updateSubtopic = (chapterId: string, subtopicId: string, updates: Partial<Subtopic>) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: chapter.subtopics.map(subtopic => 
            subtopic.id === subtopicId ? { ...subtopic, ...updates } : subtopic
          ) }
        : chapter
    ))
  }

  const removeChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id))
  }

  const removeSubtopic = (chapterId: string, subtopicId: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: chapter.subtopics.filter(subtopic => subtopic.id !== subtopicId) }
        : chapter
    ))
  }

  // File selection handlers
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedThumbnail(e.target.files[0]);
      updateCourseDetails('imageUrl', URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedBanner(e.target.files[0]);
    }
  };

  const handlePromoVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedPromoVideo(e.target.files[0]);
    }
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    updateCourseDetails('imageUrl', '');
  };

  const removeBanner = () => {
    setSelectedBanner(null);
  };

  const removePromoVideo = () => {
    setSelectedPromoVideo(null);
  };

  return (
    <div className={cn("max-w-4xl mx-auto p-8 space-y-8 text-black bg-blue-100 z-10", className)}>
      <div className="space-y-4">
        <p className='text -4xl font-bold'>UPLOAD YOUR COURSES ON OUR PLATFORM</p>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Your course landing page is crucial to your success. If it's done right, it can also help you gain visibility in search engines.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Course title</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={courseDetails.name}
                onChange={(e) => updateCourseDetails('name', e.target.value)}
                maxLength={60}
              />
              <span className="absolute right-2 top-2 text-sm text-gray-400">
                {courseDetails.name.length}/60
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your title should be a mix of attention-grabbing, informative, and optimized for search
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course description</label>
            <div className="border rounded">
              <div className="flex gap-1 border-b p-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <List className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
              <textarea
                className="w-full p-2 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={courseDetails.description}
                onChange={(e) => updateCourseDetails('description', e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Description should have minimum 200 words
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={courseDetails.category}
                onChange={(e) => updateCourseDetails('category', e.target.value)}
              >
                <option value="">Select category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <textarea
                className="w-full p-2 min-h-[50px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={courseDetails.subCategory}
                onChange={(e) => updateCourseDetails('subCategory', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course Thumbnail image</label>
            <div className="border rounded p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4">
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  {selectedThumbnail ? (
                    <img
                      src={URL.createObjectURL(selectedThumbnail)}
                      alt="Course Thumbnail"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src="https://s.udemycdn.com/course/750x422/placeholder.jpg"
                      alt="Course preview"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </div>
              <div className=" flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Upload your course image here. It must meet our course image quality standards to be accepted.</p>
                  <p className="text-xs mt-1">Important guidelines: 750x422 pixels; .jpg, .jpeg, .gif, or .png.; no text on the image.</p>
                </div>
                {selectedThumbnail && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={removeThumbnail}>
                    Remove File
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Banner image</label>
            <div className="border rounded p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4">
                <label htmlFor="banner-upload" className="cursor-pointer">
                  {selectedBanner ? (
                    <img
                      src={URL.createObjectURL(selectedBanner)}
                      alt="Banner"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src="https://s.udemycdn.com/course/750x422/placeholder.jpg"
                      alt="Banner preview"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Upload your Banner here. It must meet quality standards to be accepted.</p>
                  <p className="text-xs mt-1">Important guidelines: 750x422 pixels; .jpg, .jpeg, .gif, or .png.; no text on the image.</p>
                </div>
                {selectedBanner && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={removeBanner}>
                    Remove File
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Promotional video</label>
            <div className="border rounded p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                {selectedPromoVideo ? (
                  <video controls className="w-full h-full object-cover rounded">
                    <source src={URL.createObjectURL(selectedPromoVideo)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                  
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Your promo video is a quick and compelling way for students to preview what they'll learn in your course.</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="promo-video-upload"
                  onChange={handlePromoVideoChange}
                />
                <label htmlFor="promo-video-upload" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                  Upload File
                </label>
                {selectedPromoVideo && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={removePromoVideo}>
                    Remove File
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prerequisites</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.prerequisites}
              onChange={(e) => updateCourseDetails('prerequisites', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.price}
              onChange={(e ) => updateCourseDetails('price', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        {chapters.map(chapter => (
          <div key={chapter.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <input
                placeholder="Chapter Name"
                className="p-2 border rounded w-full mr-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={chapter.name}
                onChange={(e) => updateChapter(chapter.id, e.target.value)}
              />
              <button 
                className="p-2 text-red-500 hover:bg-red-50 rounded" 
                onClick={() => removeChapter(chapter.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 mt-4">
              {chapter.subtopics.map(subtopic => (
                <div key={subtopic.id} className="p-4 border rounded bg-gray-50">
                  <div className="flex justify-between items-center">
                    <input
                      placeholder="Subtopic Name"
                      className="p-2 border rounded w-full mr-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={subtopic.name}
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { name: e.target.value })}
                    />
                    <button 
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => removeSubtopic(chapter.id, subtopic.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        className="w-full"
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoFile: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Video Description</label>
                      <textarea
                        placeholder="Video Description"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={subtopic.videoDescription}
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoDescription: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                className="w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
                onClick={() => addSubtopic(chapter.id)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Subtopic
              </button>
            </div>
          </div>
        ))}
        <button 
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          onClick={addChapter}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Chapter
        </button>
      </div>
      <button className='h-[5vh] w-[20vw] rounded mx-auto bg-blue-500 hover:bg-blue-900'>Sumbit</button>
    </div>
  )
}