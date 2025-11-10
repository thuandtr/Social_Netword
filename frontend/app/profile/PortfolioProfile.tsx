"use client";

import { motion, useScroll } from "framer-motion";
import { logoutAction } from "../actions/form-actions";
import type { User, UserDetails } from "../lib/user";
import Link from "next/link";
import { useState, useEffect } from "react";
import { resolveImageUrl } from "../lib/image-url-helper";
import axios from "../lib/axios";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  MapPin, 
  Mail, 
  Calendar,
  ExternalLink,
  LogOut,
  Edit,
  Github,
  Globe,
  Download,
  MessageCircle
} from "lucide-react";
import LoginPromptModal from "../components/LoginPromptModal";

type PortfolioProfileProps = {
  user: User;
  details?: UserDetails;
  isOwnProfile?: boolean;
};

const PortfolioProfile = ({ user, details, isOwnProfile = false }: PortfolioProfileProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPromptConfig, setLoginPromptConfig] = useState({
    message: "",
    action: ""
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleDownloadCV = async () => {
    try {
      const response = await axios.get(`/user/download-cv/${user.username}`, {
        responseType: 'blob',
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.username}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      if (error.response?.status === 401) {
        // User is not authenticated
        setLoginPromptConfig({
          message: `Sign in to download ${user.username}'s professional CV and access their complete profile information.`,
          action: "download this CV"
        });
        setShowLoginModal(true);
      } else {
        setLoginPromptConfig({
          message: "An error occurred while downloading the CV. Please try again.",
          action: "retry"
        });
        setShowLoginModal(true);
      }
    }
  };

  const handleContact = async () => {
    // Check if user is logged in by making a simple check
    try {
      await axios.get('/user/me');
      // Placeholder for contact functionality
      alert('Contact feature coming soon!');
    } catch (error) {
      setLoginPromptConfig({
        message: `Sign in to send a message to ${user.username} and connect with them professionally.`,
        action: "contact this user"
      });
      setShowLoginModal(true);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - Shows when scrolling */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mini Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
                {details?.avatar_url ? (
                  <img 
                    src={resolveImageUrl(details.avatar_url) || ''} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Username and Email */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user.username}</h2>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <Link
                    href="/update"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDownloadCV}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">CV</span>
                  </button>
                  <button
                    onClick={handleContact}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Contact</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cover Photo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden"
      >
        {details?.cover_url ? (
          <img 
            src={resolveImageUrl(details.cover_url) || ''} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700" />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative -mt-20 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  {details?.avatar_url ? (
                    <img 
                      src={resolveImageUrl(details.avatar_url) || ''} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      {details?.country && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {details.city ? `${details.city}, ${details.country}` : details.country}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isOwnProfile ? (
                      <>
                        <Link
                          href="/update"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleDownloadCV}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download CV
                        </button>
                        <button
                          onClick={handleContact}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* About Section */}
                {details?.about && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {details.about}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Single Column Content */}
        <div className="space-y-6 pb-12">
            
            {/* Empty State */}
            {(!details?.experiences || details.experiences.length === 0) && 
             (!details?.projects || details.projects.length === 0) && 
             (!details?.educations || details.educations.length === 0) && 
             (!details?.certificates || details.certificates.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-12 border border-gray-200 text-center"
              >
                <div className="max-w-md mx-auto">
                  <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Professional Profile</h3>
                  <p className="text-gray-600 mb-6">
                    Start showcasing your work experience, projects, education, and skills. Click "Edit Profile" to add your information.
                  </p>
                  <Link
                    href="/update"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Add Your Information
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {details?.experiences && details.experiences.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                </div>
                <div className="space-y-8">
                  {details.experiences.map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-blue-200 last:border-l-0 pb-8 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {exp.jobTitle || exp.job_title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {exp.companyName || exp.company_name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(exp.startDate || exp.start_date)} - {formatDate(exp.endDate || exp.end_date)}
                        </p>
                        {(exp.jobDescription || exp.job_description) && (
                          <p className="mt-3 text-gray-700 leading-relaxed">
                            {exp.jobDescription || exp.job_description}
                          </p>
                        )}
                        {exp.salary && (
                          <p className="mt-2 text-sm text-gray-600">
                            <strong>Salary:</strong> {exp.salary}
                          </p>
                        )}
                        {(exp.managerName || exp.manager_name) && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Manager:</strong> {exp.managerName || exp.manager_name}
                            {(exp.managerEmail || exp.manager_email) && 
                              ` (${exp.managerEmail || exp.manager_email})`
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects Section */}
            {details?.projects && details.projects.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Code2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                </div>
                <div className="space-y-6">
                  {details.projects.map((project, index) => {
                    const demoUrl = project.demoLink || project.demo_link;
                    const isYouTube = demoUrl && (demoUrl.includes('youtube.com') || demoUrl.includes('youtu.be'));
                    
                    // Extract YouTube video ID
                    let youtubeId = '';
                    if (isYouTube && demoUrl) {
                      const youtubeMatch = demoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                      youtubeId = youtubeMatch ? youtubeMatch[1] : '';
                    }

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                            {project.description && (
                              <p className="text-gray-700 mb-3">{project.description}</p>
                            )}
                            {project.technologies && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {project.technologies.split(',').map((tech, i) => (
                                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(project.startDate || project.start_date) && (
                              <p className="text-sm text-gray-500">
                                {formatDate(project.startDate || project.start_date)} - {formatDate(project.endDate || project.end_date)}
                              </p>
                            )}
                            {project.responsibilities && (
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Responsibilities:</strong> {project.responsibilities}
                              </p>
                            )}
                            {project.contributors && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Contributors:</strong> {project.contributors}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* YouTube Embed */}
                        {isYouTube && youtubeId && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-gray-300">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title={project.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}

                        {/* Source Code Button */}
                        <div className="flex gap-3 mt-4">
                          {(project.sourceLink || project.source_link) && (
                            <a
                              href={project.sourceLink || project.source_link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm transition-colors font-medium"
                            >
                              <Github className="w-4 h-4" />
                              Source Code
                            </a>
                          )}
                          {/* Show regular link button for non-YouTube URLs */}
                          {demoUrl && !isYouTube && (
                            <a
                              href={demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors font-medium"
                            >
                              <Globe className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Education Section */}
            {details?.educations && details.educations.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="space-y-6">
                  {details.educations.map((edu, index) => (
                    <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                      {edu.degree && (
                        <p className="text-purple-600 font-medium text-sm mt-1">{edu.degree}</p>
                      )}
                      {(edu.fieldOfStudy || edu.field_of_study) && (
                        <p className="text-gray-600 text-sm">{edu.fieldOfStudy || edu.field_of_study}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(edu.startDate || edu.start_date)} - {formatDate(edu.endDate || edu.end_date)}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Certificates Section */}
            {details?.certificates && details.certificates.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {details.certificates.map((cert, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      {cert.issuer && (
                        <p className="text-amber-600 font-medium text-sm mt-1">{cert.issuer}</p>
                      )}
                      {(cert.issueDate || cert.issue_date) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Issued: {formatDate(cert.issueDate || cert.issue_date)}
                        </p>
                      )}
                      {(cert.credentialId || cert.credential_id) && (
                        <p className="text-xs text-gray-600 mt-1">
                          ID: {cert.credentialId || cert.credential_id}
                        </p>
                      )}
                      {(cert.credentialUrl || cert.credential_url) && (
                        <a
                          href={cert.credentialUrl || cert.credential_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Certificate <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Contact Information */}
            {(details?.street_address || details?.postal_code) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow p-8 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  {details.street_address && (
                    <p>{details.street_address}</p>
                  )}
                  {details.city && details.region && (
                    <p>{details.city}, {details.region}</p>
                  )}
                  {details.postal_code && (
                    <p>{details.postal_code}</p>
                  )}
                </div>
              </motion.section>
            )}

        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={loginPromptConfig.message}
        action={loginPromptConfig.action}
      />
    </div>
  );
};

export default PortfolioProfile;
