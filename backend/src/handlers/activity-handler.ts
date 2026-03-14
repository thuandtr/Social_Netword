import { Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../mysql/connection";

// Get all activities with reactions and comments
export const getActivities = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        // Get activities with user information
        const [activities] = await pool.query<RowDataPacket[]>(
            `SELECT 
                a.id,
                a.user_id,
                a.activity_type,
                a.activity_data,
                a.created_at,
                u.username,
                ud.avatar_url
            FROM activities a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN user_details ud ON u.id = ud.user_id
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        // Get reactions for each activity
        const activityIds = activities.map((a: any) => a.id);
        let reactions: RowDataPacket[] = [];
        
        if (activityIds.length > 0) {
            [reactions] = await pool.query<RowDataPacket[]>(
                `SELECT 
                    activity_id,
                    emoji,
                    COUNT(*) as count,
                    MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as user_reacted
                FROM activity_reactions
                WHERE activity_id IN (?)
                GROUP BY activity_id, emoji`,
                [userId, activityIds]
            );
        }

        // Get comments for each activity
        let comments: RowDataPacket[] = [];
        
        if (activityIds.length > 0) {
            [comments] = await pool.query<RowDataPacket[]>(
                `SELECT 
                    ac.id,
                    ac.activity_id,
                    ac.content,
                    ac.created_at,
                    u.username,
                    ud.avatar_url
                FROM activity_comments ac
                JOIN users u ON ac.author_id = u.id
                LEFT JOIN user_details ud ON u.id = ud.user_id
                WHERE ac.activity_id IN (?)
                ORDER BY ac.created_at ASC`,
                [activityIds]
            );
        }

        // Combine data
        const activitiesWithData = activities.map((activity: any) => {
            const activityReactions = reactions.filter(
                (r) => r.activity_id === activity.id
            );
            
            const activityComments = comments
                .filter((c) => c.activity_id === activity.id)
                .map((c) => ({
                    id: c.id.toString(),
                    author: {
                        username: c.username,
                        avatar_url: c.avatar_url,
                    },
                    content: c.content,
                    created_at: c.created_at,
                }));

            // Aggregate reactions by emoji
            const reactionMap = new Map();
            activityReactions.forEach((r) => {
                reactionMap.set(r.emoji, {
                    emoji: r.emoji,
                    count: Number(r.count),
                    userReacted: Boolean(r.user_reacted),
                });
            });

            // Parse activity_data if it's a string (from JSON column)
            let parsedActivityData = activity.activity_data;
            if (typeof activity.activity_data === 'string') {
                try {
                    parsedActivityData = JSON.parse(activity.activity_data);
                } catch (error) {
                    console.error('Failed to parse activity_data:', error);
                    parsedActivityData = {};
                }
            }

            return {
                id: activity.id.toString(),
                user_id: activity.user_id,
                username: activity.username,
                avatar_url: activity.avatar_url,
                activity_type: activity.activity_type,
                activity_data: parsedActivityData,
                created_at: activity.created_at,
                reactions: reactionMap.get('🎉') || {
                    emoji: '🎉',
                    count: 0,
                    userReacted: false,
                },
                comments: activityComments,
            };
        });

        res.status(200).json({ activities: activitiesWithData });
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
};

// Create a new activity
export const createActivity = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activity_type, activity_data } = req.body;

        if (!activity_type || !activity_data) {
            return res.status(400).json({ error: "activity_type and activity_data are required" });
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)`,
            [userId, activity_type, JSON.stringify(activity_data)]
        );

        res.status(201).json({
            message: "Activity created successfully",
            activityId: result.insertId,
        });
    } catch (error) {
        console.error("Error creating activity:", error);
        res.status(500).json({ error: "Failed to create activity" });
    }
};

// Toggle reaction on an activity
export const toggleReaction = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activityId } = req.params;
        const { emoji = '🎉' } = req.body;

        // Check if user already reacted
        const [existingReaction] = await pool.query<RowDataPacket[]>(
            `SELECT id FROM activity_reactions WHERE activity_id = ? AND user_id = ?`,
            [activityId, userId]
        );

        if (existingReaction.length > 0) {
            // Remove reaction
            await pool.query(
                `DELETE FROM activity_reactions WHERE activity_id = ? AND user_id = ?`,
                [activityId, userId]
            );
            res.status(200).json({ message: "Reaction removed", reacted: false });
        } else {
            // Add reaction
            await pool.query(
                `INSERT INTO activity_reactions (activity_id, user_id, emoji) VALUES (?, ?, ?)`,
                [activityId, userId, emoji]
            );
            res.status(201).json({ message: "Reaction added", reacted: true });
        }
    } catch (error) {
        console.error("Error toggling reaction:", error);
        res.status(500).json({ error: "Failed to toggle reaction" });
    }
};

