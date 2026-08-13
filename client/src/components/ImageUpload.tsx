import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  className?: string;
}

export function ImageUpload({ onImageUploaded, className = "" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.blog.uploadImage.useMutation({
    onSuccess: (data) => {
      onImageUploaded(data.url);
      setPreview(null);
      setIsUploading(false);
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(error.message || "Failed to upload image");
    },
  });

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setIsUploading(true);
    const base64Reader = new FileReader();
    base64Reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1]; // Remove data:image/...;base64, prefix
      uploadMutation.mutate({
        fileName: file.name,
        fileType: file.type,
        fileData: base64,
      });
    };
    base64Reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-[#d4af37]/20"
          />
          {!isUploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#d4af37] hover:bg-[#b8941f] text-[#0a0e27] flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${
              isDragging
                ? "border-[#d4af37] bg-[#d4af37]/10"
                : "border-[#d4af37]/20 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5"
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
              {isDragging ? (
                <Upload className="w-6 h-6 text-[#d4af37]" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#d4af37]" />
              )}
            </div>
            <div>
              <p className="text-[#e5e5e5] font-medium mb-1">
                {isDragging ? "Drop image here" : "Click or drag image to upload"}
              </p>
              <p className="text-[#e5e5e5]/50 text-sm">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
