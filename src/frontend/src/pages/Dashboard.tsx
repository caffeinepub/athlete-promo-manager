import {
  Clock,
  FileText,
  GraduationCap,
  Info,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { PostStatus, ScholarshipStatus, Sport } from "../backend";
import {
  DEMO_ACHIEVEMENTS,
  DEMO_POSTS,
  DEMO_PROFILE,
  DEMO_SCHOLARSHIPS,
} from "../demoData";
import {
  useAchievements,
  useContentPosts,
  useProfile,
  useScholarshipTargets,
} from "../hooks/useQueries";

const PIPELINE_STATUSES = [
  ScholarshipStatus.researching,
  ScholarshipStatus.contacted,
  ScholarshipStatus.interested,
  ScholarshipStatus.visited,
  ScholarshipStatus.applied,
  ScholarshipStatus.offered,
  ScholarshipStatus.committed,
];

const STATUS_COLORS: Record<string, string> = {
  [ScholarshipStatus.researching]: "oklch(0.53 0.028 240)",
  [ScholarshipStatus.contacted]: "oklch(0.65 0.18 220)",
  [ScholarshipStatus.interested]: "oklch(0.65 0.18 45)",
  [ScholarshipStatus.visited]: "oklch(0.65 0.18 300)",
  [ScholarshipStatus.applied]: "oklch(0.65 0.22 25)",
  [ScholarshipStatus.offered]: "oklch(0.75 0.18 155)",
  [ScholarshipStatus.committed]: "oklch(0.75 0.22 155)",
};

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: realAchievements = [], isLoading: achLoading } =
    useAchievements();
  const { data: realPosts = [], isLoading: postsLoading } = useContentPosts();
  const { data: realScholarships = [], isLoading: scholarLoading } =
    useScholarshipTargets();

  const isLoading =
    profileLoading || achLoading || postsLoading || scholarLoading;
  const isDemo = !isLoading && !profile?.name && realAchievements.length === 0;

  const achievements = isDemo ? DEMO_ACHIEVEMENTS : realAchievements;
  const posts = isDemo ? DEMO_POSTS : realPosts;
  const scholarships = isDemo ? DEMO_SCHOLARSHIPS : realScholarships;
  const displayProfile = isDemo ? DEMO_PROFILE : profile;

  const scheduledPosts = posts.filter((p) => p.status === PostStatus.scheduled);
  const recentAchievements = [...achievements]
    .sort((a, b) => Number(b.date - a.date))
    .slice(0, 5);

  const sportEmoji =
    displayProfile?.sport === Sport.football
      ? "🏈"
      : displayProfile?.sport === Sport.basketball
        ? "🏀"
        : "🏈🏀";

  const statCards = [
    {
      label: "Total Achievements",
      value: achievements.length,
      icon: <Trophy size={20} />,
      color: "oklch(0.65 0.18 45)",
    },
    {
      label: "Posts Created",
      value: posts.length,
      icon: <FileText size={20} />,
      color: "oklch(0.50 0.22 265)",
    },
    {
      label: "Schools Tracked",
      value: scholarships.length,
      icon: <GraduationCap size={20} />,
      color: "oklch(0.75 0.18 155)",
    },
    {
      label: "Posts Scheduled",
      value: scheduledPosts.length,
      icon: <Clock size={20} />,
      color: "oklch(0.65 0.18 300)",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Demo Banner */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border p-5"
          style={{
            backgroundColor: "oklch(0.15 0.04 47)",
            borderColor: "oklch(0.68 0.21 47 / 0.5)",
          }}
          data-ocid="dashboard.demo.panel"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: "oklch(0.68 0.21 47 / 0.2)",
                color: "oklch(0.75 0.18 47)",
              }}
            >
              <Info size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="font-bold text-base"
                  style={{ color: "oklch(0.85 0.14 47)" }}
                >
                  🏈 Platform Demo — Marcus Johnson #12
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47 / 0.25)",
                    color: "oklch(0.80 0.18 47)",
                  }}
                >
                  DEMO MODE
                </span>
              </div>
              <p
                className="text-sm mt-1"
                style={{ color: "oklch(0.70 0.08 47)" }}
              >
                This is a live demo showing all platform features with a sample
                athlete profile. Log in with Internet Identity to save your own
                athlete data and replace this demo.
              </p>
              <div className="flex gap-4 mt-3 flex-wrap">
                {[
                  { label: "Achievements", value: "4", icon: "🏆" },
                  { label: "Scholarship Targets", value: "3", icon: "🎓" },
                  { label: "Draft Posts", value: "3", icon: "📝" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <span>{stat.icon}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.85 0.14 47)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.07 47)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: "oklch(0.68 0.21 47)", color: "#fff" }}
              data-ocid="dashboard.demo.primary_button"
            >
              Set Up Profile
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {displayProfile?.name ? (
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {sportEmoji} {displayProfile.name}
              {isDemo && (
                <span
                  className="ml-3 text-sm font-normal px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                    color: "oklch(0.75 0.18 47)",
                  }}
                >
                  Demo
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {displayProfile.position} · Class of{" "}
              {displayProfile.graduationYear.toString()} · GPA{" "}
              {displayProfile.gpa}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, Athlete!
            </h1>
            <p className="text-muted-foreground mt-1">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => onNavigate("profile")}
              >
                Complete your profile
              </button>{" "}
              to get started.
            </p>
          </div>
        )}
      </motion.div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="dashboard.section"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-xl border border-border p-4 shadow-card"
            style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${card.color}22`,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
              {isDemo && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47 / 0.12)",
                    color: "oklch(0.72 0.14 47)",
                  }}
                >
                  demo
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-border p-5 shadow-card"
          style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">
              Scholarship Pipeline
            </h2>
            {isDemo && (
              <span
                className="ml-auto text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "oklch(0.68 0.21 47 / 0.12)",
                  color: "oklch(0.72 0.14 47)",
                }}
              >
                demo
              </span>
            )}
          </div>
          {scholarships.length === 0 ? (
            <p
              className="text-muted-foreground text-sm"
              data-ocid="dashboard.scholarships.empty_state"
            >
              No schools tracked yet.
            </p>
          ) : (
            <div className="space-y-2">
              {PIPELINE_STATUSES.map((status) => {
                const count = scholarships.filter(
                  (s) => s.status === status,
                ).length;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24 capitalize">
                      {status}
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full"
                      style={{ backgroundColor: "oklch(0.21 0.038 240)" }}
                    >
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: scholarships.length
                            ? `${(count / scholarships.length) * 100}%`
                            : "0%",
                          backgroundColor: STATUS_COLORS[status],
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-xl border border-border p-5 shadow-card"
          style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">
              Recent Achievements
            </h2>
            {isDemo && (
              <span
                className="ml-auto text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "oklch(0.68 0.21 47 / 0.12)",
                  color: "oklch(0.72 0.14 47)",
                }}
              >
                demo
              </span>
            )}
          </div>
          {recentAchievements.length === 0 ? (
            <p
              className="text-muted-foreground text-sm"
              data-ocid="dashboard.achievements.empty_state"
            >
              No achievements yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((a, idx) => (
                <div
                  key={String(a.id)}
                  data-ocid={`dashboard.achievement.item.${idx + 1}`}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Trophy size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {a.category} · {a.sport}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border p-5 shadow-card"
        style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">
            Upcoming Scheduled Posts
          </h2>
        </div>
        {scheduledPosts.length === 0 ? (
          <div data-ocid="dashboard.posts.empty_state">
            {isDemo ? (
              <p className="text-sm" style={{ color: "oklch(0.65 0.07 47)" }}>
                Demo has 3 draft posts ready in the{" "}
                <button
                  type="button"
                  className="underline hover:opacity-80 font-medium"
                  style={{ color: "oklch(0.75 0.18 47)" }}
                  onClick={() => onNavigate("content-generator")}
                >
                  Content Generator
                </button>
                . Schedule them to appear here.
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                No scheduled posts.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.slice(0, 5).map((post, idx) => (
              <div
                key={String(post.id)}
                data-ocid={`dashboard.post.item.${idx + 1}`}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      post.platform === "twitter"
                        ? "oklch(0.65 0.18 220)"
                        : post.platform === "instagram"
                          ? "oklch(0.65 0.18 300)"
                          : "oklch(0.50 0.22 265)",
                  }}
                />
                <p className="text-sm text-foreground flex-1 truncate">
                  {post.caption}
                </p>
                <span className="text-xs text-muted-foreground capitalize">
                  {post.platform}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
