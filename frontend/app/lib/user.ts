import axios from './axios'
import { redirect } from 'next/navigation'
import { getAuthHeaders, requireAuth } from './validateAuth'

export type User = {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

// Profile details returned by backend for the current user
export type ExperienceDetails = {
  companyName?: string
  company_name?: string
  jobTitle?: string
  job_title?: string
  jobDescription?: string
  job_description?: string
  salary?: string | null
  startDate?: string | null
  start_date?: string | null
  endDate?: string | null
  end_date?: string | null
  managerName?: string | null
  manager_name?: string | null
  managerEmail?: string | null
  manager_email?: string | null
}

export type EducationDetails = {
  school?: string
  degree?: string | null
  fieldOfStudy?: string | null
  field_of_study?: string | null
  startDate?: string | null
  start_date?: string | null
  endDate?: string | null
  end_date?: string | null
  description?: string | null
}

export type CertificateDetails = {
  name: string
  issuer?: string | null
  issueDate?: string | null
  issue_date?: string | null
  credentialId?: string | null
  credential_id?: string | null
  credentialUrl?: string | null
  credential_url?: string | null
}

export type ProjectDetails = {
  name: string
  description?: string | null
  sourceLink?: string | null
  source_link?: string | null
  demoLink?: string | null
  demo_link?: string | null
  technologies?: string | null
  contributors?: string | null
  responsibilities?: string | null
  startDate?: string | null
  start_date?: string | null
  endDate?: string | null
  end_date?: string | null
}

export type UserDetails = {
  user_id: number
  about: string | null
  country: string | null
  street_address: string | null
  city: string | null
  region: string | null
  postal_code: string | null
  avatar_url: string | null
  cover_url: string | null
  created_at: string
  updated_at: string
  experiences?: ExperienceDetails[]
  educations?: EducationDetails[]
  certificates?: CertificateDetails[]
  projects?: ProjectDetails[]
}

export type CurrentUserResponse = {
  message: string
  user: User
  details?: UserDetails
}

// Server-side helper to fetch the current authenticated user.
// Ensures auth (with a fast guard) and redirects to login on failure.
export const getCurrentUserOrRedirect = async (
  loginPath: string = '/login',
): Promise<CurrentUserResponse> => {
  // Fast guard: if no refresh token, bounce early
  await requireAuth(loginPath)

  try {
    const res = await axios.get('/user/me', {
      headers: await getAuthHeaders(),
    })

    const data = (await res.data) as CurrentUserResponse
    // console.log('getCurrentUserOrRedirect data:', data);
    return data
  } catch (error) {
    console.error('Error fetching current user:', error)
    redirect(loginPath)
  }
}

// Get current user without redirecting (returns null if not authenticated)
export const getCurrentUser = async (): Promise<CurrentUserResponse | null> => {
  try {
    const res = await axios.get('/user/me', {
      headers: await getAuthHeaders(),
    })

    return (await res.data) as CurrentUserResponse
  } catch (error) {
    return null
  }
}

// Fetch user profile by username (no authentication required)
export const getUserByUsername = async (
  username: string
): Promise<CurrentUserResponse | null> => {
  try {
    const res = await axios.get(`/user/username/${username}`)

    return (await res.data) as CurrentUserResponse
  } catch (error) {
    console.error('Error fetching user by username:', error)
    return null
  }
}
