import React from 'react'
import ProfileCard from './ProfileCard'
import { getCurrentUserOrRedirect } from '../lib/user'

const Profile = async () => {
  const { user, details } = await getCurrentUserOrRedirect('/login')

  console.log('Rendering ProfileCard with user:', user, 'and details:', details)
  return (
    <div className='w-full flex items-center justify-center min-h-dvh py-8'>
      <ProfileCard {...user} details={details} />
    </div>
  )
}

export default Profile