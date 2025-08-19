"use client";

import { CheckCircleIcon, XCircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Notification({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const Icon = type === "success" ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-uala-primary border border-uala-primary/20 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <Icon className="size-5 text-white mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
