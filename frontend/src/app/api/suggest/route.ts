import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

// Course Titles
const courses = [
    "Introduction to Machine Learning",
    "Advanced Machine Learning Techniques",
    "Machine Learning for Computer Vision",
    "Introduction to Data Science",
    "Advanced Data Science and Analytics",
    "Data Science for Business Analytics",
    "Introduction to Python Programming",
    "Advanced Python Development",
    "Python for Data Analysis",
    "Web Development Fundamentals",
    "Advanced Web Development",
    "Full Stack Web Development",
    "Digital Marketing Essentials",
    "Advanced Digital Marketing Strategies",
    "Social Media Marketing Mastery",
    "Introduction to Artificial Intelligence",
    "Advanced AI and Deep Learning",
    "AI for Business Applications",
    "Cloud Computing Fundamentals",
    "AWS Solutions Architect",
    "Microsoft Azure Development",
    "Cybersecurity Fundamentals",
    "Advanced Cybersecurity",
    "Network Security Essentials",
    "UI/UX Design Basics",
    "Advanced UI/UX Design",
    "Mobile UI Design",
    "Business Analytics Fundamentals",
    "Advanced Business Analytics",
    "Predictive Analytics for Business",
    "Financial Management Basics",
    "Investment Strategies",
    "Personal Finance Planning",
    "Project Management Essentials",
    "Agile Project Management",
    "PMP Certification Preparation",
    "Graphic Design Fundamentals",
    "Advanced Graphic Design",
    "Brand Identity Design",
    "Content Marketing Basics",
    "Advanced Content Strategy",
    "SEO Content Writing",
    "Mobile App Development Basics",
    "iOS App Development",
    "Android App Development",

 
    ];

export async function POST(request: Request) {
  try {
    // Parse JSON body from the request
    const { query } = await request.json();

    // Validate input
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Calculate similarity scores
    const similarityScores = courses.map((course) => ({
      title: course,
      similarity: stringSimilarity.compareTwoStrings(query.toLowerCase(), course.toLowerCase()),
    }));

    // Filter and sort suggestions based on similarity scores
    const suggestions = similarityScores
      .filter((item) => item.similarity > 0.1) // Threshold for relevance
      .sort((a, b) => b.similarity - a.similarity)
      .map((item) => item.title); // Extract titles

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error processing suggestions:", error);
    return NextResponse.json({ suggestions: [], error: "Failed to process query" }, { status: 500 });
  }
}
