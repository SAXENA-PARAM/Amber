// src/components/SidebarWrapper.tsx
'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className=''>
      <div className="with-sidebar flex w-full overflow-hidden">
        <AppSidebar />
        <SidebarTrigger className='z-10'/>
        <main className="main-content absolute top-0 left-16">
          
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
