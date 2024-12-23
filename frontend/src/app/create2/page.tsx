"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
interface CourseDetails {
  name: string;
  description: string;
  imageUrl: string;
  promoVideoUrl: string;
  category: string;
  subCategory: string;
  prerequisites: string;
  price: string;
}

const Page = () => {
  const [selectedPromoVideo, setSelectedPromoVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: "",
    description: "",
    imageUrl: "",
    promoVideoUrl: "",
    category: "",
    subCategory: "",
    prerequisites: "",
    price: "",
  });

  const updateCourseDetails = (field: keyof CourseDetails, value: string) => {
    setCourseDetails((prev) => ({ ...prev, [field]: value }));
  };
  const handlePromoVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedPromoVideo(e.target.files[0]);
    }
  };

  const removePromoVideo = () => {
    setSelectedPromoVideo(null);
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedThumbnail(e.target.files[0]);
      updateCourseDetails("imageUrl", URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    updateCourseDetails("imageUrl", "");
  };


  
  return (
    <div>
      <div>
        Tell us more about your course, give detailed description of your course here.
      </div>
      <div>
        <input
          type="text"
          className="w-[70vw] h-[50vh]"
          placeholder="Description"
          value={courseDetails.description}
          onChange={(e) => updateCourseDetails("description", e.target.value)}
        />
      </div>
      <div>
        Tell us what can a student learn after completing your course (at least 3)
      </div>
      <div className="flex flex-col w-[70vw]">
        <label>1.</label>
        <input
          type="text"
          className="h-8"
          placeholder="Learning 1"
          // Add appropriate state logic for these inputs if needed
        />
        <label>2.</label>
        <input type="text" className="h-8" placeholder="Learning 2" />
        <label>3.</label>
        <input type="text" className="h-8" placeholder="Learning 3" />
        <button>Add more</button>
      </div>

      <div>
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>
                  Upload your course image here. It must meet our course image quality standards to
                  be accepted.
                </p>
                <p className="text-xs mt-1">
                  Important guidelines: 750x422 pixels; .jpg, .jpeg, .gif, or .png.; no text on the
                  image.
                </p>
              </div>
              {selectedThumbnail && (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={removeThumbnail}
                >
                  Remove File
                </button>
              )}
            </div>
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
        <button className="bg-blue-500 px-5 py-2 m-10">Back</button>
        <button className="bg-blue-500 px-5 py-2 m-10">Continue</button>
      </div>
    </div>
  );
};

export default Page;
