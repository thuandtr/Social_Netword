import React from 'react'
import ProfileCard from './ProfileCard'
import { getCurrentUserOrRedirect } from '../lib/user'

const Profile = async () => {
  const { user, details } = await getCurrentUserOrRedirect('/login')

  console.log('Rendering ProfileCard with user:', user, 'and details:', details)
  return (
    <div className='w-full flex items-center justify-center min-h-dvh py-8'>
      <ProfileCard {...user} details={details} />

      {/* đây là trang cá nhân, bạn hãy giúp tôi tạo 1 giao diện cho trang cá nhân của người dùng nhé
          đây là mạng xã hội giúp người dùng cập nhật về thông tin của họ như 1 cái CV online, cho nên 
          việc trang cá nhân cần có sự hiển thị giống như porfolio, bao gồm nơi làm việc, nơi học tập, 
          các dự án cá nhân, mô tả bản thân và dự án... */}
    </div>
  )
}

export default Profile