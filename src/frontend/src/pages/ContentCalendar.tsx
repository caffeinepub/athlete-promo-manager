import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Loader2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PostStatus, SocialPlatform } from "../backend";
import {
  useAddContentPost,
  useContentPosts,
  useDeleteContentPost,
} from "../hooks/useQueries";

const PLATFORM_COLORS: Record<SocialPlatform, { bg: string; text: string }> = {
  [SocialPlatform.twitter]: {
    bg: "oklch(0.65 0.18 220 / 0.15)",
    text: "oklch(0.65 0.18 220)",
  },
  [SocialPlatform.instagram]: {
    bg: "oklch(0.65 0.18 300 / 0.15)",
    text: "oklch(0.65 0.18 300)",
  },
  [SocialPlatform.facebook]: {
    bg: "oklch(0.50 0.22 265 / 0.15)",
    text: "oklch(0.50 0.22 265)",
  },
  [SocialPlatform.all]: {
    bg: "oklch(0.75 0.18 155 / 0.15)",
    text: "oklch(0.75 0.18 155)",
  },
};

const STATUS_STYLES: Record<PostStatus, { bg: string; text: string }> = {
  [PostStatus.draft]: {
    bg: "oklch(0.53 0.028 240 / 0.2)",
    text: "oklch(0.53 0.028 240)",
  },
  [PostStatus.scheduled]: {
    bg: "oklch(0.65 0.18 45 / 0.2)",
    text: "oklch(0.65 0.18 45)",
  },
  [PostStatus.posted]: {
    bg: "oklch(0.75 0.18 155 / 0.2)",
    text: "oklch(0.75 0.18 155)",
  },
};

export default function ContentCalendar() {
  const { data: posts = [], isLoading } = useContentPosts();
  const deletePost = useDeleteContentPost();
  const addPost = useAddContentPost();
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [markingPosted, setMarkingPosted] = useState<bigint | null>(null);

  const filtered = posts.filter((p) => {
    const matchPlatform =
      platformFilter === "all" || p.platform === platformFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchPlatform && matchStatus;
  });

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleMarkPosted = async (post: (typeof posts)[0]) => {
    setMarkingPosted(post.id);
    try {
      // Delete the old post, then recreate with posted status
      await deletePost.mutateAsync(post.id);
      await addPost.mutateAsync({ ...post, id: 0n, status: PostStatus.posted });
      toast.success("Marked as posted!");
    } catch {
      toast.error("Failed to update.");
    } finally {
      setMarkingPosted(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Content Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track all your social media posts.
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mb-5">
        <div className="flex gap-1">
          {["all", ...Object.values(SocialPlatform)].map((f) => (
            <button
              type="button"
              key={f}
              data-ocid={`calendar.platform.${f}.tab`}
              onClick={() => setPlatformFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                platformFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all"
                ? "All Platforms"
                : f === "twitter"
                  ? "Twitter/X"
                  : f}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["all", ...Object.values(PostStatus)].map((f) => (
            <button
              type="button"
              key={f}
              data-ocid={`calendar.status.${f}.tab`}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-20"
          data-ocid="calendar.loading_state"
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="calendar.empty_state">
          <FileText size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post, idx) => {
            const pc = PLATFORM_COLORS[post.platform];
            const sc = STATUS_STYLES[post.status];
            const isMarking = markingPosted === post.id;
            return (
              <motion.div
                key={String(post.id)}
                data-ocid={`calendar.item.${idx + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-xl border border-border p-4 shadow-card flex items-center gap-4 group"
                style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase"
                  style={{ backgroundColor: pc.bg, color: pc.text }}
                >
                  {post.platform === SocialPlatform.twitter
                    ? "X"
                    : post.platform.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">
                    {post.caption || "(No caption)"}
                  </p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: sc.bg,
                        color: sc.text,
                        border: "none",
                      }}
                    >
                      {post.status}
                    </Badge>
                    {post.scheduledDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          Number(post.scheduledDate / 1_000_000n),
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                  {post.status !== PostStatus.posted && (
                    <Button
                      data-ocid={`calendar.confirm_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="text-success hover:text-success/80"
                      onClick={() => handleMarkPosted(post)}
                      disabled={isMarking}
                    >
                      {isMarking ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </Button>
                  )}
                  <Button
                    data-ocid={`calendar.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
