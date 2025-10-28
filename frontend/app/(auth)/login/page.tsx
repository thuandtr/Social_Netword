import React from 'react'
import Link from 'next/link'
import AuthForm from '../AuthForm'
import { loginAction } from '@/app/actions/form-actions';

const Login = () => {
  return (
    <div className='w-full flex items-center wrap flex-col justify-center h-dvh'>
        <AuthForm isSignup={false} action={loginAction} />
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-400'>
            Don't have an account?{' '}
            <Link href='/signup' className='text-indigo-400 hover:text-indigo-300 font-semibold'>
              Sign up
            </Link>
          </p>
        </div>
    </div>
  )
}

export default Login