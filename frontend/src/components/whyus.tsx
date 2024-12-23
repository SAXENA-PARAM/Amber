"use client";
import React from "react";

const WhyUs = () => {
  return (
    <div className="bg-black text-white py-20 px-4">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
        Why Choose Us?
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Comprehensive Learning</h3>
          <p>
            Our platform offers a wide range of courses covering various topics, ensuring that you have access to the best educational resources. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Interactive Experience</h3>
          <p>
            We provide interactive lessons and engaging activities that make learning enjoyable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Expert Instructors</h3>
          <p>
            Our courses are designed and taught by industry experts who are passionate about sharing their knowledge. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Flexible Learning</h3>
          <p>
            Learn at your own pace with our flexible scheduling options that fit your lifestyle. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel urna eget mi placerat vestibulum.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Affordable Pricing</h3>
          <p>
            We believe in making education accessible, which is why we offer competitive pricing for our courses. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Community Support</h3>
          <p>
            Join a thriving community of learners and educators who are here to support you on your journey. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
