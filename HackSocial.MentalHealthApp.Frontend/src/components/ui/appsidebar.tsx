"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./sidebar"
import { Button } from "./button"
import {
  Heart,
  ChevronRight,
  MessageCircle,
  Plus,
  LayoutDashboard,
  Smile,
  BookOpen,
  Wind,
  Brain,
  Settings,
  LogOut,
} from "lucide-react"

// Types
type NavItem = {
  title: string
  url: string
  icon: React.ElementType
}

type ToolItem = {
  title: string
  description: string
  url: string
  icon: React.ElementType
}

// Data
const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
]

const toolItems: ToolItem[] = [
  {
    title: "Mood Tracker",
    description: "Track how you feel daily",
    url: "/tools/mood-tracker",
    icon: Smile,
  },
  {
    title: "Journal",
    description: "Reflect with private notes",
    url: "/tools/journal",
    icon: BookOpen,
  },
  {
    title: "Breathing",
    description: "Guided breathing exercises",
    url: "/tools/breathing",
    icon: Wind,
  },
  {
    title: "CBT Tools",
    description: "Use cognitive strategies",
    url: "/tools/cbt",
    icon: Brain,
  },
]

export const AppSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sage-100">
      {/* Header */}
      <SidebarHeader className="border-b border-sage-100 p-6">
        <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
               </div>
             <span className="font-bold text-sage-600 text-lg">LUMINA AI</span>
             </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="p-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sage-500 font-medium mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item: NavItem) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-11 px-3 rounded-lg hover:bg-sage-50 data-[active=true]:bg-sage-100 data-[active=true]:text-sage-900"
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wellness Tools */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sage-500 font-medium mb-2">
            Wellness Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolItems.map((item: ToolItem) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-auto p-3 rounded-lg hover:bg-sage-50 data-[active=true]:bg-sage-100"
                    >
                      <Link href={item.url}>
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-sage-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sage-900 text-sm">
                              {item.title}
                            </p>
                            <p className="text-xs text-sage-500">{item.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-sage-400" />
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
       <SidebarGroup className="mt-6">
  <SidebarGroupLabel className="text-sage-500 font-medium mb-2">
    Preferences
  </SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu className="space-y-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === "/settings"}
          className="h-11 px-3 rounded-lg hover:bg-sage-50 data-[active=true]:bg-sage-100 data-[active=true]:text-sage-900"
        >
          <Link href="/settings">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="h-11 px-3 rounded-lg hover:bg-sage-50 text-sage-700"
        >
          <button
            type="button"
            onClick={() => {
              // TODO: Replace with actual logout logic
              console.log("Logging out...")
            }}
            className="flex items-center w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
