
import React from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader className={cn("animate-spin text-burntOrange", sizeClasses[size])} />
    </div>
  );
};

export { LoadingSpinner };
