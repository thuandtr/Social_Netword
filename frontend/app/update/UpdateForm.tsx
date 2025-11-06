"use client"

import React, { useState, useActionState } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import type { User, UserDetails, ExperienceDetails, EducationDetails, CertificateDetails, ProjectDetails } from '../lib/user'
import { updateDetailsAction } from '../actions/form-actions'
import { resolveImageUrl } from '../lib/image-url-helper'

type Experience = {
    companyName: string
    jobTitle: string
    jobDescription: string
    salary?: string
    startDate?: string
    endDate?: string
    managerName?: string
    managerEmail?: string
}

type Education = {
    school: string
    degree?: string
    fieldOfStudy?: string
    startDate?: string
    endDate?: string
    description?: string
}

type Certificate = {
    name: string
    issuer?: string
    issueDate?: string
    credentialId?: string
    credentialUrl?: string
}

type Project = {
    name: string
    description?: string
    sourceLink?: string
    demoLink?: string
    technologies?: string
    contributors?: string
    responsibilities?: string
    startDate?: string
    endDate?: string
}

type Props = {
    user: User
    details?: UserDetails
}

const UpdateForm = ({ user, details }: Props) => {
    // File upload states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    // Debug: Log avatar URL
    // console.log('UpdateForm - User details:', details);
    // console.log('UpdateForm - Avatar URL:', details?.avatar_url);

    const emptyExperience: Experience = {
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        salary: '',
        startDate: '',
        endDate: '',
        managerName: '',
        managerEmail: '',
    }

    const emptyEducation: Education = {
        school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: ''
    }

    const emptyCertificate: Certificate = {
        name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: ''
    }

    const emptyProject: Project = {
        name: '',
        description: '',
        sourceLink: '',
        demoLink: '',
        technologies: '',
        contributors: '',
        responsibilities: '',
        startDate: '',
        endDate: '',
    }

    const mapExperience = (e: ExperienceDetails): Experience => ({
        companyName: (e.companyName ?? e.company_name ?? '') || '',
        jobTitle: (e.jobTitle ?? e.job_title ?? '') || '',
        jobDescription: (e.jobDescription ?? e.job_description ?? '') || '',
        salary: (e.salary ?? '') || '',
        startDate: (e.startDate ?? e.start_date ?? '') || '',
        endDate: (e.endDate ?? e.end_date ?? '') || '',
        managerName: (e.managerName ?? e.manager_name ?? '') || '',
        managerEmail: (e.managerEmail ?? e.manager_email ?? '') || '',
    })

    const mapEducation = (e: EducationDetails): Education => ({
        school: e.school ?? '',
        degree: e.degree ?? '',
        fieldOfStudy: (e.fieldOfStudy ?? e.field_of_study ?? '') || '',
        startDate: (e.startDate ?? e.start_date ?? '') || '',
        endDate: (e.endDate ?? e.end_date ?? '') || '',
        description: e.description ?? '',
    })

    const mapCertificate = (c: CertificateDetails): Certificate => ({
        name: c.name ?? '',
        issuer: c.issuer ?? '',
        issueDate: (c.issueDate ?? c.issue_date ?? '') || '',
        credentialId: (c.credentialId ?? c.credential_id ?? '') || '',
        credentialUrl: (c.credentialUrl ?? c.credential_url ?? '') || '',
    })

    const mapProject = (p: ProjectDetails): Project => ({
        name: p.name ?? '',
        description: p.description ?? '',
        sourceLink: (p.sourceLink ?? p.source_link ?? '') || '',
        demoLink: (p.demoLink ?? p.demo_link ?? '') || '',
        technologies: p.technologies ?? '',
        contributors: p.contributors ?? '',
        responsibilities: p.responsibilities ?? '',
        startDate: (p.startDate ?? p.start_date ?? '') || '',
        endDate: (p.endDate ?? p.end_date ?? '') || '',
    })

    const [experiences, setExperiences] = useState<Experience[]>(() =>
        details?.experiences && details.experiences.length
            ? details.experiences.map(mapExperience)
            : [emptyExperience]
    )

    const [educations, setEducations] = useState<Education[]>(() =>
        details?.educations && details.educations.length
            ? details.educations.map(mapEducation)
            : [emptyEducation]
    )

    const [certificates, setCertificates] = useState<Certificate[]>(() =>
        details?.certificates && details.certificates.length
            ? details.certificates.map(mapCertificate)
            : [emptyCertificate]
    )

    const [projects, setProjects] = useState<Project[]>(() =>
        details?.projects && details.projects.length
            ? details.projects.map(mapProject)
            : [emptyProject]
    )

    const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
        setExperiences(prev => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)))
    }

    const addExperience = () => {
        setExperiences(prev => [
            ...prev,
            { companyName: '', jobTitle: '', jobDescription: '', salary: '', startDate: '', endDate: '', managerName: '', managerEmail: '' },
        ])
    }

    const removeExperience = (index: number) => {
        setExperiences(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
    }

    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        setEducations(prev => prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)))
    }

    const addEducation = () => {
        setEducations(prev => [...prev, { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }])
    }

    const removeEducation = (index: number) => {
        setEducations(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
    }

    const handleCertificateChange = (index: number, field: keyof Certificate, value: string) => {
        setCertificates(prev => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
    }

    const addCertificate = () => {
        setCertificates(prev => [...prev, { name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' }])
    }

    const removeCertificate = (index: number) => {
        setCertificates(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
    }

    const handleProjectChange = (index: number, field: keyof Project, value: string) => {
        setProjects(prev => prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)))
    }

    const addProject = () => {
        setProjects(prev => [...prev, emptyProject])
    }

    const removeProject = (index: number) => {
        setProjects(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
    }

    // Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            // Create preview URL for image
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            // console.log('Avatar file selected:', file.name);
        }
    };

    // Clear avatar selection
    const clearAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        // Reset the file input
        const input = document.getElementById('avatar-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    // Handle cover file selection
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            // console.log('Cover file selected:', file.name);
        }
    };

    // Clear cover selection
    const clearCover = () => {
        setCoverFile(null);
        const input = document.getElementById('cover-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const [state, formAction, isPending] = useActionState(updateDetailsAction as any, { ok: false, message: '' });

    return (
        <div>
            <form action={formAction} encType="multipart/form-data">
                <div className="space-y-12">
                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Profile</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-white">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="janesmith"
                                            defaultValue={user.username}
                                            className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm/6 font-medium text-white">
                                    About
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        defaultValue={details?.about ?? ''}
                                    />
                                </div>
                                <p className="mt-3 text-sm/6 text-gray-400">Write a few sentences about yourself.</p>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="avatar-upload" className="block text-sm/6 font-medium text-white">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar preview" 
                                            className="size-12 rounded-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : details?.avatar_url ? (
                                        <img 
                                            src={resolveImageUrl(details.avatar_url) || ''} 
                                            alt="Current avatar" 
                                            className="size-12 rounded-full object-cover"
                                            crossOrigin="anonymous"
                                            onError={(e) => {
                                                console.error('Failed to load avatar:', details.avatar_url);
                                                // Fallback to placeholder on error
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <UserCircleIcon aria-hidden="true" className="size-12 text-gray-500" />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-2">
                                            <label htmlFor="avatar-upload" className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 cursor-pointer">
                                                Change
                                            </label>
                                            {avatarFile && (
                                                <button
                                                    type="button"
                                                    onClick={clearAvatar}
                                                    className="rounded-md bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/30"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        {avatarFile && (
                                            <span className="text-xs text-green-400">
                                                ✓ {avatarFile.name}
                                            </span>
                                        )}
                                    </div>
                                    <input 
                                        id="avatar-upload" 
                                        name="avatar" 
                                        type="file" 
                                        accept="image/*" 
                                        className="sr-only" 
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <p className="mt-2 text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-upload" className="block text-sm/6 font-medium text-white">
                                    Cover photo
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-600" />
                                        <div className="mt-4 flex text-sm/6 text-gray-400 justify-center items-center gap-2">
                                            <label
                                                htmlFor="cover-upload"
                                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                                            >
                                                <span>Upload a file</span>
                                                <input 
                                                    id="cover-upload" 
                                                    name="cover" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="sr-only" 
                                                    onChange={handleCoverChange}
                                                />
                                            </label>
                                            {!coverFile && <p>or drag and drop</p>}
                                            {coverFile && (
                                                <button
                                                    type="button"
                                                    onClick={clearCover}
                                                    className="ml-2 rounded-md bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/30"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        {coverFile ? (
                                            <p className="mt-2 text-xs/5 text-green-400">
                                                ✓ Selected: {coverFile.name}
                                            </p>
                                        ) : (
                                            <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Personal Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">Use a permanent address where you can receive mail.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        defaultValue={user.email}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm/6 font-medium text-white">
                                    Country
                                </label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        defaultValue={details?.country ?? 'United States'}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm/6 font-medium text-white">
                                    Street address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="street-address"
                                        name="street-address"
                                        type="text"
                                        autoComplete="street-address"
                                        defaultValue={details?.street_address ?? ''}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm/6 font-medium text-white">
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        autoComplete="address-level2"
                                        defaultValue={details?.city ?? ''}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm/6 font-medium text-white">
                                    State / Province
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="region"
                                        name="region"
                                        type="text"
                                        autoComplete="address-level1"
                                        defaultValue={details?.region ?? ''}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm/6 font-medium text-white">
                                    ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="postal-code"
                                        name="postal-code"
                                        type="text"
                                        autoComplete="postal-code"
                                        defaultValue={details?.postal_code ?? ''}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Work & Experience</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">
                            Add all relevant roles. Leave end date empty if currently employed.
                        </p>

                        <div className="mt-10 space-y-10">
                            {experiences.map((exp, idx) => (
                                <div key={idx} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-white">Experience #{idx + 1}</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={addExperience}
                                                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperience(idx)}
                                                    className="rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/30"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Company name</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                autoComplete="organization"
                                                value={exp.companyName}
                                                onChange={(e) => handleExperienceChange(idx, 'companyName', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Job title / Position</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                autoComplete="organization-title"
                                                value={exp.jobTitle}
                                                onChange={(e) => handleExperienceChange(idx, 'jobTitle', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Job description</label>
                                        <div className="mt-2">
                                            <textarea
                                                rows={4}
                                                value={exp.jobDescription}
                                                onChange={(e) => handleExperienceChange(idx, 'jobDescription', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                                placeholder="Briefly describe your responsibilities, achievements, and tech stack (if applicable)."
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Salary (optional)</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="e.g. 120000 USD"
                                                value={exp.salary ?? ''}
                                                onChange={(e) => handleExperienceChange(idx, 'salary', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Employment start</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                autoComplete="off"
                                                value={exp.startDate ?? ''}
                                                onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Employment end</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                autoComplete="off"
                                                value={exp.endDate ?? ''}
                                                onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">Leave blank if you are currently employed.</p>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Direct manager name</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                autoComplete="name"
                                                value={exp.managerName ?? ''}
                                                onChange={(e) => handleExperienceChange(idx, 'managerName', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Direct manager email (optional)</label>
                                        <div className="mt-2">
                                            <input
                                                type="email"
                                                autoComplete="email"
                                                value={exp.managerEmail ?? ''}
                                                onChange={(e) => handleExperienceChange(idx, 'managerEmail', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <button
                                    type="button"
                                    onClick={addExperience}
                                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                                >
                                    + Add another company
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Education & Certificates</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">Add your studies and any certifications.</p>

                        {/* Education list */}
                        <div className="mt-10 space-y-10">
                            {educations.map((edu, idx) => (
                                <div key={idx} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-white">Education #{idx + 1}</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={addEducation}
                                                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducation(idx)}
                                                    className="rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/30"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">School / University</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={edu.school}
                                                onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Degree</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. BSc, MSc"
                                                value={edu.degree ?? ''}
                                                onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Field of study</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. Computer Science"
                                                value={edu.fieldOfStudy ?? ''}
                                                onChange={(e) => handleEducationChange(idx, 'fieldOfStudy', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Start date</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                value={edu.startDate ?? ''}
                                                onChange={(e) => handleEducationChange(idx, 'startDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">End date</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                value={edu.endDate ?? ''}
                                                onChange={(e) => handleEducationChange(idx, 'endDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Description (optional)</label>
                                        <div className="mt-2">
                                            <textarea
                                                rows={3}
                                                value={edu.description ?? ''}
                                                onChange={(e) => handleEducationChange(idx, 'description', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                                placeholder="Notes, GPA, activities, honors..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                                >
                                    + Add another education
                                </button>
                            </div>
                        </div>

                        {/* Certificates list */}
                        <div className="mt-16 space-y-10">
                            <h3 className="text-sm font-semibold text-white">Certificates</h3>
                            {certificates.map((cert, idx) => (
                                <div key={idx} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-300">Certificate #{idx + 1}</p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={addCertificate}
                                                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertificate(idx)}
                                                    className="rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/30"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Certificate name</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={cert.name}
                                                onChange={(e) => handleCertificateChange(idx, 'name', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Issuer</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. Coursera, AWS"
                                                value={cert.issuer ?? ''}
                                                onChange={(e) => handleCertificateChange(idx, 'issuer', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Issue date</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                value={cert.issueDate ?? ''}
                                                onChange={(e) => handleCertificateChange(idx, 'issueDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Credential ID (optional)</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={cert.credentialId ?? ''}
                                                onChange={(e) => handleCertificateChange(idx, 'credentialId', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm/6 font-medium text-white">Credential URL (optional)</label>
                                        <div className="mt-2">
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={cert.credentialUrl ?? ''}
                                                onChange={(e) => handleCertificateChange(idx, 'credentialUrl', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <button
                                    type="button"
                                    onClick={addCertificate}
                                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                                >
                                    + Add another certificate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Personal Projects</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">
                            Showcase your personal or collaborative projects with details about your contributions.
                        </p>

                        <div className="mt-10 space-y-10">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-white">Project #{idx + 1}</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={addProject}
                                                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProject(idx)}
                                                    className="rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/30"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label className="block text-sm/6 font-medium text-white">Project name</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={proj.name}
                                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                                placeholder="e.g. E-commerce Platform"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Start date</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                value={proj.startDate ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'startDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">End date</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                value={proj.endDate ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'endDate', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">Leave blank if project is ongoing.</p>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Project description</label>
                                        <div className="mt-2">
                                            <textarea
                                                rows={4}
                                                value={proj.description ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                                placeholder="Describe what the project does, its purpose, and key features..."
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Source code link</label>
                                        <div className="mt-2">
                                            <input
                                                type="url"
                                                value={proj.sourceLink ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'sourceLink', e.target.value)}
                                                placeholder="https://github.com/username/repo"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm/6 font-medium text-white">Live demo link</label>
                                        <div className="mt-2">
                                            <input
                                                type="url"
                                                value={proj.demoLink ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'demoLink', e.target.value)}
                                                placeholder="https://demo-site.com"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Technologies used</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={proj.technologies ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value)}
                                                placeholder="e.g. React, Node.js, PostgreSQL, Docker, AWS"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">List technologies, frameworks, and tools used (comma-separated).</p>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Contributors</label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={proj.contributors ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'contributors', e.target.value)}
                                                placeholder="e.g. John Doe, Jane Smith (or leave blank if solo project)"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm/6 font-medium text-white">Your responsibilities</label>
                                        <div className="mt-2">
                                            <textarea
                                                rows={3}
                                                value={proj.responsibilities ?? ''}
                                                onChange={(e) => handleProjectChange(idx, 'responsibilities', e.target.value)}
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                                placeholder="Describe your role and specific contributions to the project..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <button
                                    type="button"
                                    onClick={addProject}
                                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                                >
                                    + Add another project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden JSON fields to include dynamic lists in FormData */}
                <input type="hidden" name="experiences" value={JSON.stringify(experiences)} />
                <input type="hidden" name="educations" value={JSON.stringify(educations)} />
                <input type="hidden" name="certificates" value={JSON.stringify(certificates)} />
                <input type="hidden" name="projects" value={JSON.stringify(projects)} />

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Saving…' : 'Save'}
                    </button>
                    {state?.message && (
                        <span className={`text-sm ml-3 ${state.ok ? 'text-green-400' : 'text-red-400'}`}>
                            {state.message}
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}

export default UpdateForm