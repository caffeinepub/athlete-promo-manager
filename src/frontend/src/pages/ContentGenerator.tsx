import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { toast } from "sonner";
import type { Achievement, AthleteProfile, ContentPost } from "../backend";
import { PostStatus, SocialPlatform, Sport } from "../backend";
import { DEMO_POSTS } from "../demoData";
import {
  useAchievements,
  useAddContentPost,
  useContentPosts,
  useProfile,
} from "../hooks/useQueries";

// ─── Template engine (client-side) ───────────────────────────────────────────

const footballHashtags = [
  "#FootballRecruiting",
  "#HighSchoolFootball",
  "#CFBRecruiting",
  "#GridironGrind",
  "#Recruiting2025",
  "#NFL",
  "#FutureProAthlete",
];
const basketballHashtags = [
  "#BasketballRecruiting",
  "#HighSchoolHoops",
  "#CBBRecruiting",
  "#NextLevel",
  "#Recruiting2025",
  "#HoopDreams",
  "#FutureProAthlete",
];

function getHashtags(sport: Sport, count: number): string[] {
  const base =
    sport === Sport.basketball ? basketballHashtags : footballHashtags;
  return base.slice(0, count);
}

function sportEmoji(sport: Sport) {
  return sport === Sport.basketball ? "🏀" : "🏈";
}

