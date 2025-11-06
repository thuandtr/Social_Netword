import React from 'react'
import Link from 'next/link'
import AuthForm from '../AuthForm'
import { signupAction } from '@/app/actions/form-actions'

const Signup = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Create Account</h1>
          <p className='text-gray-400'>Join us and start your journey</p>
        </div>
        
        <div className='bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl'>
          <AuthForm isSignup={true} action={signupAction} />
        </div>
        
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-400'>
            Already have an account?{' '}
            <Link href='/login' className='text-indigo-400 hover:text-indigo-300 font-semibold transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup