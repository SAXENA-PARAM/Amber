'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, School } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DotPattern from "@/components/ui/dot-pattern"
import {cn} from "@/lib/utils"

export default function Component() {
  const router = useRouter()

  const handleRedirect = (profession: string) => {
    // Redirect to /signup with a query parameter for the profession
    router.push(`/signin/${profession}`)
  }

  return (
    <div className="min-h-screen  flex-col flex items-center justify-center bg-black p-4">
     <p className="text-8xl font-black mb-8">WELCOME TO Amber!!!</p>
     <p className="text-4xl"> 
      Kindly choose your profession to continue</p>
      <Card className="w-full max-w-md shadow-lg z-10 mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">CHOOSE YOUR PROFESSION</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="h-16 text-lg"
            variant="outline"
            onClick={() => handleRedirect('student')}
          >
            <GraduationCap className="mr-2 h-6 w-6" />
            Student
          </Button>
          <Button
            className="h-16 text-lg"
            variant="outline"
            onClick={() => handleRedirect('teacher')}
          >
            <School className="mr-2 h-6 w-6" />
            Teacher
          </Button>
        </CardContent>
      </Card>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)] ",
        )}
      />
    </div>
  )
}
