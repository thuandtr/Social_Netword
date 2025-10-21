import React from 'react'
import AuthForm from '../AuthForm'
import { loginAction } from '@/app/actions/form-actions';

const Login = () => {
  return (
    <div className='w-full flex items-center wrap flex-col justify-center h-dvh'>
        <AuthForm isSignup={false} action={loginAction} />
    </div>
  )
}

export default Login