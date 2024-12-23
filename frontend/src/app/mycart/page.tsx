"use client"
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

// Mock data for courses in the cart
const initialCourses = [
  { id: 1, name: "Introduction to React", instructor: "Jane Doe", price: 49.99 },
  { id: 2, name: "Advanced JavaScript Techniques", instructor: "John Smith", price: 79.99 },
  { id: 3, name: "UX/UI Design Fundamentals", instructor: "Alice Johnson", price: 59.99 },
  { id: 4, name: "Python for Data Science", instructor: "Bob Williams", price: 89.99 },
]

export default function MyCart() {
  const [courses, setCourses] = useState(initialCourses)

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  const buyCourse = (id: number) => {
    // Implement buy functionality here
    console.log(`Buying course with id: ${id}`)
  }

  const totalPrice = courses.reduce((sum, course) => sum + course.price, 0)

  return (
        <div className="container mx-auto px-4 py-8 w-[100vw]">
          <Navbar student={{name:"vj"}} className=''/>
      <h1 className="text-3xl font-bold mb-8">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
              <p className="text-lg font-semibold">${course.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Button variant="outline" onClick={() => removeCourse(course.id)}>
                Remove from Cart
              </Button>
              <Button onClick={() => buyCourse(course.id)}>Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {courses.length > 0 ? (
        <div className="mt-8 text-right">
          <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
          <Button className="mt-4" size="lg">
            Checkout
          </Button>
        </div>
      ) : (
        <p className="mt-8 text-center text-xl">Your cart is empty</p>
      )}
    </div>
  )
}