function statsLine(achievement: Achievement): string {
  return achievement.stats.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

function generateSuggestionsForPlatform(
  platform: SocialPlatform,
  profile: AthleteProfile | null,
  achievements: Achievement[],
): string[] {
  const name = profile?.name || "Athlete";
  const pos = profile?.position || "Athlete";
  const yr = profile?.graduationYear?.toString() || "2025";
  const sport = profile?.sport || Sport.football;
  const emoji = sportEmoji(sport);
  const htags = getHashtags(sport, 4).join(" ");
  const latest = achievements[0];
  const stats = latest ? statsLine(latest) : "Big game performance";
  const title = latest?.title || "Big Performance";
  const desc = latest?.description || "Another great game showing my skills";

  if (platform === SocialPlatform.twitter) {
    return [
      `${emoji} ${name} | ${pos} | Class of '${yr.slice(-2)}\n${title} \u2014 ${stats}\nRecruiters, I'm ready. ${htags} #Recruiting`,
      `Game film doesn't lie. ${emoji}\n${name} (${pos}) putting in work \u2014 ${stats}\nCoaches: Let's connect. ${htags}`,
      `${emoji} Class of ${yr} | ${pos} | ${name}\n"${desc.slice(0, 60)}${desc.length > 60 ? "..." : ""}"\n${htags} #CollegeFootball`,
    ].map((s) => s.slice(0, 280));
  }

  if (platform === SocialPlatform.instagram) {
    const longHashtags = getHashtags(sport, 14).join(" ");
    return [
      `${emoji} GRIND NEVER STOPS ${emoji}\n\n${name} | ${pos} | Class of ${yr}\n\n${title}\n${stats}\n\nEvery rep, every film session, every early morning \u2014 this is what it takes. Coaches, I'm ready for the next level.\n\n${longHashtags} #AthleteMindset #CollegeRecruiting #HighSchoolAthlete`,
      `PUT IN THE WORK. SEE THE RESULTS. ${emoji}\n\n"${desc}"\n\n${name} \u00b7 ${pos} \u00b7 Class of ${yr}\n${stats}\n\nThe journey to a college scholarship starts with outworking everyone in the room. I'm doing exactly that.\n\n${longHashtags} #Scholar #FuturePro`,
      `${emoji} HIGHLIGHT REEL LIFE ${emoji}\n\n${title}\n\nStats: ${stats}\n\n${name} (${pos}) putting the league on notice. Class of ${yr} and I'm just getting started. College coaches \u2014 my film is out. Come find me.\n\n${longHashtags} #RecruitMe #NextLevel`,
    ];
  }

  // Facebook \u2014 long-form
  return [
    `Proud to share another milestone in ${name}'s athletic journey! ${emoji}\n\n${title}\n\n${desc}\n\nNumbers on the field: ${stats}\n\n${name} is a Class of ${yr} ${pos} with heart, dedication, and the drive to compete at the collegiate level. If you know a college coach or recruiter in ${sport}, please share this post. Every connection matters as we work toward earning a scholarship offer.\n\nThank you to everyone who has supported this journey! \ud83d\ude4f`,
    `${name} continues to prove why ${sport} coaches should have their eyes on this young man. ${emoji}\n\n${title}\n\n"${desc}"\n\nKey stats: ${stats}\n\nClass of ${yr} | ${pos} | GPA: ${profile?.gpa || "3.5+"}\n\nIf you're a coach or know someone in college athletics, we'd love to connect. Dream big, work hard, stay humble. The scholarship is coming! \ud83d\udcaa`,
    `What a performance! ${name} had another standout outing this week. ${emoji}\n\n${title}\n${stats}\n\nAs a ${pos} in the Class of ${yr}, ${name} brings athleticism, coachability, and a student-athlete mindset to every game. College coaches \u2014 the film speaks for itself. Reach out and let's talk!\n\nProud parent sharing every step of the way. \ud83c\udfc6`,
  ];
}

function generateFromPrompt(
  platform: SocialPlatform,
  profile: AthleteProfile | null,
  prompt: string,
): string {
  const name = profile?.name || "Athlete";
  const pos = profile?.position || "Athlete";
  const yr = profile?.graduationYear?.toString() || "2025";
  const sport = profile?.sport || Sport.football;
  const emoji = sportEmoji(sport);
  const htags = getHashtags(sport, 4).join(" ");

  if (platform === SocialPlatform.twitter) {
    return `${emoji} ${name} | ${pos} | Class of '${yr.slice(-2)}\n${prompt}\n${htags} #Recruiting`.slice(
      0,
      280,
    );
  }
  if (platform === SocialPlatform.instagram) {
    const longHtags = getHashtags(sport, 12).join(" ");
    return `${emoji} ${name} | ${pos} | Class of ${yr}\n\n${prompt}\n\nCoaches, come find me. Film is out.\n\n${longHtags} #CollegeRecruiting #AthleteMindset`;
  }
  return `${name} | ${pos} | Class of ${yr} ${emoji}\n\n${prompt}\n\nWe're proud of every step of this journey and continuing to work toward a college scholarship opportunity. College coaches \u2014 let's connect! \ud83d\ude4f`;
}

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: SocialPlatform.twitter,
    label: "Twitter / X",
    Icon: SiX,
    color: "oklch(0.88 0 0)",
    bg: "oklch(0.18 0.01 248)",
    limit: 280 as number | null,
    hint: "280 characters max \u00b7 punchy & direct",
  },
  {
    id: SocialPlatform.instagram,
    label: "Instagram",
    Icon: SiInstagram,
    color: "oklch(0.65 0.22 345)",
    bg: "oklch(0.16 0.03 345)",
    limit: null as number | null,
    hint: "Caption + hashtags \u00b7 story-style",
  },
  {
    id: SocialPlatform.facebook,
    label: "Facebook",
    Icon: SiFacebook,
    color: "oklch(0.56 0.20 265)",
    bg: "oklch(0.16 0.03 265)",
    limit: null as number | null,
    hint: "Long-form narrative \u00b7 parent-friendly",
  },
];

// ─── Suggestion card ──────────────────────────────────────────────────────────

