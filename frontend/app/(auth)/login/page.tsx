import React from 'react'
import Link from 'next/link'
import AuthForm from '../AuthForm'
import { loginAction } from '@/app/actions/form-actions';

const Login = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Sign In</h1>
          <p className='text-gray-400'>Access your account to continue</p>
        </div>
        
        <div className='bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl'>
          <AuthForm isSignup={false} action={loginAction} />
        </div>
        
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-400'>
            Don't have an account?{' '}
            <Link href='/signup' className='text-indigo-400 hover:text-indigo-300 font-semibold transition-colors'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login