# Activity Feed Backend Implementation Guide

This document provides guidance on implementing the automatic activity feed system in the backend.

## Overview

The activity feed automatically generates posts when users update their profiles. Instead of users manually creating posts, the system tracks changes to education, work experience, certificates, and projects, then creates activity records.

## Database Schema

Run the migration file: `/backend/migrations/002_activity_feed.sql`

This creates 5 tables:
- `activities` - Main activity feed
- `activity_reactions` - User reactions
- `activity_comments` - Comments on activities
- `collaboration_requests` - Project collaboration requests
- `project_contributors` - Approved contributors

## Implementation Steps

### 1. Modify `updateUserDetails` Handler

Location: `/backend/src/handlers/user-handler.ts`

Add activity generation logic after successful profile update:

```typescript
export const updateUserDetails = async (req: Request, res: Response) => {
    let conn;
    try {
        const userId = res.locals.jwtData?.id;
        // ... existing validation ...

        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Fetch existing user details for comparison
        const [existingRows] = await conn.query<any[]>(
            'SELECT * FROM user_details WHERE user_id = ?',
            [userId]
        );
        const existingDetails = existingRows[0];

        // ... perform update as usual ...
        await conn.query(UPSERT_USER_DETAILS_STATEMENT, [...]);

        // Generate activities based on changes
        await generateActivities(conn, userId, existingDetails, req.body);

        await conn.commit();
        return res.status(200).json({ message: "User details saved" });
    } catch (error) {
        // ... error handling ...
    }
}
```

### 2. Create Activity Generation Function

Add to `/backend/src/handlers/user-handler.ts` or create new file:

```typescript
async function generateActivities(
    conn: any,
    userId: number,
    oldDetails: any,
    newDetails: any
) {
    const oldEducations = oldDetails?.educations ? JSON.parse(oldDetails.educations) : [];
    const newEducations = newDetails.educations || [];
    const oldProjects = oldDetails?.projects ? JSON.parse(oldDetails.projects) : [];
    const newProjects = newDetails.projects || [];
    const oldExperiences = oldDetails?.experiences ? JSON.parse(oldDetails.experiences) : [];
    const newExperiences = newDetails.experiences || [];
    const oldCertificates = oldDetails?.certificates ? JSON.parse(oldDetails.certificates) : [];
    const newCertificates = newDetails.certificates || [];

    // Check for new educations
    for (const edu of newEducations) {
        const isNew = !oldEducations.some((old: any) => 
            old.school === edu.school && old.degree === edu.degree
        );
        
        if (isNew) {
            const activityType = edu.endDate ? 'education_completed' : 'education_added';
            await conn.query(
                'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
                [userId, activityType, JSON.stringify({
                    school: edu.school,
                    degree: edu.degree,
                    field_of_study: edu.fieldOfStudy
                })]
            );
        }
    }

    // Check for new jobs
    for (const exp of newExperiences) {
        const isNew = !oldExperiences.some((old: any) => 
            old.companyName === exp.companyName && old.jobTitle === exp.jobTitle
        );
        
        if (isNew) {
            const activityType = exp.endDate ? 'job_ended' : 'job_started';
            await conn.query(
                'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
                [userId, activityType, JSON.stringify({
                    company_name: exp.companyName,
                    job_title: exp.jobTitle
                })]
            );
        }
    }

    // Check for new certificates
    for (const cert of newCertificates) {
        const isNew = !oldCertificates.some((old: any) => 
            old.name === cert.name && old.issuer === cert.issuer
        );
        
        if (isNew) {
            await conn.query(
                'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
                [userId, 'certificate_earned', JSON.stringify({
                    certificate_name: cert.name,
                    issuer: cert.issuer
                })]
            );
        }
    }

    // Check for new or updated projects
    for (const proj of newProjects) {
        const oldProj = oldProjects.find((old: any) => old.name === proj.name);
        
        if (!oldProj) {
            // New project
            await conn.query(
                'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
                [userId, 'project_created', JSON.stringify({
                    project_name: proj.name,
                    project_description: proj.description,
                    source_link: proj.sourceLink,
                    demo_link: proj.demoLink,
                    technologies: proj.technologies,
                    contributors: proj.contributors
                })]
            );
        } else if (
            oldProj.description !== proj.description ||
            oldProj.sourceLink !== proj.sourceLink ||
            oldProj.demoLink !== proj.demoLink
        ) {
            // Updated project
            await conn.query(
                'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
                [userId, 'project_updated', JSON.stringify({
                    project_name: proj.name,
                    project_description: proj.description,
                    source_link: proj.sourceLink,
                    demo_link: proj.demoLink,
                    technologies: proj.technologies
                })]
            );
        }
    }
}
```

### 3. Create Activity Routes

Create `/backend/src/routers/activity.ts`:

```typescript
import { Router } from "express";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";
import * as activityHandler from "../handlers/activity-handler";

const activityRouter = Router();

// Get all activities (paginated)
activityRouter.get("/", activityHandler.getAllActivities);

// Get activities for specific user
activityRouter.get("/user/:userId", activityHandler.getUserActivities);

// React to activity
activityRouter.post("/:id/react", validateAuthTokens, activityHandler.toggleReaction);

// Get reactions
activityRouter.get("/:id/reactions", activityHandler.getReactions);

// Comments
activityRouter.get("/:id/comments", activityHandler.getComments);
activityRouter.post("/:id/comments", validateAuthTokens, activityHandler.addComment);
activityRouter.delete("/:id/comments/:commentId", validateAuthTokens, activityHandler.deleteComment);

export default activityRouter;
```

