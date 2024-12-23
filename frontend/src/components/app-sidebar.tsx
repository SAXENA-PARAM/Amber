import {Home, Inbox, Search, Settings ,ShoppingCart, LogOut, User} from "lucide-react"
import { Calendar } from "./ui/calendar"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { title } from "process"
import { Content } from "react-bootstrap/lib/Tab"

// Menu items.
const items = [
  {
    title: "Home",
    url: "http://localhost:3000/landing",
    icon:() => (
        <img
          src='/images/amlogo2-EdGhBzQOb-transformed.jpeg'
          alt="Home Icon"
          style={{ width: 24, height: 24,
            objectFit: 'cover', // Ensures the image covers the container
            objectPosition: 'center', // Ensures the image is centered
            mixBlendMode: 'darken',
             }}
        />
      ),
  },
  {
    title: "My Cart",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

 
]

const items2 = [
{
title:"log out",
url: "http://localhost:3000/home",
icon: LogOut},
{
 title:"profile",
url:"http://localhost:3000/dashboard",
icon: User
}

]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="z-10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AMBER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
             
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {
                        <Calendar/>
                    }   
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <SidebarGroupContent>
            <SidebarMenu>
              {items2.map((items2) => (
                <SidebarMenuItem key={items2.title}>
                  <SidebarMenuButton asChild>
                    <a href={items2.url}>
                      <items2.icon />
                      <span>{items2.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  )
}
