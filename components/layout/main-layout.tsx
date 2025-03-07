import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex bg-white overflow-x-scroll">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 