### 4. Create Activity Handler

Create `/backend/src/handlers/activity-handler.ts`:

```typescript
import { Request, Response } from "express";
import pool from "../mysql/connection";

export const getAllActivities = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const [activities] = await pool.query<any[]>(
            `SELECT a.*, u.username, u.email, ud.avatar_url
             FROM activities a
             JOIN users u ON a.user_id = u.id
             LEFT JOIN user_details ud ON u.id = ud.user_id
             ORDER BY a.created_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        // Get reactions and comments count for each activity
        for (const activity of activities) {
            const [reactions] = await pool.query<any[]>(
                'SELECT COUNT(*) as count FROM activity_reactions WHERE activity_id = ?',
                [activity.id]
            );
            activity.reaction_count = reactions[0].count;

            const [comments] = await pool.query<any[]>(
                'SELECT COUNT(*) as count FROM activity_comments WHERE activity_id = ?',
                [activity.id]
            );
            activity.comment_count = comments[0].count;

            // Parse JSON activity_data
            if (activity.activity_data) {
                activity.activity_data = JSON.parse(activity.activity_data);
            }
        }

        return res.status(200).json({ activities, page, limit });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return res.status(500).json({ message: "Failed to fetch activities" });
    }
};

export const toggleReaction = async (req: Request, res: Response) => {
    try {
        const activityId = req.params.id;
        const userId = res.locals.jwtData?.id;

        const [existing] = await pool.query<any[]>(
            'SELECT id FROM activity_reactions WHERE activity_id = ? AND user_id = ?',
            [activityId, userId]
        );

        if (existing.length > 0) {
            // Remove reaction
            await pool.query(
                'DELETE FROM activity_reactions WHERE activity_id = ? AND user_id = ?',
                [activityId, userId]
            );
            return res.status(200).json({ message: "Reaction removed", reacted: false });
        } else {
            // Add reaction
            await pool.query(
                'INSERT INTO activity_reactions (activity_id, user_id) VALUES (?, ?)',
                [activityId, userId]
            );
            return res.status(200).json({ message: "Reaction added", reacted: true });
        }
    } catch (error) {
        console.error("Error toggling reaction:", error);
        return res.status(500).json({ message: "Failed to toggle reaction" });
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const activityId = req.params.id;

        const [comments] = await pool.query<any[]>(
            `SELECT c.*, u.username, ud.avatar_url
             FROM activity_comments c
             JOIN users u ON c.author_id = u.id
             LEFT JOIN user_details ud ON u.id = ud.user_id
             WHERE c.activity_id = ?
             ORDER BY c.created_at ASC`,
            [activityId]
        );

        return res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const activityId = req.params.id;
        const userId = res.locals.jwtData?.id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const [result] = await pool.query<any>(
            'INSERT INTO activity_comments (activity_id, author_id, content) VALUES (?, ?, ?)',
            [activityId, userId, content]
        );

        return res.status(201).json({ 
            message: "Comment added",
            commentId: result.insertId
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Failed to add comment" });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId;
        const userId = res.locals.jwtData?.id;

        // Check if user owns the comment
        const [comment] = await pool.query<any[]>(
            'SELECT author_id FROM activity_comments WHERE id = ?',
            [commentId]
        );

        if (comment.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment[0].author_id !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await pool.query('DELETE FROM activity_comments WHERE id = ?', [commentId]);

        return res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Failed to delete comment" });
    }
};
```

### 5. Register Activity Router

In `/backend/src/routers/index.ts`:

```typescript
import activityRouter from "./activity";

// ... existing code ...

appRouter.use("/activity", activityRouter);
```

### 6. Create Collaboration Routes (Optional)

Create `/backend/src/routers/collaboration.ts`:

```typescript
import { Router } from "express";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";
import * as collabHandler from "../handlers/collaboration-handler";

const collabRouter = Router();

collabRouter.post("/request", validateAuthTokens, collabHandler.sendRequest);
collabRouter.get("/received", validateAuthTokens, collabHandler.getReceivedRequests);
collabRouter.get("/sent", validateAuthTokens, collabHandler.getSentRequests);
collabRouter.put("/:id/accept", validateAuthTokens, collabHandler.acceptRequest);
collabRouter.put("/:id/reject", validateAuthTokens, collabHandler.rejectRequest);

export default collabRouter;
```

## Testing

1. Update a user's profile with new education/job/project
2. Check the activities table for new records
3. Call GET /activity to verify activities appear
4. Test reactions and comments endpoints

## Frontend Integration

Update `/frontend/app/newfeed/NewsfeedClient.tsx`:

```typescript
// Replace mock data with real API call
useEffect(() => {
  const loadActivities = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/activity')
      setActivities(res.data.activities)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  loadActivities()
}, [currentUser])
```

## Notes

- Activities are immutable (users cannot edit/delete them)
- Activities are automatically generated - no manual creation
- One activity per significant change
- Consider rate limiting to prevent spam
- Add caching for frequently accessed activities
