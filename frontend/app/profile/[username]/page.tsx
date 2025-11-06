import React from 'react'
import { getUserByUsername, getCurrentUser } from '../../lib/user'
import PortfolioProfile from '../PortfolioProfile'
import { notFound } from 'next/navigation'

type ProfilePageProps = {
  params: Promise<{
    username: string
  }>
}

const UserProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params
  
  // Fetch the profile user by username
  const profileData = await getUserByUsername(username)
  
  if (!profileData || !profileData.user) {
    notFound()
  }
  
  // Check if the current user is viewing their own profile
  const currentUserData = await getCurrentUser()
  const isOwnProfile = currentUserData?.user?.id === profileData.user.id
  
  console.log('Rendering UserProfilePage:', {
    username,
    profileUser: profileData.user,
    currentUser: currentUserData?.user,
    isOwnProfile
  })
  
  return (
    <PortfolioProfile 
      user={profileData.user} 
      details={profileData.details}
      isOwnProfile={isOwnProfile}
    />
  )
}

export default UserProfilePage
