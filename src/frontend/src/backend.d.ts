import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ScholarshipTarget {
    id: bigint;
    status: ScholarshipStatus;
    coachEmail: string;
    collegeName: string;
    division: CollegeDivision;
    coachPhone: string;
    sport: Sport;
    notes: string;
    lastContactDate: Time;
    coachName: string;
}
export type Time = bigint;
export interface MediaItem {
    id: bigint;
    blob: ExternalBlob;
    tags: Array<string>;
    caption: string;
    mediaType: MediaType;
    uploadDate: Time;
}
export interface Achievement {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    sport: Sport;
    stats: Array<[string, string]>;
    category: AchievementCategory;
}
export interface AthleteProfile {
    bio: string;
    gpa: string;
    weight: string;
    height: string;
    city: string;
    name: string;
    instagramHandle: string;
    graduationYear: bigint;
    sport: Sport;
    state: string;
    hudlLink: string;
    twitterHandle: string;
    position: string;
}
export interface ContentPost {
    id: bigint;
    status: PostStatus;
    achievementId?: bigint;
    hashtags: Array<string>;
    scheduledDate?: Time;
    platform: SocialPlatform;
    caption: string;
    mediaUrls: Array<string>;
}
export enum AchievementCategory {
    award = "award",
    milestone = "milestone",
    gameStat = "gameStat"
}
export enum CollegeDivision {
    d1 = "d1",
    d2 = "d2",
    d3 = "d3",
    juco = "juco",
    naia = "naia"
}
export enum MediaType {
    video = "video",
    photo = "photo"
}
export enum PostStatus {
    scheduled = "scheduled",
    draft = "draft",
    posted = "posted"
}
export enum ScholarshipStatus {
    researching = "researching",
    applied = "applied",
    committed = "committed",
    visited = "visited",
    contacted = "contacted",
    declined = "declined",
    offered = "offered",
    interested = "interested"
}
export enum SocialPlatform {
    all = "all",
    twitter = "twitter",
    instagram = "instagram",
    facebook = "facebook"
}
export enum Sport {
    basketball = "basketball",
    football = "football",
    both = "both"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(a: Achievement): Promise<bigint>;
    addContentPost(p: ContentPost): Promise<bigint>;
    addMediaItem(mediaType: MediaType, caption: string, tags: Array<string>, blob: ExternalBlob): Promise<bigint>;
    addScholarshipTarget(s: ScholarshipTarget): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAchievement(id: bigint): Promise<void>;
    deleteContentPost(id: bigint): Promise<void>;
    deleteMediaItem(id: bigint): Promise<void>;
    deleteScholarshipTarget(id: bigint): Promise<void>;
    getAchievements(): Promise<Array<Achievement>>;
    getAthleteProfile(user: Principal): Promise<AthleteProfile | null>;
    getCallerUserProfile(): Promise<AthleteProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContentPosts(): Promise<Array<ContentPost>>;
    getMediaItems(): Promise<Array<MediaItem>>;
    getScholarshipTargets(): Promise<Array<ScholarshipTarget>>;
    getUserProfile(user: Principal): Promise<AthleteProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAthleteProfile(p: AthleteProfile): Promise<void>;
    saveCallerUserProfile(p: AthleteProfile): Promise<void>;
}
