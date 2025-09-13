import React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text = "Loading...",
  className,
  showText = true,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <RefreshCw
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
      {showText && <span className="ml-2 text-foreground">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
