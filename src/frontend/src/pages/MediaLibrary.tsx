import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Image as ImageIcon,
  Loader2,
  Play,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MediaType } from "../backend";
import type { MediaItem } from "../backend";
import {
  useAddMediaItem,
  useDeleteMediaItem,
  useMediaItems,
} from "../hooks/useQueries";

// ─── Video thumbnail with play overlay ───────────────────────────────────────
function VideoThumbnail({
  item,
  onClick,
}: { item: MediaItem; onClick: () => void }) {
  return (
    <button
      type="button"
      className="w-full h-full relative group/play cursor-pointer bg-transparent border-0 p-0"
      onClick={onClick}
      aria-label={`Play ${item.caption || "video"}`}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.10 0.02 248)" }}
      >
        <Video size={28} className="text-muted-foreground" />
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity"
        style={{ opacity: 1 }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/play:scale-110"
          style={{ backgroundColor: "oklch(0.68 0.21 47 / 0.9)" }}
        >
          <Play size={16} className="text-white ml-0.5" fill="white" />
        </div>
      </div>
      <div
        className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono"
        style={{
          backgroundColor: "oklch(0.0 0.0 0 / 0.75)",
          color: "oklch(0.935 0.012 240)",
        }}
      >
        VIDEO
      </div>
    </button>
  );
}

