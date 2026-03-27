import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, type MediaType } from "../backend";
import type {
  Achievement,
  AthleteProfile,
  ContentPost,
  MediaItem,
  ScholarshipTarget,
} from "../backend";
import { useActor } from "./useActor";

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<AthleteProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AthleteProfile) => actor!.saveCallerUserProfile(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useAchievements() {
  const { actor, isFetching } = useActor();
  return useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAchievement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (a: Achievement) => actor!.addAchievement(a),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
}

export function useDeleteAchievement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteAchievement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
}

export function useContentPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContentPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: ContentPost) => actor!.addContentPost(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDeleteContentPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteContentPost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useScholarshipTargets() {
  const { actor, isFetching } = useActor();
  return useQuery<ScholarshipTarget[]>({
    queryKey: ["scholarships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScholarshipTargets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScholarshipTarget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: ScholarshipTarget) => actor!.addScholarshipTarget(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scholarships"] }),
  });
}

export function useDeleteScholarshipTarget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteScholarshipTarget(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scholarships"] }),
  });
}

export function useMediaItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMediaItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMediaItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mediaType,
      caption,
      tags,
      file,
    }: {
      mediaType: MediaType;
      caption: string;
      tags: string[];
      file: File;
    }) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor!.addMediaItem(mediaType, caption, tags, blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMediaItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteMediaItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}