// Add comment to an activity
export const addComment = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activityId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO activity_comments (activity_id, author_id, content) VALUES (?, ?, ?)`,
            [activityId, userId, content]
        );

        // Get the created comment with user info
        const [comments] = await pool.query<RowDataPacket[]>(
            `SELECT 
                ac.id,
                ac.content,
                ac.created_at,
                u.username,
                ud.avatar_url
            FROM activity_comments ac
            JOIN users u ON ac.author_id = u.id
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE ac.id = ?`,
            [result.insertId]
        );

        const comment = comments[0];
        res.status(201).json({
            message: "Comment added successfully",
            comment: {
                id: comment.id.toString(),
                author: {
                    username: comment.username,
                    avatar_url: comment.avatar_url,
                },
                content: comment.content,
                created_at: comment.created_at,
            },
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Request collaboration on a project
export const requestCollaboration = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activityId } = req.params;
        const { message } = req.body;

        // Get the activity and project owner
        const [activities] = await pool.query<RowDataPacket[]>(
            `SELECT user_id, activity_type FROM activities WHERE id = ?`,
            [activityId]
        );

        if (activities.length === 0) {
            return res.status(404).json({ error: "Activity not found" });
        }

        const activity = activities[0];
        
        // Check if activity is a project
        if (!activity.activity_type.includes('project')) {
            return res.status(400).json({ error: "Can only request collaboration on projects" });
        }

        // Check if user is trying to collaborate on their own project
        if (activity.user_id.toString() === userId) {
            return res.status(400).json({ error: "Cannot request collaboration on your own project" });
        }

        // Check if request already exists
        const [existingRequests] = await pool.query<RowDataPacket[]>(
            `SELECT id, status FROM collaboration_requests 
            WHERE requester_id = ? AND activity_id = ?`,
            [userId, activityId]
        );

        if (existingRequests.length > 0) {
            return res.status(400).json({ 
                error: "Collaboration request already exists",
                status: existingRequests[0].status 
            });
        }

        // Create collaboration request
        await pool.query(
            `INSERT INTO collaboration_requests 
            (project_owner_id, requester_id, activity_id, message) 
            VALUES (?, ?, ?, ?)`,
            [activity.user_id, userId, activityId, message || null]
        );

        res.status(201).json({ message: "Collaboration request sent successfully" });
    } catch (error) {
        console.error("Error requesting collaboration:", error);
        res.status(500).json({ error: "Failed to send collaboration request" });
    }
};

// Get collaboration requests
export const getCollaborationRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const status = req.query.status as string || 'pending';

        const [requests] = await pool.query<RowDataPacket[]>(
            `SELECT 
                cr.id,
                cr.status,
                cr.message,
                cr.created_at,
                cr.activity_id,
                u.username as requester_username,
                ud.avatar_url as requester_avatar,
                a.activity_data
            FROM collaboration_requests cr
            JOIN users u ON cr.requester_id = u.id
            LEFT JOIN user_details ud ON u.id = ud.user_id
            JOIN activities a ON cr.activity_id = a.id
            WHERE cr.project_owner_id = ? AND cr.status = ?
            ORDER BY cr.created_at DESC`,
            [userId, status]
        );

        res.status(200).json({ requests });
    } catch (error) {
        console.error("Error fetching collaboration requests:", error);
        res.status(500).json({ error: "Failed to fetch collaboration requests" });
    }
};

// Update collaboration request status
export const updateCollaborationRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'accepted' or 'rejected'" });
        }

        // Verify the request belongs to the current user (project owner)
        const [requests] = await pool.query<RowDataPacket[]>(
            `SELECT project_owner_id, requester_id, activity_id 
            FROM collaboration_requests WHERE id = ?`,
            [requestId]
        );

        if (requests.length === 0) {
            return res.status(404).json({ error: "Collaboration request not found" });
        }

        const request = requests[0];
        
        if (request.project_owner_id.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to update this request" });
        }

        // Update request status
        await pool.query(
            `UPDATE collaboration_requests SET status = ? WHERE id = ?`,
            [status, requestId]
        );

        // If accepted, add to project contributors
        if (status === 'accepted') {
            const [activities] = await pool.query<RowDataPacket[]>(
                `SELECT activity_data FROM activities WHERE id = ?`,
                [request.activity_id]
            );
            
            if (activities.length > 0) {
                const activityData = activities[0].activity_data;
                const projectName = activityData.project_name || 'Unknown Project';

                await pool.query(
                    `INSERT INTO project_contributors (user_id, project_name, role) 
                    VALUES (?, ?, 'Contributor')`,
                    [request.requester_id, projectName]
                );
            }
        }

        res.status(200).json({ 
            message: `Collaboration request ${status}`,
            status 
        });
    } catch (error) {
        console.error("Error updating collaboration request:", error);
        res.status(500).json({ error: "Failed to update collaboration request" });
    }
};

// Update an article activity (owner only)
export const updateActivity = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activityId } = req.params;
        const { activity_data } = req.body;

        if (!activity_data) {
            return res.status(400).json({ error: "activity_data is required" });
        }

        // Verify ownership and type
        const [activities] = await pool.query<RowDataPacket[]>(
            `SELECT id, user_id, activity_type FROM activities WHERE id = ?`,
            [activityId]
        );

        if (activities.length === 0) {
            return res.status(404).json({ error: "Activity not found" });
        }

        if (activities[0].user_id.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this activity" });
        }

        if (activities[0].activity_type !== 'article_posted') {
            return res.status(400).json({ error: "Only article activities can be edited" });
        }

        // Validate required fields
        const { title, url } = activity_data;
        if (!title || !url) {
            return res.status(400).json({ error: "Article title and URL are required" });
        }

        await pool.query(
            `UPDATE activities SET activity_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
            [JSON.stringify(activity_data), activityId, userId]
        );

        res.status(200).json({ message: "Article updated successfully" });
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).json({ error: "Failed to update activity" });
    }
};

// Delete an activity (owner only)
export const deleteActivity = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { activityId } = req.params;

        const [activities] = await pool.query<RowDataPacket[]>(
            `SELECT id, user_id FROM activities WHERE id = ?`,
            [activityId]
        );

        if (activities.length === 0) {
            return res.status(404).json({ error: "Activity not found" });
        }

        if (activities[0].user_id.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this activity" });
        }

        await pool.query(
            `DELETE FROM activities WHERE id = ? AND user_id = ?`,
            [activityId, userId]
        );

        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ error: "Failed to delete activity" });
    }
};
