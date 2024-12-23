"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Clock, TrendingUp, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const dummyInstructor = {
  name: "Dr. Jane Smith",
  image: "/placeholder.svg?height=400&width=400",
  qualifications: "Ph.D. in Computer Science, M.Sc. in Data Science",
  totalContentHours: 250,
  courses: [
    { name: "Introduction to Machine Learning", studentsLastMonth: 45, totalStudents: 150, hours: 40 },
    { name: "Advanced Python Programming", studentsLastMonth: 38, totalStudents: 120, hours: 50 },
    { name: "Data Visualization Techniques", studentsLastMonth: 22, totalStudents: 90, hours: 35 },
    { name: "Deep Learning Fundamentals", studentsLastMonth: 30, totalStudents: 80, hours: 60 },
    { name: "Natural Language Processing", studentsLastMonth: 25, totalStudents: 70, hours: 65 },
  ],
};

export default function InstructorDashboard() {
  const router = useRouter();
  const [instructor, setInstructor] = useState(dummyInstructor); // Initialize with dummy data
  const [qualifications, setQualifications] = useState(dummyInstructor.qualifications);
  const [isEditing, setIsEditing] = useState(false); // State to track if we are editing qualifications

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await fetch("http://localhost:3000/instructor-info");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setInstructor(data);
            setQualifications(data.qualifications);
          } else {
            console.warn("No instructor data returned, using dummy data.");
          }
        } else {
          console.error("Failed to fetch instructor data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };

    fetchInstructorData();
  }, []);

  const handleCreateCourse = () => {
    router.push("/course-upload");
  };

  const handleQualificationsChange = (e) => {
    setQualifications(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/update-instructor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qualifications,
      }),
    });

    if (response.ok) {
      alert("Qualifications updated successfully!");
      const updatedInstructor = await response.json();
      setInstructor(updatedInstructor);
      setIsEditing(false); // Hide the editing area after successful update
    } else {
      alert("Failed to update qualifications.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900">
      {/* Left compartment */}
      <aside className="w-full md:w-64 p-6 border-r">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={instructor.image} alt={instructor.name} />
            <AvatarFallback>{instructor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-center">{instructor.name}</h2>
          <p className="text-sm text-muted-foreground text-center">{instructor.qualifications}</p>
          <Button onClick={() => setIsEditing(!isEditing)} className="mt-2">
            {isEditing ? "Cancel" : "Update Education Level"}
          </Button>
          {isEditing && (
            <form onSubmit={handleSubmit} className="text-center mt-2">
              <textarea
                value={qualifications}
                onChange={handleQualificationsChange}
                className="border p-2 rounded w-full text-black"
                rows={3}
              />
              <Button type="submit" className="mt-2">Submit Changes</Button>
            </form>
          )}
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <h3 className="font-semibold mb-2">Total Content Provided</h3>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{instructor.totalContentHours}</span>
            <span className="text-muted-foreground">hours</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Amber Instructor Dashboard</h1>
          <Button onClick={handleCreateCourse}>Create New Course</Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6">
            {instructor.courses.map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {course.studentsLastMonth} new students this month
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {course.hours} hours
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Link href={`/course/${course.name}`}>
                      <Button variant="outline" size="sm">
                        <Book className="mr-2 h-4 w-4" />
                        View Course
                      </Button>
                    </Link>
                    <Badge variant="secondary" className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {course.totalStudents} total
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
