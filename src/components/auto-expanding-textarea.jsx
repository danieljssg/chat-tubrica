"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

export function AutoExpandingTextarea({
  value,
  onChange,
  placeholder,
  disabled,
  onKeyDown,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight (content height)
      textarea.style.height = `${Math.max(64, textarea.scrollHeight)}px`; // 64px = h-16
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={onKeyDown}
      className="min-h-16 resize-none overflow-hidden"
      style={{ height: "64px" }} // h-16 inicial
    />
  );
}
