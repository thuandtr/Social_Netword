import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  getActivities,
  createActivity,
  toggleReaction,
  addComment,
  requestCollaboration,
  getCollaborationRequests,
  updateCollaborationRequest,
} from "../handlers/activity-handler";

const activityRouter = Router();

// Get all activities (newsfeed)
activityRouter.get("/", verifyToken, getActivities);

activityRouter.post("/test-create", verifyToken, createActivity);

// Create a new activity (manual or triggered)
activityRouter.post("/", verifyToken, createActivity);

// Toggle reaction on an activity
activityRouter.post("/:activityId/reaction", verifyToken, toggleReaction);

// Add comment to an activity
activityRouter.post("/:activityId/comment", verifyToken, addComment);

// Request collaboration on a project
activityRouter.post("/:activityId/collaborate", verifyToken, requestCollaboration);

// Get collaboration requests (for project owners)
activityRouter.get("/collaborations", verifyToken, getCollaborationRequests);

// Update collaboration request status (accept/reject)
activityRouter.put("/collaborations/:requestId", verifyToken, updateCollaborationRequest);

export default activityRouter;
