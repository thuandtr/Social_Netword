# Newsfeed Page - Automatic Activity Feed

This directory contains the implementation of an **automatic activity feed** for the professional social network. Unlike traditional social networks where users manually create posts, this system automatically generates activity posts when users update their profiles.

## Concept

The newsfeed is **automatically populated** based on user actions:

### Automatic Activity Generation

When users update their profiles, the system automatically creates activity posts for:

- **🎓 Education Updates**
  - Adding a new school/university → "Started Education" activity
  - Completing education (with end date) → "Completed Education" activity

- **💼 Work Experience**
  - Adding new job → "Started New Position" activity
  - Ending employment → "Position Ended" activity

- **🏆 Certificates**
  - Adding certificate → "Earned Certificate" activity

- **🚀 Projects**
  - Creating new project → "Created Project" activity
  - Updating project → "Updated Project" activity

- **✏️ Profile Changes**
  - Significant profile updates → "Updated Profile" activity

## Features Implemented

### 1. **Automatic Activity Display**
- Beautiful, context-aware cards for each activity type
- Rich information display based on activity type
- Automatic timestamp formatting ("2h ago", "5d ago")
- User avatars with links to profiles
- Activity type badges with color coding

### 2. **Project Showcase**
- Displays project name, description, and technologies
- Links to source code (GitHub) and live demos
- Shows contributors list
- Technology tags visualization

### 3. **Collaboration System** 🆕
- "Request to Collaborate" button on project activities
- Users can request to join projects
- Owner receives collaboration requests
- Contributors can be added directly through profiles

### 4. **Reactions System**
- Single emoji reaction (🎉) per activity
- Toggle reaction on/off
- Reaction count display
- Visual feedback for user's own reactions

### 5. **Comments System**
- Add comments to any activity
- View all comments with timestamps
- Expandable comment sections
- Real-time comment updates

### 6. **UI/UX Features**
- Dark mode support
- Smooth animations and transitions
- Loading states
- Empty states with helpful messages
- Responsive design
- Hover effects and visual feedback


## File Structure

```
newfeed/
├── page.tsx                          # Server component - handles auth
├── NewsfeedClient.tsx                # Client component - main logic & activity types
└── components/
    ├── ActivityCard.tsx              # Activity display with collaboration button
    └── CommentSection.tsx            # Comments UI
```

## TypeScript Types

### Core Types (exported from `NewsfeedClient.tsx`):

```typescript
type ActivityType = 
  | 'education_added' 
  | 'education_completed'
  | 'job_started'
  | 'job_ended'
  | 'certificate_earned'
  | 'project_created'
  | 'project_updated'
  | 'profile_updated'

type Activity = {
  id: string
  user_id: number
  username: string
  avatar_url?: string | null
  activity_type: ActivityType
  activity_data: ActivityData
  created_at: string
  reactions: {
    emoji: string
    count: number
    userReacted: boolean
  }
  comments: Comment[]
}

type ActivityData = {
  // For education
  school?: string
  degree?: string
  field_of_study?: string
  // For job
  company_name?: string
  job_title?: string
  // For certificate
  certificate_name?: string
  issuer?: string
  // For project
  project_name?: string
  project_description?: string
  source_link?: string
  demo_link?: string
  technologies?: string
  contributors?: string
}
```


## Backend Integration

### Required Backend Endpoints:

#### Activity Feed
```typescript
GET  /api/activities           // Get all activities (paginated)
GET  /api/activities/user/:id  // Get activities for specific user
POST /api/activities           // Create activity (called internally when profile updates)
```

#### Reactions
```typescript
POST   /api/activities/:id/react    // Toggle reaction
GET    /api/activities/:id/reactions // Get all reactions
DELETE /api/activities/:id/react     // Remove reaction
```

#### Comments
```typescript
GET  /api/activities/:id/comments       // Get comments
POST /api/activities/:id/comments       // Add comment
PUT  /api/activities/:id/comments/:cid  // Edit comment
DELETE /api/activities/:id/comments/:cid // Delete comment
```

#### Collaboration Requests
```typescript
POST /api/collaboration/request     // Send collaboration request
GET  /api/collaboration/received    // Get received requests
GET  /api/collaboration/sent        // Get sent requests
PUT  /api/collaboration/:id/accept  // Accept request
PUT  /api/collaboration/:id/reject  // Reject request
```

### Activity Generation Logic

When users update their profile via `PUT /user/details`, the backend should:

1. **Compare old and new data** to detect changes
2. **Generate appropriate activities**:
   - New education entry → `education_added`
   - Education with end_date → `education_completed`
   - New experience → `job_started`
   - Experience with end_date → `job_ended`
   - New certificate → `certificate_earned`
   - New project → `project_created`
   - Updated project → `project_updated`

3. **Insert into activities table** with relevant data in JSON format

### Example Activity Creation (Backend):

```typescript
// In updateUserDetails handler, after successful update:

// Check for new projects
const newProjects = req.body.projects.filter(p => !existingProjectIds.includes(p.id))
for (const project of newProjects) {
  await conn.query(
    'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
    [
      userId,
      'project_created',
      JSON.stringify({
        project_name: project.name,
        project_description: project.description,
        source_link: project.sourceLink,
        demo_link: project.demoLink,
        technologies: project.technologies,
        contributors: project.contributors
      })
    ]
  )
}
```


## Collaboration System

### How It Works:

1. **User sees a project** in the activity feed
2. **Clicks "Request to Collaborate"** button
3. **System sends request** to project owner
4. **Owner reviews request** and can:
   - Accept → User added as contributor
   - Reject → Request declined
5. **Accepted contributors** are:
   - Added to `project_contributors` table
   - Can be displayed on project/profile pages
   - Optionally given direct edit access

### Database Tables (See `/backend/migrations/002_activity_feed.sql`):

- `activities` - Stores all activity feed items
- `activity_reactions` - User reactions to activities
- `activity_comments` - Comments on activities
- `collaboration_requests` - Project collaboration requests
- `project_contributors` - Approved project contributors

## Styling

- Uses Tailwind CSS
- Dark mode compatible
- Follows existing design system
- Animations defined in `globals.css`

## Future Enhancements

- [ ] Real-time activity updates (WebSocket)
- [ ] Activity filtering by type
- [ ] User mentions in comments (@username)
- [ ] Rich media in project activities
- [ ] Notification system for reactions/comments
- [ ] Privacy settings for activities
- [ ] Activity analytics (views, engagement)
- [ ] Direct messaging for collaboration
- [ ] Project team management
- [ ] Activity search and filtering
- [ ] Export activities/CV generation
- [ ] Multiple emoji reactions
- [ ] Activity editing/deletion

