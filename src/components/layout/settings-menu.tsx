'use client'

import { useState } from 'react'
import { User, Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SettingsMenu() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleProfileClick = () => {
    // TODO: Open profile modal
    console.log('Open profile modal')
  }

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: Implement dark mode toggle
    console.log('Toggle dark mode:', !isDarkMode)
  }

  const handleLogOut = () => {
    // TODO: Implement logout
    console.log('Log out')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md transition-colors">
          <User className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Profile menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDarkModeToggle} className="cursor-pointer">
          {isDarkMode ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}