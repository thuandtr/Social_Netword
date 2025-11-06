import React from 'react'
import { getCurrentUserOrRedirect } from '../lib/user'
import { redirect } from 'next/navigation'

const Profile = async () => {
  const { user } = await getCurrentUserOrRedirect('/login')

  // Redirect to the user's profile page based on username
  redirect(`/profile/${user.username}`)
}

export default Profile