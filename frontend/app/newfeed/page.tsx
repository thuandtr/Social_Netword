import React from 'react'
import { getCurrentUserOrRedirect } from '../lib/user'
import NewsfeedClient from './NewsfeedClient'

const page = async () => {
  const userData = await getCurrentUserOrRedirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Newsfeed
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your updates, projects, and achievements with the community
          </p>
        </header>
        
        <NewsfeedClient currentUser={userData.user} />
      </div>
    </div>
  )
}

export default page