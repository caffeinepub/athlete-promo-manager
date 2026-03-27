import {
  AchievementCategory,
  CollegeDivision,
  PostStatus,
  ScholarshipStatus,
  SocialPlatform,
  Sport,
} from "./backend";
import type {
  Achievement,
  AthleteProfile,
  ContentPost,
  ScholarshipTarget,
} from "./backend";

export const DEMO_PROFILE: AthleteProfile = {
  name: 'Marcus "MJ" Johnson',
  sport: Sport.both,
  position: "QB / Shooting Guard",
  graduationYear: 2026n,
  gpa: "3.8",
  height: "6'2\"",
  weight: "195 lbs",
  city: "Birmingham",
  state: "AL",
  bio: "Dual-sport athlete from Jefferson High School. Four-year starter at QB with elite arm talent and football IQ. Also a starter on the varsity basketball team averaging 20+ points per game. Academic standout with a 3.8 GPA. Ready to compete at the next level and earn a college scholarship.",
  hudlLink: "https://hudl.com/profile/marcusjohnson12",
  twitterHandle: "@MJ_Johnson12",
  instagramHandle: "@marcusjohnson_12",
};

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1n,
    title: "State Championship Win — 28/34 Passing, 312 Yards, 3 TDs",
    sport: Sport.football,
    category: AchievementCategory.gameStat,
    date: BigInt(new Date("2024-11-15").getTime()) * 1_000_000n,
    description:
      "Led Jefferson High to the 6A State Championship with a dominant performance against rival Hoover HS. Completed 28-of-34 passes for 312 yards and 3 touchdowns with zero interceptions.",
    stats: [
      ["Completions", "28/34"],
      ["Passing Yards", "312"],
      ["Touchdowns", "3"],
      ["INTs", "0"],
      ["Passer Rating", "148.2"],
    ],
  },
  {
    id: 2n,
    title: "All-State First Team Selection — Football 2024",
    sport: Sport.football,
    category: AchievementCategory.award,
    date: BigInt(new Date("2024-12-01").getTime()) * 1_000_000n,
    description:
      "Named to the Alabama 6A All-State First Team at quarterback for the 2024 season. Led the state in passing yards (3,412) and touchdowns (38) among 6A QBs.",
    stats: [
      ["Season Passing Yards", "3,412"],
      ["Season TDs", "38"],
      ["Completion %", "67.4%"],
      ["QBR", "94.1"],
    ],
  },
  {
    id: 3n,
    title: "Basketball: 24 Pts, 8 Rebounds vs Hoover HS",
    sport: Sport.basketball,
    category: AchievementCategory.gameStat,
    date: BigInt(new Date("2025-01-22").getTime()) * 1_000_000n,
    description:
      "Dropped 24 points and grabbed 8 rebounds in a rivalry win over Hoover HS. Hit the game-winning three-pointer with 4 seconds remaining.",
    stats: [
      ["Points", "24"],
      ["Rebounds", "8"],
      ["Assists", "5"],
      ["FG%", "53%"],
      ["3PT", "3/5"],
    ],
  },
  {
    id: 4n,
    title: "1,000 Yard Rushing Milestone",
    sport: Sport.football,
    category: AchievementCategory.milestone,
    date: BigInt(new Date("2024-10-10").getTime()) * 1_000_000n,
    description:
      "Reached 1,000 career rushing yards, becoming only the 4th QB in Jefferson High School history to achieve the milestone. Adds elite dual-threat ability to an already complete QB game.",
    stats: [
      ["Career Rush Yards", "1,000+"],
      ["Rushing TDs", "12"],
      ["Avg YPC", "6.8"],
    ],
  },
];

