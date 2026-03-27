# Athlete Promo Manager

## Current State
Workspace is empty -- previous version expired. Full rebuild required.

## Requested Changes (Diff)

### Add
- Full rebuild with MaxPreps-inspired UI (dark navy theme, bold typography, sport card layouts, stat displays)
- Real blob storage for photo and video uploads (no fake handlers)
- Athlete profile page: name, sport (football/basketball), position, jersey number, school, grad year, GPA, height/weight
- Achievements log: game stats per sport (passing yards/TDs for football; points/rebounds/assists for basketball), with date and opponent
- Media Library: upload photos and video highlight clips, inline video preview, real persistence via blob-storage component
- AI Content Generator: auto-generate 3 platform-specific posts (Twitter/X 280-char, Instagram caption+hashtags, Facebook long-form) from athlete data; custom prompt input for user-driven generation
- Scholarship Pipeline: track target schools with status (Interested / Contacted / Official Visit / Offer / Committed)
- Social Posts manager: list generated posts, mark as posted, copy to clipboard
- Demo mode: pre-loaded sample athlete data visible before login

### Modify
- Nothing (fresh build)

### Remove
- Nothing (fresh build)

## Implementation Plan
1. Select `blob-storage` and `authorization` Caffeine components
2. Generate Motoko backend: athlete profile CRUD, achievements CRUD, social posts CRUD, scholarship targets CRUD (blob storage handles media)
3. Build frontend with MaxPreps aesthetic: dark navy (#0a1628) primary, gold/amber accents, bold sans-serif headers, card grid layouts, sidebar navigation with sport icons
4. Wire blob-storage upload hooks for photos and videos
5. Implement AI content generator using deterministic template logic (no external API needed) with platform-specific formatting
6. Deploy
