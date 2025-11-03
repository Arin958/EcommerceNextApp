import { User } from '@/types'
import React from 'react'

const AdminHeader = ({ user }: { user: User }) => {
  return (
    <header className="mb-2">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello, {user.username} 👋
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your platform today
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-blue-700 text-sm font-medium">
                Admin Panel
              </span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader