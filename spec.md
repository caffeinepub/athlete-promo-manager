# Athlete Promo Manager

## Current State
Workspace is empty. Rebuilding from scratch.

## Requested Changes (Diff)

### Add
- Athlete profile management (name, sport, position, school, graduation year, GPA, height/weight, contact info)
- Achievement logger (game stats, awards, milestones for football and basketball)
- AI Content Generator: auto-suggests 3 platform-specific posts from latest achievements; also accepts custom user prompts to generate targeted posts
- Social media post formatting for Twitter/X (280 chars), Instagram (caption + hashtags), Facebook (long-form narrative)
- Scholarship pipeline tracker (target schools, status, notes, deadlines)
- Media library: photo and video highlight clip upload using blob-storage; inline video preview
- Sample/demo data pre-loaded so the platform is visibly working on first load
- Authorization with role-based access (athlete/admin)
- All previous bug fixes: any authenticated user can mutate data; no duplicate posts on status update; proper sort comparators

### Modify
- N/A (fresh build)

### Remove
- N/A (fresh build)

## Implementation Plan
1. Select components: authorization, blob-storage
2. Generate Motoko backend: athlete profile, achievements, generated posts (with platform + status), scholarship targets, media items
3. Build React frontend with 5 tabs: Dashboard, Achievements, Content Generator, Scholarships, Media Library
4. Seed frontend with demo athlete data (Marcus Johnson, #12 QB, sample achievements, pre-generated posts)
5. Wire blob-storage for photo/video upload with inline preview
6. Deploy draft
