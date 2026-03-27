import { Button } from "@/components/ui/button";
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
import { Info, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sport } from "../backend";
import type { AthleteProfile } from "../backend";
import { DEMO_PROFILE } from "../demoData";
import { useProfile, useSaveProfile } from "../hooks/useQueries";

const EMPTY_PROFILE: AthleteProfile = {
  name: "",
  sport: Sport.football,
  position: "",
  graduationYear: BigInt(new Date().getFullYear() + 2),
  gpa: "",
  height: "",
  weight: "",
  city: "",
  state: "",
  bio: "",
  hudlLink: "",
  twitterHandle: "",
  instagramHandle: "",
};

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const saveProfile = useSaveProfile();
  const [form, setForm] = useState<AthleteProfile>(EMPTY_PROFILE);
  const [demoLoaded, setDemoLoaded] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(profile);
      setDemoLoaded(false);
    } else if (!isLoading && !demoLoaded) {
      setForm(DEMO_PROFILE);
      setDemoLoaded(true);
    }
  }, [profile, isLoading, demoLoaded]);

  const isDemo = !isLoading && !profile;

  const set = (field: keyof AthleteProfile, value: string | bigint) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync(form);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        data-ocid="profile.loading_state"
      >
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Athlete Profile
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          Your profile is used to generate personalized promo content.
        </p>

        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl border px-4 py-3 flex items-start gap-3"
            style={{
              backgroundColor: "oklch(0.15 0.04 47)",
              borderColor: "oklch(0.68 0.21 47 / 0.4)",
            }}
          >
            <Info
              size={16}
              className="flex-shrink-0 mt-0.5"
              style={{ color: "oklch(0.75 0.18 47)" }}
            />
            <p className="text-sm" style={{ color: "oklch(0.78 0.12 47)" }}>
              <strong>Demo Profile</strong> — This form is pre-filled with
              sample athlete data for Marcus Johnson. Edit the fields and click{" "}
              <strong>Save Profile</strong> to replace it with your
              athlete&apos;s real information.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="rounded-xl border border-border p-5 space-y-4 shadow-card"
            style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
          >
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
              Basic Info
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-ocid="profile.name.input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Marcus Johnson"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sport">Sport</Label>
                <Select
                  value={form.sport}
                  onValueChange={(v) => set("sport", v as Sport)}
                >
                  <SelectTrigger data-ocid="profile.sport.select" id="sport">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Sport.football}>Football</SelectItem>
                    <SelectItem value={Sport.basketball}>Basketball</SelectItem>
                    <SelectItem value={Sport.both}>Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  data-ocid="profile.position.input"
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                  placeholder="Quarterback"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gradYear">Graduation Year</Label>
                <Input
                  id="gradYear"
                  data-ocid="profile.graduation_year.input"
                  type="number"
                  value={form.graduationYear.toString()}
                  onChange={(e) =>
                    set("graduationYear", BigInt(e.target.value || 2026))
                  }
                  placeholder="2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  data-ocid="profile.gpa.input"
                  value={form.gpa}
                  onChange={(e) => set("gpa", e.target.value)}
                  placeholder="3.8"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  data-ocid="profile.height.input"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                  placeholder="6'2&quot;"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  data-ocid="profile.weight.input"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  placeholder="185 lbs"
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border border-border p-5 space-y-4 shadow-card"
            style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
          >
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Location
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  data-ocid="profile.city.input"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Atlanta"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  data-ocid="profile.state.input"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="GA"
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border border-border p-5 space-y-4 shadow-card"
            style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
          >
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Bio &amp; Links
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                data-ocid="profile.bio.textarea"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Tell coaches and recruiters about yourself..."
                rows={4}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hudl">Hudl Link</Label>
              <Input
                id="hudl"
                data-ocid="profile.hudl.input"
                value={form.hudlLink}
                onChange={(e) => set("hudlLink", e.target.value)}
                placeholder="https://hudl.com/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input
                  id="twitter"
                  data-ocid="profile.twitter.input"
                  value={form.twitterHandle}
                  onChange={(e) => set("twitterHandle", e.target.value)}
                  placeholder="@handle"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  data-ocid="profile.instagram.input"
                  value={form.instagramHandle}
                  onChange={(e) => set("instagramHandle", e.target.value)}
                  placeholder="@handle"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            data-ocid="profile.save_button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isDemo ? "Save My Athlete Profile" : "Save Profile"}
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
