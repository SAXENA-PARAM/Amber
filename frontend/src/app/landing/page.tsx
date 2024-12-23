import { AppSidebar } from '@/components/app-sidebar'
import LandingPage from '@/components/landing'
import { SidebarWrapper } from '@/components/SidebarWrapper'
import React from 'react'

const page = () => {
  return (
    <div>
      <SidebarWrapper>
     
        <LandingPage/>
        </SidebarWrapper>
    </div>
  )
}

export default page