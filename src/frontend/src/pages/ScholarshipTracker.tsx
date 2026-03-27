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
import { GraduationCap, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CollegeDivision, ScholarshipStatus, Sport } from "../backend";
import type { ScholarshipTarget } from "../backend";
import { DEMO_SCHOLARSHIPS } from "../demoData";
import {
  useAddScholarshipTarget,
  useDeleteScholarshipTarget,
  useScholarshipTargets,
} from "../hooks/useQueries";

const PIPELINE: ScholarshipStatus[] = [
  ScholarshipStatus.researching,
  ScholarshipStatus.contacted,
  ScholarshipStatus.interested,
  ScholarshipStatus.visited,
  ScholarshipStatus.applied,
  ScholarshipStatus.offered,
  ScholarshipStatus.committed,
  ScholarshipStatus.declined,
];

const STATUS_COLORS: Record<ScholarshipStatus, string> = {
  [ScholarshipStatus.researching]: "oklch(0.53 0.028 240)",
  [ScholarshipStatus.contacted]: "oklch(0.65 0.18 220)",
  [ScholarshipStatus.interested]: "oklch(0.65 0.18 45)",
  [ScholarshipStatus.visited]: "oklch(0.65 0.18 300)",
  [ScholarshipStatus.applied]: "oklch(0.65 0.22 25)",
  [ScholarshipStatus.offered]: "oklch(0.75 0.18 155)",
  [ScholarshipStatus.committed]: "oklch(0.75 0.22 155)",
  [ScholarshipStatus.declined]: "oklch(0.50 0.05 240)",
};

const DIVISION_LABELS: Record<CollegeDivision, string> = {
  [CollegeDivision.d1]: "D1",
  [CollegeDivision.d2]: "D2",
  [CollegeDivision.d3]: "D3",
  [CollegeDivision.naia]: "NAIA",
  [CollegeDivision.juco]: "JUCO",
};

const EMPTY_FORM = {
  collegeName: "",
  division: CollegeDivision.d1,
  sport: Sport.football,
  coachName: "",
  coachEmail: "",
  coachPhone: "",
  notes: "",
  status: ScholarshipStatus.researching,
};

