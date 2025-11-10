import { pool } from "../mysql/connection";
import { ResultSetHeader } from "mysql2";

type ActivityType = 
  | 'education_added' 
  | 'education_completed'
  | 'job_started'
  | 'job_ended'
  | 'certificate_earned'
  | 'project_created'
  | 'project_updated'
  | 'profile_updated';

/**
 * Creates an activity in the activity feed
 */
export const createActivityEntry = async (
  userId: number,
  activityType: ActivityType,
  activityData: any
) => {
  try {
    await pool.query(
      `INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)`,
      [userId, activityType, JSON.stringify(activityData)]
    );
    console.log(`✅ Activity created: ${activityType} for user ${userId}`);
  } catch (error) {
    console.error(`❌ Failed to create activity: ${activityType}`, error);
  }
};

/**
 * Compares old and new profile data to generate activities
 */
export const generateActivitiesFromProfileUpdate = async (
  userId: number,
  oldData: any,
  newData: any
) => {
  const activities: Promise<void>[] = [];

  // Check for new educations
  if (newData.educations && Array.isArray(newData.educations)) {
    const oldEducations = oldData?.educations || [];
    const newEducations = newData.educations;

    newEducations.forEach((edu: any) => {
      const isNew = !oldEducations.find((old: any) => 
        old.school === edu.school && 
        old.degree === edu.degree && 
        old.fieldOfStudy === edu.fieldOfStudy
      );

      if (isNew) {
        // Check if it's completed or just added
        const activityType = edu.endDate && new Date(edu.endDate) <= new Date() 
          ? 'education_completed' 
          : 'education_added';

        activities.push(
          createActivityEntry(userId, activityType, {
            school: edu.school,
            degree: edu.degree,
            field_of_study: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
          })
        );
      }
    });
  }

  // Check for new jobs/experiences
  if (newData.experiences && Array.isArray(newData.experiences)) {
    const oldExperiences = oldData?.experiences || [];
    const newExperiences = newData.experiences;

    newExperiences.forEach((exp: any) => {
      const isNew = !oldExperiences.find((old: any) => 
        old.company === exp.company && 
        old.position === exp.position
      );

      if (isNew) {
        // Determine if job started or ended
        const activityType = exp.endDate ? 'job_ended' : 'job_started';

        activities.push(
          createActivityEntry(userId, activityType, {
            company_name: exp.company,
            job_title: exp.position,
            start_date: exp.startDate,
            end_date: exp.endDate,
            description: exp.description,
          })
        );
      }
    });
  }

  // Check for new certificates
  if (newData.certificates && Array.isArray(newData.certificates)) {
    const oldCertificates = oldData?.certificates || [];
    const newCertificates = newData.certificates;

    newCertificates.forEach((cert: any) => {
      const isNew = !oldCertificates.find((old: any) => 
        old.name === cert.name && 
        old.issuer === cert.issuer
      );

      if (isNew) {
        activities.push(
          createActivityEntry(userId, 'certificate_earned', {
            certificate_name: cert.name,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            credential_id: cert.credentialId,
            credential_url: cert.credentialUrl,
          })
        );
      }
    });
  }

  // Check for new projects
  if (newData.projects && Array.isArray(newData.projects)) {
    const oldProjects = oldData?.projects || [];
    const newProjects = newData.projects;

    newProjects.forEach((project: any) => {
      const existingProject = oldProjects.find((old: any) => 
        old.name === project.name
      );

      if (!existingProject) {
        // New project
        activities.push(
          createActivityEntry(userId, 'project_created', {
            project_name: project.name,
            project_description: project.description,
            source_link: project.sourceLink,
            demo_link: project.demoLink,
            technologies: project.technologies?.join(', '),
            contributors: project.contributors,
          })
        );
      } else {
        // Check if project was updated significantly
        const hasSignificantChange = 
          existingProject.description !== project.description ||
          existingProject.sourceLink !== project.sourceLink ||
          existingProject.demoLink !== project.demoLink;

        if (hasSignificantChange) {
          activities.push(
            createActivityEntry(userId, 'project_updated', {
              project_name: project.name,
              project_description: project.description,
              source_link: project.sourceLink,
              demo_link: project.demoLink,
              technologies: project.technologies?.join(', '),
              contributors: project.contributors,
            })
          );
        }
      }
    });
  }

  // Wait for all activities to be created
  await Promise.all(activities);
};
