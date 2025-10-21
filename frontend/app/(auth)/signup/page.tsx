import React from 'react'
import AuthForm from '../AuthForm'
import { signupAction } from '@/app/actions/form-actions'

const Signup = () => {
  return (
    <div className='w-full flex items-center wrap flex-col justify-center h-dvh'>
        <AuthForm isSignup={true} action={signupAction} />
    </div>
  )
}

export default Signup