import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AchievementCategory, Sport } from "../backend";
import type { Achievement } from "../backend";
import { DEMO_ACHIEVEMENTS } from "../demoData";
import {
  useAchievements,
  useAddAchievement,
  useDeleteAchievement,
} from "../hooks/useQueries";

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  [AchievementCategory.gameStat]: "bg-primary/20 text-primary",
  [AchievementCategory.award]: "bg-chart-3/20 text-chart-3",
  [AchievementCategory.milestone]: "bg-success/20 text-success",
};

const EMPTY_FORM = {
  title: "",
  sport: Sport.football,
  category: AchievementCategory.gameStat,
  date: new Date().toISOString().split("T")[0],
  description: "",
  stats: [["", ""]] as [string, string][],
};

export default function Achievements() {
  const { data: realAchievements = [], isLoading } = useAchievements();
  const addAchievement = useAddAchievement();
  const deleteAchievement = useDeleteAchievement();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const isDemo = !isLoading && realAchievements.length === 0;
  const achievements = isDemo ? DEMO_ACHIEVEMENTS : realAchievements;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const achievement: Achievement = {
        id: 0n,
        title: form.title,
        sport: form.sport,
        category: form.category,
        date: BigInt(new Date(form.date).getTime()) * 1_000_000n,
        description: form.description,
        stats: form.stats.filter(([k]) => k.trim()),
      };
      await addAchievement.mutateAsync(achievement);
      toast.success("Achievement added!");
      setOpen(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to add achievement.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteAchievement.mutateAsync(id);
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const updateStat = (idx: number, field: 0 | 1, value: string) => {
    setForm((prev) => {
      const stats = [...prev.stats] as [string, string][];
      stats[idx] = [
        field === 0 ? value : stats[idx][0],
        field === 1 ? value : stats[idx][1],
      ];
      return { ...prev, stats };
    });
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your game stats, awards, and milestones.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="achievements.add_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus size={16} className="mr-2" /> Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-lg"
            data-ocid="achievements.dialog"
            style={{
              backgroundColor: "oklch(0.14 0.025 240)",
              borderColor: "oklch(0.21 0.038 240)",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Add Achievement
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  data-ocid="achievements.title.input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="325 Passing Yards vs Riverside"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Sport</Label>
                  <Select
                    value={form.sport}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, sport: v as Sport }))
                    }
                  >
                    <SelectTrigger data-ocid="achievements.sport.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Sport.football}>Football</SelectItem>
                      <SelectItem value={Sport.basketball}>
                        Basketball
                      </SelectItem>
                      <SelectItem value={Sport.both}>Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        category: v as AchievementCategory,
                      }))
                    }
                  >
                    <SelectTrigger data-ocid="achievements.category.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AchievementCategory.gameStat}>
                        Game Stat
                      </SelectItem>
                      <SelectItem value={AchievementCategory.award}>
                        Award
                      </SelectItem>
                      <SelectItem value={AchievementCategory.milestone}>
                        Milestone
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  data-ocid="achievements.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  data-ocid="achievements.description.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe this achievement..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Stats</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm((p) => ({ ...p, stats: [...p.stats, ["", ""]] }))
                    }
                  >
                    <Plus size={12} className="mr-1" /> Add Stat
                  </Button>
                </div>
                {form.stats.map((stat, idx) => (
                  <div key={`stat-${idx}-${stat[0]}`} className="flex gap-2">
                    <Input
                      placeholder="Key (e.g. Yards)"
                      value={stat[0]}
                      onChange={(e) => updateStat(idx, 0, e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g. 325)"
                      value={stat[1]}
                      onChange={(e) => updateStat(idx, 1, e.target.value)}
                    />
                    {form.stats.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            stats: p.stats.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                data-ocid="achievements.submit_button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={addAchievement.isPending}
              >
                {addAchievement.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Save Achievement"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-20"
          data-ocid="achievements.loading_state"
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          {isDemo && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border px-4 py-3 flex items-center gap-2"
              style={{
                backgroundColor: "oklch(0.15 0.04 47)",
                borderColor: "oklch(0.68 0.21 47 / 0.4)",
              }}
            >
              <span
                className="text-sm"
                style={{ color: "oklch(0.78 0.12 47)" }}
              >
                👋 <strong>Demo Data</strong> — These achievements belong to
                sample athlete Marcus Johnson. Click{" "}
                <strong>Add Achievement</strong> to log your own.
              </span>
            </motion.div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((a, idx) => (
              <motion.div
                key={String(a.id)}
                data-ocid={`achievements.item.${idx + 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-border p-4 shadow-card group"
                style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {a.title}
                      </h3>
                      {isDemo && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                            color: "oklch(0.75 0.18 47)",
                          }}
                        >
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <Badge
                        className="capitalize text-xs"
                        style={{
                          backgroundColor: "oklch(0.50 0.22 265 / 0.15)",
                          color: "oklch(0.70 0.18 265)",
                          border: "none",
                        }}
                      >
                        {a.sport}
                      </Badge>
                      <Badge
                        className={`text-xs capitalize ${CATEGORY_COLORS[a.category]}`}
                        style={{ border: "none" }}
                      >
                        {a.category === AchievementCategory.gameStat
                          ? "Game Stat"
                          : a.category}
                      </Badge>
                    </div>
                  </div>
                  {!isDemo && (
                    <Button
                      data-ocid={`achievements.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      onClick={() => handleDelete(a.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                {a.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {a.description}
                  </p>
                )}
                {a.stats.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {a.stats.map(([k, v]) => (
                      <div key={k} className="text-xs">
                        <span className="text-muted-foreground">{k}: </span>
                        <span className="font-semibold text-foreground">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
