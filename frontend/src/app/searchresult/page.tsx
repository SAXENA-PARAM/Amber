"use client"
import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from 'lucide-react'
import { Navbar } from 'react-bootstrap'
import SearchBar from '@/components/searchbar'

// Mock data for search results
const initialCourses = [
  { id: 1, name: "Introduction to React", domain: "Web Development", instructor: "Jane Doe", price: 49.99, thumbnail: "https://img.freepik.com/premium-psd/ad-eye-catching-youtube-thumbnail-clickbait-eyecatching-youtube-thumbnail-psd_574881-3823.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
  { id: 2, name: "Advanced JavaScript Techniques", domain: "Programming", instructor: "John Smith", price: 79.99, thumbnail: "https://img.freepik.com/free-vector/flat-geometric-travel-youtube-thumbnail_23-2148902156.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
  { id: 3, name: "UX/UI Design Fundamentals", domain: "Design", instructor: "Alice Johnson", price: 59.99, thumbnail: "https://img.freepik.com/free-vector/flat-science-youtube-thumbnail_23-2149069937.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
  { id: 4, name: "Python for Data Science", domain: "Data Science", instructor: "Bob Williams", price: 89.99, thumbnail: "https://img.freepik.com/free-vector/gradient-geometric-sport-youtube-thumbnail_23-2148923763.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
  { id: 5, name: "Machine Learning Basics", domain: "Artificial Intelligence", instructor: "Eva Brown", price: 99.99, thumbnail: "https://img.freepik.com/free-vector/flat-abstract-sport-youtube-thumbnail_23-2148936304.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
  { id: 6, name: "Digital Marketing Strategies", domain: "Marketing", instructor: "Chris Lee", price: 69.99, thumbnail: "https://img.freepik.com/free-vector/flat-design-car-rental-youtube-thumbnail_23-2149250563.jpg?ga=GA1.1.687158524.1731735906&semt=ais_hybrid" },
]

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState(initialCourses)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would typically make an API call here
    // For this example, we'll just filter the mock data
    const filteredCourses = initialCourses.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setCourses(filteredCourses)
  }

  return (
    <div className="container mx-auto px-4 py-8">
        
      <form onSubmit={handleSearch} className="mb-8">
        {/* <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div> */}
        <SearchBar/>
      </form>

      <h2 className="text-2xl font-bold mb-6">Search Results</h2>

      {courses.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No courses found. Try a different search term.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={course.thumbnail}
                  alt={`Thumbnail for ${course.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <Badge variant="secondary">{course.domain}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                <p className="text-lg font-semibold">${course.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <a href="/course/function"><Button className="w-full">Enroll Now</Button></a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}