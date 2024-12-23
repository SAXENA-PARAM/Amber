import CourseUpload from '@/components/course-upload'
import Navbar from '@/components/navbar'
import DotPattern from '@/components/ui/dot-pattern'
import { Sidebar } from 'lucide-react'
import React from 'react'
import { cn } from "@/lib/utils";

const page = () => {
  return (
    <div>
      
        <Navbar/>
        {/* <Sidebar/> */}
        <CourseUpload className='relative z-10'/>
        <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(2000px_circle_at_center,white,transparent)] ",
        )}
      />
    </div>
  )
}

export default page