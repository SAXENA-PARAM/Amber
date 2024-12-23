"use client";

import React from "react";
import CourseInfo from "@/components/course-info";

const Page = () => {
  const data = [
    {
      imageUrl: "https://img.freepik.com/free-vector/flat-design-dance-school-youtube-thumbnail_23-2149405718.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid",
      title: "Graphic Design Essentials",
      description: "Learn the fundamentals of graphic design, including color theory and typography.",
      prerequisites: [
        "Basic computer skills",
        "Familiarity with design tools like Canva or Photoshop",
        "Understanding of color theory",
        "Knowledge of typography principles",
        "Ability to work with layers in design software",
        "Creativity and attention to detail",
        "Experience with vector graphics is a plus",
      ],
      introvideo: "https://youtu.be/tVzUXW6siu0?si=j6Uejo8VCT2_z_mw",
      price: 39.99,
    },
    {
      imageUrl: "https://img.freepik.com/free-vector/flat-design-business-workshop-geometric-youtube-thumbnail_23-2149406372.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid",
      title: "Data Science Bootcamp",
      description: "Master data analysis, visualization, and machine learning concepts.",
      prerequisites: [
        "Proficiency in Python programming",
        "Basic understanding of statistics",
        "Knowledge of data structures and algorithms",
        "Familiarity with data visualization libraries like Matplotlib or Seaborn",
        "Experience with machine learning libraries like Scikit-learn",
      ],
      introvideo: "https://youtu.be/fUmSkEvet08?si=KHyMAQ_LQmmPmAEp",
      price: 99.99,
    },
    {
      imageUrl: "https://img.freepik.com/free-vector/online-english-lessons-youtube-channel-art_23-2149291127.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid",
      title: "Mobile App Development",
      description: "Build your first mobile app using React Native and Firebase.",
      prerequisites: [
        "Basic JavaScript knowledge",
        "Familiarity with React",
        "Understanding of mobile app architecture",
        "Experience with debugging tools",
        "Knowledge of Firebase services like Firestore",
      ],
      introvideo: "https://youtu.be/6R0TkF6Mgrk?si=1-uJviTvX0Ulij2U",
      price: 79.99,
    },
    {
      imageUrl: "https://img.freepik.com/free-psd/e-learning-concept-banner-template_23-2148688187.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid",
      title: "Cybersecurity Fundamentals",
      description: "Learn how to secure systems and prevent cyber threats.",
      prerequisites: [
        "Understanding of computer networks",
        "Basic knowledge of operating systems",
        "Familiarity with programming languages like Python",
        "Awareness of cybersecurity threats",
        "Knowledge of encryption and hashing",
      ],
      introvideo: "https://youtu.be/efam9B6VKwo?si=CY_kpx_eK1H9dNZt",
      price: 59.99,
    },
    {
      imageUrl: "https://img.freepik.com/free-psd/world-population-day-youtube-cover-template_23-2150445823.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid",
      title: "Blockchain Basics",
      description: "Discover the technology behind cryptocurrencies and smart contracts.",
      prerequisites: [
        "Basic programming skills",
        "Understanding of distributed systems",
        "Knowledge of cryptographic principles",
        "Familiarity with blockchain platforms like Ethereum",
        "Interest in decentralized applications (DApps)",
      ],
      introvideo: "https://youtu.be/Hb9QvSODBPY?si=2H4Sg6TtwcuZkEy2",
    },
  ];

  const randomData = data[Math.floor(Math.random() * data.length)];

  return (
    <div>
      <CourseInfo {...randomData} />
    </div>
  );
};

export default Page;