function SuggestionCard({
  text,
  index,
  charLimit,
  isDemo,
  onUse,
}: {
  text: string;
  index: number;
  charLimit: number | null;
  isDemo?: boolean;
  onUse: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const over = charLimit !== null && text.length > charLimit;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl border border-border p-4 space-y-3"
      style={{ backgroundColor: "oklch(0.16 0.022 248)" }}
      data-ocid={`content.suggestion.item.${index + 1}`}
    >
      {isDemo && (
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "oklch(0.68 0.21 47 / 0.2)",
              color: "oklch(0.80 0.18 47)",
            }}
          >
            Demo Post
          </span>
        </div>
      )}
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
        {text}
      </p>
      <div className="flex items-center justify-between">
        {charLimit !== null ? (
          <span
            className="text-xs font-mono"
            style={{
              color: over ? "oklch(0.65 0.22 25)" : "oklch(0.52 0.026 245)",
            }}
          >
            {text.length} / {charLimit}
            {over && " \u2014 over limit"}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {text.length} chars
          </span>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            data-ocid={`content.suggestion.copy.${index + 1}`}
          >
            {copied ? (
              <Check size={12} className="mr-1" />
            ) : (
              <Copy size={12} className="mr-1" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            className="h-7 px-3 text-xs font-semibold"
            style={{ backgroundColor: "oklch(0.68 0.21 47)", color: "#fff" }}
            onClick={() => onUse(text)}
            data-ocid={`content.suggestion.use.${index + 1}`}
          >
            Use This
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContentGenerator() {
  const { data: profile } = useProfile();
  const { data: achievements = [] } = useAchievements();
  const { data: realPosts = [] } = useContentPosts();
  const addPost = useAddContentPost();

  const isDemo = realPosts.length === 0;

  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(
    SocialPlatform.twitter,
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatingCustom, setGeneratingCustom] = useState(false);
  const [editablePost, setEditablePost] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [copiedPreview, setCopiedPreview] = useState(false);

  const currentPlatform =
    PLATFORMS.find((p) => p.id === activePlatform) ?? PLATFORMS[0];

  // Demo posts for the active platform
  const demoPlatformPost = DEMO_POSTS.find(
    (p) => p.platform === activePlatform,
  );

  const handleGenerateSuggestions = () => {
    setGenerating(true);
    setTimeout(() => {
      const posts = generateSuggestionsForPlatform(
        activePlatform,
        profile ?? null,
        achievements,
      );
      setSuggestions(posts);
      setGenerating(false);
    }, 900);
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;
    setGeneratingCustom(true);
    setTimeout(() => {
      const result = generateFromPrompt(
        activePlatform,
        profile ?? null,
        customPrompt.trim(),
      );
      setEditablePost(result);
      const sport = profile?.sport || Sport.football;
      setHashtags(
        getHashtags(
          sport,
          activePlatform === SocialPlatform.instagram ? 10 : 5,
        ),
      );
      setGeneratingCustom(false);
    }, 700);
  };

  const handleUseSuggestion = (text: string) => {
    setEditablePost(text);
    const sport = profile?.sport || Sport.football;
    setHashtags(
      getHashtags(sport, activePlatform === SocialPlatform.instagram ? 10 : 5),
    );
  };

  const addHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hashtagInput.trim()) {
      e.preventDefault();
      const tag = hashtagInput.trim().startsWith("#")
        ? hashtagInput.trim()
        : `#${hashtagInput.trim()}`;
      if (!hashtags.includes(tag)) setHashtags((prev) => [...prev, tag]);
      setHashtagInput("");
    }
  };

  const handleSave = async () => {
    if (!editablePost.trim()) return;
    try {
      const post: ContentPost = {
        id: 0n,
        platform: activePlatform,
        caption: editablePost,
        hashtags,
        status: PostStatus.draft,
        achievementId: undefined,
        scheduledDate: undefined,
        mediaUrls: [],
      };
      await addPost.mutateAsync(post);
      toast.success("Post saved to Content Calendar!");
      setEditablePost("");
      setHashtags([]);
    } catch {
      toast.error("Failed to save post.");
    }
  };

  const overLimit =
    currentPlatform.limit !== null &&
    editablePost.length > currentPlatform.limit;

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles size={22} className="text-primary" />
            AI Content Generator
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate platform-optimized posts from your achievements and
            highlights.
          </p>
        </div>

        {/* Platform selector */}
        <div className="flex gap-2 mb-6 flex-wrap" role="tablist">
          {PLATFORMS.map((p) => {
            const active = activePlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-ocid={`content.platform.${p.id}.toggle`}
                onClick={() => {
                  setActivePlatform(p.id);
                  setSuggestions([]);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  active
                    ? "border-transparent text-white shadow-md"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
                style={
                  active
                    ? {
                        backgroundColor: "oklch(0.68 0.21 47)",
                        borderColor: "transparent",
                      }
                    : {}
                }
              >
                <p.Icon
                  size={14}
                  style={{ color: active ? "#fff" : p.color }}
                />
                {p.label}
                {active && p.limit !== null && (
                  <span className="text-xs opacity-75">&le;{p.limit}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Demo post preview for current platform */}
        {isDemo && demoPlatformPost && (
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border p-4 space-y-3"
            style={{
              backgroundColor: "oklch(0.15 0.04 47)",
              borderColor: "oklch(0.68 0.21 47 / 0.35)",
            }}
            data-ocid="content.demo.panel"
          >
            <div className="flex items-center gap-2">
              <currentPlatform.Icon
                size={14}
                style={{ color: currentPlatform.color }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "oklch(0.80 0.18 47)" }}
              >
                {currentPlatform.label} — Sample Demo Post
              </span>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: "oklch(0.68 0.21 47 / 0.25)",
                  color: "oklch(0.80 0.18 47)",
                }}
              >
                DEMO
              </span>
            </div>
            <p
              className="text-sm whitespace-pre-wrap leading-relaxed"
              style={{ color: "oklch(0.82 0.04 240)" }}
            >
              {demoPlatformPost.caption}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {demoPlatformPost.hashtags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                    color: "oklch(0.75 0.18 47)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs" style={{ color: "oklch(0.62 0.07 47)" }}>
                Use <strong>Generate Suggestions</strong> below to create real
                posts for your athlete.
              </p>
              <Button
                size="sm"
                className="h-7 px-3 text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.68 0.21 47)",
                  color: "#fff",
                }}
                onClick={() => handleUseSuggestion(demoPlatformPost.caption)}
                data-ocid="content.demo.primary_button"
              >
                Use As Template
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Generator controls */}
          <div className="space-y-5">
            {/* Auto-Generate */}
            <Card
              className="border-border"
              style={{ backgroundColor: "oklch(0.13 0.022 245)" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  Auto-Generate Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Generate 3 ready-to-post ideas based on your profile and
                  recent achievements for{" "}
                  <span className="text-foreground font-medium">
                    {currentPlatform.label}
                  </span>
                  .
                </p>
                <Button
                  data-ocid="content.generate.primary_button"
                  onClick={handleGenerateSuggestions}
                  disabled={generating}
                  className="w-full font-semibold"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47)",
                    color: "#fff",
                  }}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> Generate
                      Suggestions
                    </>
                  )}
                </Button>

                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      key="suggestions-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {suggestions.map((s, i) => (
                        <SuggestionCard
                          key={`suggestion-${i}-${s.slice(0, 20)}`}
                          text={s}
                          index={i}
                          charLimit={currentPlatform.limit}
                          onUse={handleUseSuggestion}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card
              className="border-border"
              style={{ backgroundColor: "oklch(0.13 0.022 245)" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  Custom Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Describe what you want — e.g.{" "}
                  <em>
                    &ldquo;Generate a post about my 3 TD game vs Westside
                    High&rdquo;
                  </em>
                </p>
                <Textarea
                  data-ocid="content.custom_prompt.textarea"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Tell the generator what to write about..."
                  rows={3}
                  className="resize-none text-sm"
                  style={{
                    backgroundColor: "oklch(0.16 0.022 248)",
                    borderColor: "oklch(0.20 0.036 245)",
                  }}
                />
                <Button
                  data-ocid="content.custom_prompt.submit_button"
                  onClick={handleCustomGenerate}
                  disabled={generatingCustom || !customPrompt.trim()}
                  variant="outline"
                  className="w-full font-semibold border-primary/50 text-primary hover:bg-primary/10"
                >
                  {generatingCustom ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate From Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Post editor */}
          <div className="space-y-5">
            <Card
              className="border-border"
              style={{ backgroundColor: "oklch(0.13 0.022 245)" }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Post Editor
                  </CardTitle>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: currentPlatform.bg,
                      color: currentPlatform.color,
                    }}
                  >
                    <currentPlatform.Icon size={11} />
                    {currentPlatform.label}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentPlatform.hint}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Textarea
                    data-ocid="content.editor.textarea"
                    value={editablePost}
                    onChange={(e) => setEditablePost(e.target.value)}
                    placeholder="Your post will appear here \u2014 or type directly to compose..."
                    rows={8}
                    className="resize-none text-sm leading-relaxed"
                    style={{
                      backgroundColor: "oklch(0.16 0.022 248)",
                      borderColor: overLimit
                        ? "oklch(0.65 0.22 25)"
                        : "oklch(0.20 0.036 245)",
                    }}
                  />
                  {currentPlatform.limit !== null && (
                    <div className="flex justify-end">
                      <span
                        className="text-xs font-mono"
                        style={{
                          color: overLimit
                            ? "oklch(0.65 0.22 25)"
                            : "oklch(0.52 0.026 245)",
                        }}
                      >
                        {editablePost.length} / {currentPlatform.limit}
                        {overLimit && " \u26a0 over limit"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Hashtags
                  </Label>
                  <Input
                    data-ocid="content.hashtags.input"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={addHashtag}
                    placeholder="Add hashtag + Enter..."
                    className="text-sm h-8"
                    style={{
                      backgroundColor: "oklch(0.16 0.022 248)",
                      borderColor: "oklch(0.20 0.036 245)",
                    }}
                  />
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          className="cursor-pointer text-xs pr-1"
                          style={{
                            backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                            color: "oklch(0.75 0.18 47)",
                            border: "none",
                          }}
                          onClick={() =>
                            setHashtags((prev) => prev.filter((t) => t !== tag))
                          }
                        >
                          {tag}
                          <X size={9} className="ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator
                  style={{ backgroundColor: "oklch(0.20 0.036 245)" }}
                />

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Posting to:
                  </span>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: currentPlatform.bg,
                      color: currentPlatform.color,
                    }}
                  >
                    <currentPlatform.Icon size={12} />
                    {currentPlatform.label}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-muted-foreground hover:text-foreground"
                    disabled={!editablePost.trim()}
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${editablePost}\n\n${hashtags.join(" ")}`,
                      );
                      setCopiedPreview(true);
                      setTimeout(() => setCopiedPreview(false), 1800);
                    }}
                    data-ocid="content.copy.secondary_button"
                  >
                    {copiedPreview ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Copy size={14} className="mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    className="flex-[2] font-semibold"
                    disabled={
                      addPost.isPending || !editablePost.trim() || overLimit
                    }
                    onClick={handleSave}
                    data-ocid="content.save.primary_button"
                    style={{
                      backgroundColor: "oklch(0.68 0.21 47)",
                      color: "#fff",
                    }}
                  >
                    {addPost.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Save to Calendar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform tips */}
            <Card
              className="border-border"
              style={{ backgroundColor: "oklch(0.13 0.022 245)" }}
            >
              <CardContent className="py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Platform Tips
                </p>
                {activePlatform === SocialPlatform.twitter && (
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>&bull; Keep it under 280 characters</li>
                    <li>&bull; Lead with your key stat or achievement</li>
                    <li>&bull; Tag recruiters when possible</li>
                    <li>&bull; Include 3&ndash;5 targeted hashtags</li>
                  </ul>
                )}
                {activePlatform === SocialPlatform.instagram && (
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>
                      &bull; First 2 lines show before &ldquo;more&rdquo;
                      &mdash; make them count
                    </li>
                    <li>&bull; Up to 30 hashtags allowed</li>
                    <li>&bull; Use emojis to break up text</li>
                    <li>&bull; Post with a highlight clip for max reach</li>
                  </ul>
                )}
                {activePlatform === SocialPlatform.facebook && (
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>
                      &bull; Long-form gets more shares from family network
                    </li>
                    <li>&bull; Ask connections to tag coaches/recruiters</li>
                    <li>&bull; Include GPA and off-field character points</li>
                    <li>
                      &bull; Include contact info for coaches to reach out
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