// ─── Video preview modal ──────────────────────────────────────────────────────
function VideoPreviewModal({
  item,
  open,
  onClose,
}: {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="media.video_preview.dialog"
        className="max-w-3xl w-full p-0 overflow-hidden"
        style={{
          backgroundColor: "oklch(0.10 0.018 248)",
          borderColor: "oklch(0.20 0.036 245)",
        }}
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-foreground text-sm font-semibold flex items-center gap-2">
            <Play size={14} className="text-primary" />
            {item.caption || "Video Highlight"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 pt-3">
          {/* biome-ignore lint/a11y/useMediaCaption: athlete highlight clips don't require captions */}
          <video
            src={item.blob.getDirectURL()}
            controls
            autoPlay={false}
            className="w-full rounded-xl"
            style={{ maxHeight: "480px", backgroundColor: "#000" }}
          />
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="text-xs"
                  style={{
                    backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                    color: "oklch(0.75 0.18 47)",
                    border: "none",
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MediaLibrary() {
  const { data: items = [], isLoading } = useMediaItems();
  const addMedia = useAddMediaItem();
  const deleteMedia = useDeleteMediaItem();
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const anyRef = useRef<HTMLInputElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.photo);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setMediaType(
      file.type.startsWith("video") ? MediaType.video : MediaType.photo,
    );
    setUploadProgress(0);
    setUploadOpen(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    try {
      setUploadProgress(10);
      await addMedia.mutateAsync({
        mediaType,
        caption,
        tags,
        file: selectedFile,
      });
      setUploadProgress(100);
      toast.success("Media uploaded!");
      setTimeout(() => {
        setUploadOpen(false);
        setSelectedFile(null);
        setCaption("");
        setTags([]);
        setTagInput("");
        setUploadProgress(0);
        if (photoRef.current) photoRef.current.value = "";
        if (videoRef.current) videoRef.current.value = "";
        if (anyRef.current) anyRef.current.value = "";
      }, 600);
    } catch {
      toast.error("Failed to upload.");
      setUploadProgress(0);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()))
        setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMedia.mutateAsync(id);
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const openVideoPreview = (item: MediaItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your highlight photos and videos.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Hidden inputs */}
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <input
            ref={anyRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            data-ocid="media.upload_button"
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            className="font-semibold border-border text-foreground hover:bg-primary/10"
            onClick={() => photoRef.current?.click()}
            data-ocid="media.photo_upload_button"
          >
            <ImageIcon size={15} className="mr-2" /> Upload Photo
          </Button>
          <Button
            className="font-semibold"
            style={{ backgroundColor: "oklch(0.68 0.21 47)", color: "#fff" }}
            onClick={() => videoRef.current?.click()}
            data-ocid="media.video_upload_button"
          >
            <Video size={15} className="mr-2" /> Upload Video
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-20"
          data-ocid="media.loading_state"
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border"
          data-ocid="media.empty_state"
          style={{ backgroundColor: "oklch(0.13 0.018 248)" }}
        >
          <div className="py-16 flex flex-col items-center justify-center gap-6">
            <div className="flex gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.50 0.22 265 / 0.15)" }}
              >
                <ImageIcon
                  size={28}
                  style={{ color: "oklch(0.65 0.18 265)" }}
                />
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.68 0.21 47 / 0.15)" }}
              >
                <Video size={28} style={{ color: "oklch(0.72 0.18 47)" }} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold text-lg">
                No media yet
              </p>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                Upload highlight photos and video clips to build your promo
                library. Coaches love seeing game footage.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => photoRef.current?.click()}
                data-ocid="media.dropzone"
              >
                <ImageIcon size={15} className="mr-2" /> Add Photo
              </Button>
              <Button
                className="font-semibold"
                style={{
                  backgroundColor: "oklch(0.68 0.21 47)",
                  color: "#fff",
                }}
                onClick={() => videoRef.current?.click()}
              >
                <Video size={15} className="mr-2" /> Add Video Highlight
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, GIF, MP4, MOV &middot; Large files supported
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Upload more tile */}
          <button
            type="button"
            className="rounded-xl border-2 border-dashed border-border aspect-square flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => anyRef.current?.click()}
            data-ocid="media.dropzone"
          >
            <Upload size={22} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add Media</span>
          </button>

          {items.map((item, idx) => (
            <motion.div
              key={String(item.id)}
              data-ocid={`media.item.${idx + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="relative group rounded-xl overflow-hidden border border-border shadow-card aspect-square"
              style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
            >
              {item.mediaType === MediaType.photo ? (
                <img
                  src={item.blob.getDirectURL()}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <VideoThumbnail
                  item={item}
                  onClick={() => openVideoPreview(item)}
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-3 pointer-events-none group-hover:pointer-events-auto">
                <Button
                  data-ocid={`media.delete_button.${idx + 1}`}
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-destructive hover:text-destructive/80 w-7 h-7"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
                <div>
                  {item.caption && (
                    <p className="text-xs text-foreground font-medium truncate">
                      {item.caption}
                    </p>
                  )}
                  <div className="flex gap-1 flex-wrap mt-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        className="text-xs px-1.5 py-0"
                        style={{
                          backgroundColor: "oklch(0.21 0.038 240)",
                          color: "oklch(0.69 0.025 240)",
                          border: "none",
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type badge */}
              <div
                className="absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor:
                    item.mediaType === MediaType.video
                      ? "oklch(0.68 0.21 47 / 0.9)"
                      : "oklch(0.50 0.22 265 / 0.8)",
                }}
              >
                {item.mediaType === MediaType.video ? (
                  <Video size={12} className="text-white" />
                ) : (
                  <ImageIcon size={12} className="text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent
          data-ocid="media.dialog"
          style={{
            backgroundColor: "oklch(0.14 0.025 240)",
            borderColor: "oklch(0.21 0.038 240)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              {mediaType === MediaType.video ? (
                <Video size={16} className="text-primary" />
              ) : (
                <ImageIcon size={16} className="text-primary" />
              )}
              Upload{" "}
              {mediaType === MediaType.video ? "Video Highlight" : "Photo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            {selectedFile && (
              <div
                className="flex items-center gap-2 text-sm text-foreground p-2 rounded-lg"
                style={{ backgroundColor: "oklch(0.21 0.038 240)" }}
              >
                {mediaType === MediaType.video ? (
                  <Video size={16} className="text-primary" />
                ) : (
                  <ImageIcon size={16} className="text-primary" />
                )}
                <span className="flex-1 truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadOpen(false);
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Caption</Label>
              <Input
                data-ocid="media.caption.input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`Describe this ${mediaType}...`}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tags</Label>
              <Input
                data-ocid="media.tags.input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tags and press Enter..."
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer text-xs"
                      style={{
                        backgroundColor: "oklch(0.68 0.21 47 / 0.15)",
                        color: "oklch(0.75 0.18 47)",
                        border: "none",
                      }}
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                    >
                      {tag} <X size={10} className="ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Upload progress */}
            {addMedia.isPending && (
              <div className="space-y-1.5" data-ocid="media.loading_state">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Uploading...
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            <Button
              type="submit"
              data-ocid="media.submit_button"
              className="w-full font-semibold"
              style={{ backgroundColor: "oklch(0.68 0.21 47)", color: "#fff" }}
              disabled={addMedia.isPending || !selectedFile}
            >
              {addMedia.isPending ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Upload size={16} className="mr-2" />
              )}
              {addMedia.isPending
                ? "Uploading..."
                : `Upload ${mediaType === MediaType.video ? "Video" : "Photo"}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        item={previewItem}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewItem(null);
        }}
      />
    </div>
  );
}
