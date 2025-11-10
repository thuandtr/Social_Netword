# Activity Feed System - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTIONS                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    /update Page (Frontend)                       │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐   │
│  │  Education   │  Experience  │ Certificates │  Projects  │   │
│  └──────────────┴──────────────┴──────────────┴────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Save Button Clicked)
┌─────────────────────────────────────────────────────────────────┐
│              Backend: PUT /user/details                          │
│  1. Save user_details to database                               │
│  2. Compare old vs new data                                     │
│  3. Generate activities for changes                             │
│                                                                  │
│  generateActivities():                                          │
│    - New education? → INSERT education_added activity           │
│    - Education complete? → INSERT education_completed activity  │
│    - New job? → INSERT job_started activity                     │
│    - New project? → INSERT project_created activity             │
│    - Updated project? → INSERT project_updated activity         │
│    - New cert? → INSERT certificate_earned activity             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Database: activities table                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id | user_id | activity_type | activity_data | created_at│  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 1  | 42      | project_created | {...json...} | 2025-... │  │
│  │ 2  | 42      | education_comp  | {...json...} | 2025-... │  │
│  │ 3  | 99      | job_started     | {...json...} | 2025-... │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend: GET /activity (API Call)                   │
│  - Fetch activities from database                               │
│  - Join with users and user_details tables                      │
│  - Include reaction & comment counts                            │
│  - Return JSON                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  /newfeed Page (Frontend)                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 🎓 johndoe completed Bachelor's at MIT            [🎉 12] ││
│  │    2 hours ago                                   💬 Comment││
│  │    Field: Computer Science                                 ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 🚀 janedoe created project: E-commerce Platform   [🎉 8]  ││
│  │    5 hours ago                        💬 Comment            ││
│  │    React, Node.js, PostgreSQL                              ││
│  │    🔗 View Source   🌐 Live Demo                           ││
│  │    [📋 Request to Collaborate]  ← NEW FEATURE!             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 💼 alexcoder started as Senior Dev at TechCorp    [🎉 15] ││
│  │    1 day ago                                     💬 Comment││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Collaboration Request Flow

```
User A creates project
        │
        ▼
┌───────────────────┐
│ Activity Created  │
│ (project_created) │
└───────────────────┘
        │
        ▼ (Shows in newsfeed)
┌────────────────────────────────────┐
│ User B sees project activity       │
│ Clicks "Request to Collaborate"    │
└────────────────────────────────────┘
        │
        ▼ POST /collaboration/request
┌────────────────────────────────────┐
│ collaboration_requests table       │
│ status: 'pending'                  │
│ project_owner_id: User A           │
│ requester_id: User B               │
└────────────────────────────────────┘
        │
        ▼ (User A receives notification)
┌────────────────────────────────────┐
│ User A reviews request             │
│ Clicks "Accept" or "Reject"        │
└────────────────────────────────────┘
        │
        ├─────Accept──────┐
        │                 ▼
        │     ┌────────────────────────┐
        │     │ status: 'accepted'     │
        │     │ Add to contributors    │
        │     └────────────────────────┘
        │                 │
        │                 ▼
        │     ┌────────────────────────┐
        │     │ project_contributors   │
        │     │ user_id: User B        │
        │     │ project_name: X        │
        │     └────────────────────────┘
        │
        └─────Reject──────┐
                          ▼
              ┌────────────────────────┐
              │ status: 'rejected'     │
              │ Request ends           │
              └────────────────────────┘
```

## Activity Type Triggers

```
Profile Update Action                 →  Generated Activity
─────────────────────────────────────────────────────────────
Add education (no end date)           →  education_added
Add education (with end date)         →  education_completed
Add work experience (no end date)     →  job_started
Add work experience (with end date)   →  job_ended
Add certificate                       →  certificate_earned
Add new project                       →  project_created
Update existing project               →  project_updated
Update basic profile info             →  profile_updated
```

## Data Flow Example

### Scenario: User adds a new project

**1. Frontend Form Submission:**
```javascript
{
  projects: [
    {
      name: "Task Manager App",
      description: "A full-stack task management system",
      sourceLink: "https://github.com/user/tasks",
      demoLink: "https://tasks.demo.com",
      technologies: "React, Node.js, MongoDB",
      contributors: ""
    }
  ]
}
```

**2. Backend Processing:**
```typescript
// Detect it's a new project
const isNew = !oldProjects.find(p => p.name === "Task Manager App")

// Generate activity
await conn.query(
  'INSERT INTO activities (user_id, activity_type, activity_data) VALUES (?, ?, ?)',
  [
    userId,
    'project_created',
    JSON.stringify({
      project_name: "Task Manager App",
      project_description: "A full-stack task management system",
      source_link: "https://github.com/user/tasks",
      demo_link: "https://tasks.demo.com",
      technologies: "React, Node.js, MongoDB"
    })
  ]
)
```

**3. Frontend Display:**
```tsx
<ActivityCard>
  🚀 username created project: Task Manager App
  
  A full-stack task management system
  
  [React] [Node.js] [MongoDB]
  
  🔗 View Source  🌐 Live Demo
  
  [📋 Request to Collaborate]
  
  [🎉 0]  [💬 Comments]
</ActivityCard>
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js 14)         │
│  - TypeScript                           │
│  - React Server Components              │
│  - Tailwind CSS                         │
│  - Axios for API calls                  │
└─────────────────────────────────────────┘
              │
              ▼ HTTP Requests
┌─────────────────────────────────────────┐
│         Backend (Node.js/Express)       │
│  - TypeScript                           │
│  - JWT Authentication                   │
│  - Activity Generation Logic            │
└─────────────────────────────────────────┘
              │
              ▼ SQL Queries
┌─────────────────────────────────────────┐
│            Database (MySQL)             │
│  - activities                           │
│  - activity_reactions                   │
│  - activity_comments                    │
│  - collaboration_requests               │
│  - project_contributors                 │
└─────────────────────────────────────────┘
```
