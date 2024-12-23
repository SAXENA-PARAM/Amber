"use client";

import React from "react";
import CourseInfo from "@/components/course-info";

const Page = () => {
  const data = {
    imageUrl: "https://img.freepik.com/free-vector/hand-drawn-online-college-template-design_23-2150574179.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid",
    title: "Front-End Web Development",
    description: "Introduction to HTML, CSS basics, and JavaScript fundamentals.",
    prerequisites: [
      "Basic understanding of programming",
      "Knowledge of JavaScript or TypeScript",
      "Familiarity with React framework",
      "Ability to work with APIs",
      "Experience with version control systems like Git",
      "Understanding of asynchronous programming concepts",
      "Familiarity with HTML and CSS basics",
      "Knowledge of RESTful API design",
      "Ability to debug and troubleshoot code issues",
      "Understanding of functional programming principles",
      "Familiarity with state management libraries like Redux or Context API",
      "Basic knowledge of Node.js for backend integration",
      "Experience with modern build tools like Webpack or Vite",
      "Knowledge of testing frameworks like Jest or Cypress",
      "Ability to follow coding standards and best practices",
    ],
    introvideo: "https://youtu.be/EH3vGeqeIAo?si=cvgMp8xKYNVtfUGT",
    price: 49.99,
  };

  return (
    <div>
      <CourseInfo {...data} />
    </div>
  );
};

export default Page;
