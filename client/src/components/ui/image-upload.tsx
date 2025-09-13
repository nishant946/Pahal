import { useState, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  label = "Image",
  placeholder = "Enter image URL or upload a file",
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // For now, we'll create a local URL
      // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3"
        >
          <Upload className="h-4 w-4" />
        </Button>
        {(value || preview) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="px-3 text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Preview */}
      {preview && (
        <div className="relative">
          <div className="w-32 h-32 rounded-lg border-2 border-border overflow-hidden bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setPreview("");
                // Show placeholder for broken images
              }}
            />
          </div>
          <div className="absolute -top-2 -right-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 bg-white border-red-200 text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {!preview && value && (
        <div className="flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Invalid image URL</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-sm text-blue-600">Uploading image...</div>
      )}

      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
      </p>
    </div>
  );
}