export const DEMO_SCHOLARSHIPS: ScholarshipTarget[] = [
  {
    id: 1n,
    collegeName: "University of Alabama",
    division: CollegeDivision.d1,
    sport: Sport.football,
    status: ScholarshipStatus.interested,
    coachName: "Coach Williams",
    coachEmail: "recruiting@alabama.edu",
    coachPhone: "(205) 348-0000",
    notes: "Attended junior day in February. Positive feedback from QB coach.",
    lastContactDate: BigInt(new Date("2025-02-15").getTime()) * 1_000_000n,
  },
  {
    id: 2n,
    collegeName: "Auburn University",
    division: CollegeDivision.d1,
    sport: Sport.football,
    status: ScholarshipStatus.contacted,
    coachName: "Coach Davis",
    coachEmail: "recruiting@auburn.edu",
    coachPhone: "(334) 844-0000",
    notes: "Sent highlight film. Awaiting response from offensive coordinator.",
    lastContactDate: BigInt(new Date("2025-03-01").getTime()) * 1_000_000n,
  },
  {
    id: 3n,
    collegeName: "UAB Blazers",
    division: CollegeDivision.d1,
    sport: Sport.football,
    status: ScholarshipStatus.applied,
    coachName: "Coach Thompson",
    coachEmail: "recruiting@uab.edu",
    coachPhone: "(205) 934-0000",
    notes: "Application submitted. Campus visit scheduled for April.",
    lastContactDate: BigInt(new Date("2025-03-10").getTime()) * 1_000_000n,
  },
];

export const DEMO_POSTS: ContentPost[] = [
  {
    id: 1n,
    platform: SocialPlatform.twitter,
    caption:
      '🏈 Marcus "MJ" Johnson | QB | Class of \'26\nState Champ. 3,412 passing yards. 38 TDs. ALL-STATE.\nCoaches — the film speaks for itself. Ready to compete at the next level.\n#FootballRecruiting #CFBRecruiting #GridironGrind',
    hashtags: [
      "#FootballRecruiting",
      "#CFBRecruiting",
      "#GridironGrind",
      "#Recruiting2026",
    ],
    status: PostStatus.draft,
    mediaUrls: [],
    achievementId: undefined,
    scheduledDate: undefined,
  },
  {
    id: 2n,
    platform: SocialPlatform.instagram,
    caption:
      '🏈 STATE CHAMPION. ALL-STATE. CLASS OF 2026. 🏈\n\nMarcus "MJ" Johnson | QB #12 | Jefferson High School\n\nThe grind doesn\'t stop. 3,412 passing yards. 38 TDs. 67% completion. And just getting started.\n\nCoaches — my film is out. Come find me.\n\n#FootballRecruiting #CFBRecruiting #GridironGrind #HighSchoolFootball #RecruitMe #ClassOf2026 #AllState #StateChampion #QB #AthleteMindset #NextLevel #CollegeRecruiting',
    hashtags: [
      "#FootballRecruiting",
      "#CFBRecruiting",
      "#GridironGrind",
      "#HighSchoolFootball",
      "#RecruitMe",
      "#ClassOf2026",
      "#AllState",
      "#StateChampion",
      "#QB",
      "#AthleteMindset",
      "#NextLevel",
      "#CollegeRecruiting",
    ],
    status: PostStatus.draft,
    mediaUrls: [],
    achievementId: undefined,
    scheduledDate: undefined,
  },
  {
    id: 3n,
    platform: SocialPlatform.facebook,
    caption:
      'Proud to share a huge milestone in Marcus\'s journey! 🏈\n\nMarcus "MJ" Johnson was named to the Alabama 6A All-State First Team at quarterback — one of just 5 players selected statewide at the position.\n\nThis season: 3,412 passing yards · 38 touchdowns · 67% completion rate · State Championship title.\n\nMarcus is a Class of 2026 dual-sport athlete (football & basketball) with a 3.8 GPA, 6\'2", 195 lbs out of Jefferson High School in Birmingham, AL.\n\nIf you know a college coach or recruiter in football, please share this post. Every connection brings us one step closer to earning a scholarship offer.\n\nThank you to everyone who has supported this journey! 🙏',
    hashtags: ["#FootballRecruiting", "#ClassOf2026", "#AllState"],
    status: PostStatus.draft,
    mediaUrls: [],
    achievementId: undefined,
    scheduledDate: undefined,
  },
];
