// course-upload.tsx

'use client';

import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Plus, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseDetails {
  name: string;
  description: string;
  category: string;
  price: string;
  courseId: string; // Add courseId for the upload
}

export default function CourseUpload({ className }: { className?: string }) {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: '',
    description: '',
    category: '',
    price: '',
    courseId: '',
  });
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const handleInputChange = (field: keyof CourseDetails, value: string) => {
    setCourseDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedVideos(Array.from(e.target.files));
    }
  };

  const uploadVideos = async () => {
    const formData = new FormData();
    formData.append('courseId', courseDetails.courseId); // Assuming courseId is set
    selectedVideos.forEach((video) => {
      formData.append('videos', video);
    });

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error uploading videos:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto p-8 space-y-8 text-black bg-blue-100 z-10", className)}>
      <div className="space-y-4">
        <p className='text-4xl font-bold'>UPLOAD YOUR COURSES ON OUR PLATFORM</p>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Your course landing page is crucial to your success. If it's done right, it can also help you gain visibility in search engines.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your title should be a mix of attention-grabbing, informative, and optimized for search
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course Description</label>
            <textarea
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Description should have minimum 200 words
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1"> Upload Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2">
              {selectedVideos.map((video, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{video.name}</span>
                  <button
                    className="text-red-500 hover:bg-red-50 rounded"
                    onClick={() => setSelectedVideos(prev => prev.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={uploadVideos}
          >
            <Plus className="mr-2 h-4 w-4" /> Upload Videos
          </button>
        </div>
      </div>
    </div>
  );
} 