export default function ScholarshipTracker() {
  const { data: realSchools = [], isLoading } = useScholarshipTargets();
  const addSchool = useAddScholarshipTarget();
  const deleteSchool = useDeleteScholarshipTarget();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedSchool, setSelectedSchool] =
    useState<ScholarshipTarget | null>(null);

  const isDemo = !isLoading && realSchools.length === 0;
  const schools = isDemo ? DEMO_SCHOLARSHIPS : realSchools;

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const target: ScholarshipTarget = {
        id: 0n,
        collegeName: form.collegeName,
        division: form.division,
        sport: form.sport,
        coachName: form.coachName,
        coachEmail: form.coachEmail,
        coachPhone: form.coachPhone,
        notes: form.notes,
        status: form.status,
        lastContactDate: BigInt(Date.now()) * 1_000_000n,
      };
      await addSchool.mutateAsync(target);
      toast.success(`${form.collegeName} added!`);
      setOpen(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to add school.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteSchool.mutateAsync(id);
      setSelectedSchool(null);
      toast.success("School removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Scholarship Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your recruiting pipeline with colleges.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="scholarships.add_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus size={16} className="mr-2" /> Add School
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-lg"
            data-ocid="scholarships.dialog"
            style={{
              backgroundColor: "oklch(0.14 0.025 240)",
              borderColor: "oklch(0.21 0.038 240)",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">Add School</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label>College Name</Label>
                <Input
                  data-ocid="scholarships.college_name.input"
                  value={form.collegeName}
                  onChange={(e) => set("collegeName", e.target.value)}
                  placeholder="University of Alabama"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Division</Label>
                  <Select
                    value={form.division}
                    onValueChange={(v) => set("division", v)}
                  >
                    <SelectTrigger data-ocid="scholarships.division.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CollegeDivision).map((d) => (
                        <SelectItem key={d} value={d}>
                          {DIVISION_LABELS[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sport</Label>
                  <Select
                    value={form.sport}
                    onValueChange={(v) => set("sport", v)}
                  >
                    <SelectTrigger data-ocid="scholarships.sport.select">
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
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v)}
                >
                  <SelectTrigger data-ocid="scholarships.status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PIPELINE.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Coach Name</Label>
                  <Input
                    data-ocid="scholarships.coach_name.input"
                    value={form.coachName}
                    onChange={(e) => set("coachName", e.target.value)}
                    placeholder="Coach Smith"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Coach Phone</Label>
                  <Input
                    data-ocid="scholarships.coach_phone.input"
                    value={form.coachPhone}
                    onChange={(e) => set("coachPhone", e.target.value)}
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Coach Email</Label>
                <Input
                  data-ocid="scholarships.coach_email.input"
                  type="email"
                  value={form.coachEmail}
                  onChange={(e) => set("coachEmail", e.target.value)}
                  placeholder="coach@university.edu"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea
                  data-ocid="scholarships.notes.textarea"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Notes about this school..."
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                data-ocid="scholarships.submit_button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={addSchool.isPending}
              >
                {addSchool.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Add School"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-xl border px-4 py-3 flex items-center gap-2"
          style={{
            backgroundColor: "oklch(0.15 0.04 47)",
            borderColor: "oklch(0.68 0.21 47 / 0.4)",
          }}
        >
          <span className="text-sm" style={{ color: "oklch(0.78 0.12 47)" }}>
            👋 <strong>Demo Data</strong> — Showing sample scholarship targets
            for Marcus Johnson. Click <strong>Add School</strong> to track your
            own recruiting pipeline.
          </span>
        </motion.div>
      )}

      {isLoading ? (
        <div
          className="flex justify-center py-20"
          data-ocid="scholarships.loading_state"
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div
            className="flex gap-4"
            style={{ minWidth: `${PIPELINE.length * 220}px` }}
          >
            {PIPELINE.map((status) => {
              const columnSchools = schools.filter((s) => s.status === status);
              return (
                <div
                  key={status}
                  className="flex-shrink-0"
                  style={{ width: 210 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                      {status}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {columnSchools.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {columnSchools.length === 0 ? (
                      <div
                        className="rounded-xl border border-dashed border-border h-20 flex items-center justify-center"
                        data-ocid={`scholarships.${status}.empty_state`}
                      >
                        <p className="text-xs text-muted-foreground">
                          No schools
                        </p>
                      </div>
                    ) : (
                      columnSchools.map((school, idx) => (
                        <motion.div
                          key={String(school.id)}
                          data-ocid={`scholarships.item.${idx + 1}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl border border-border p-3 shadow-card cursor-pointer hover:border-primary/50 transition-all group"
                          style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
                          onClick={() => setSelectedSchool(school)}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-medium text-foreground text-sm leading-tight">
                              {school.collegeName}
                            </p>
                            {!isDemo && (
                              <Button
                                data-ocid={`scholarships.delete_button.${idx + 1}`}
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(school.id);
                                }}
                              >
                                <Trash2 size={12} />
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <Badge
                              className="text-xs"
                              style={{
                                backgroundColor: `${STATUS_COLORS[status]}22`,
                                color: STATUS_COLORS[status],
                                border: "none",
                              }}
                            >
                              {DIVISION_LABELS[school.division]}
                            </Badge>
                            <Badge
                              className="text-xs capitalize"
                              style={{
                                backgroundColor: "oklch(0.21 0.038 240)",
                                color: "oklch(0.69 0.025 240)",
                                border: "none",
                              }}
                            >
                              {school.sport}
                            </Badge>
                            {isDemo && (
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                                  color: "oklch(0.75 0.18 47)",
                                  border: "none",
                                }}
                              >
                                Demo
                              </Badge>
                            )}
                          </div>
                          {school.coachName && (
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {school.coachName}
                            </p>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School Detail Dialog */}
      {selectedSchool && (
        <Dialog
          open={!!selectedSchool}
          onOpenChange={(o) => !o && setSelectedSchool(null)}
        >
          <DialogContent
            data-ocid="scholarships.modal"
            style={{
              backgroundColor: "oklch(0.14 0.025 240)",
              borderColor: "oklch(0.21 0.038 240)",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <GraduationCap size={18} className="text-primary" />
                {selectedSchool.collegeName}
                {isDemo && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                      color: "oklch(0.75 0.18 47)",
                    }}
                  >
                    Demo
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Badge
                  style={{
                    backgroundColor: `${STATUS_COLORS[selectedSchool.status]}22`,
                    color: STATUS_COLORS[selectedSchool.status],
                    border: "none",
                  }}
                  className="capitalize"
                >
                  {selectedSchool.status}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: "oklch(0.50 0.22 265 / 0.15)",
                    color: "oklch(0.70 0.18 265)",
                    border: "none",
                  }}
                >
                  {DIVISION_LABELS[selectedSchool.division]}
                </Badge>
              </div>
              {selectedSchool.coachName && (
                <p className="text-muted-foreground">
                  Coach:{" "}
                  <span className="text-foreground">
                    {selectedSchool.coachName}
                  </span>
                </p>
              )}
              {selectedSchool.coachEmail && (
                <p className="text-muted-foreground">
                  Email:{" "}
                  <span className="text-foreground">
                    {selectedSchool.coachEmail}
                  </span>
                </p>
              )}
              {selectedSchool.coachPhone && (
                <p className="text-muted-foreground">
                  Phone:{" "}
                  <span className="text-foreground">
                    {selectedSchool.coachPhone}
                  </span>
                </p>
              )}
              {selectedSchool.notes && (
                <p className="text-muted-foreground">
                  Notes:{" "}
                  <span className="text-foreground">
                    {selectedSchool.notes}
                  </span>
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              {!isDemo && (
                <Button
                  data-ocid="scholarships.delete_button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selectedSchool.id)}
                >
                  <Trash2 size={14} className="mr-2" /> Remove School
                </Button>
              )}
              <Button
                data-ocid="scholarships.close_button"
                variant="outline"
                className={isDemo ? "w-full" : ""}
                onClick={() => setSelectedSchool(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
