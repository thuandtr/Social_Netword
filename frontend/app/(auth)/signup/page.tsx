import React from 'react'
import Link from 'next/link'
import AuthForm from '../AuthForm'
import { signupAction } from '@/app/actions/form-actions'

const Signup = () => {
  return (
    <div className='w-full flex items-center wrap flex-col justify-center h-dvh'>
        <AuthForm isSignup={true} action={signupAction} />
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-400'>
            Already have an account?{' '}
            <Link href='/login' className='text-indigo-400 hover:text-indigo-300 font-semibold'>
              Sign in
            </Link>
          </p>
        </div>
    </div>
  )
}

export default Signup