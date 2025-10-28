import axios from 'axios'
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileCard from './ProfileCard'

type Response = {
  message: string,
  user: {
    id: number,
    username: string,
    email: string,
    created_at: string
  }

}

const getUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    console.log("Missing tokens in profile page");
    redirect('/login');
  }

  try {
    const res = await axios.get('/user/me', {
      headers: {
        // Send both access and refresh tokens in Authorization header
        Authorization: `access_token=${accessToken}, refresh_token=${refreshToken}`,
      },
      withCredentials: true,
    });

    const data = (await res.data) as Response;
    console.log("Profile page user data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect('/login');
  }
}

const Profile = async () => {
  const userData = await getUser();

  console.log("Rendering ProfileCard with props:", userData.user);
  return (
    <div className='w-full flex items-center justify-center min-h-dvh py-8'>
      <ProfileCard {...userData.user} />
    </div>
  )
}

export default Profile