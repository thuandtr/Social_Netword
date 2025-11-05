import React from 'react'
import UpdateForm from './UpdateForm'
import { getCurrentUserOrRedirect } from '../lib/user'

const ProfileUpdatePage = async () => {
    const { user, details } = await getCurrentUserOrRedirect('/login')

    return (
        <div style={{ padding: '2rem', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
            <UpdateForm user={user} details={details} />
        </div>
    )
}

export default ProfileUpdatePage