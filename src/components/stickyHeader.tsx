import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  title: string;
  isSidebarOpen?: boolean;
}

export default function StickyHeader({ title, isSidebarOpen }: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        // Trigger scrolling if the text width exceeds the parent container width
        setIsOverflowing(
          textRef.current.offsetWidth > containerRef.current.offsetWidth,
        );
      }
    };

    // Run on mount or layout adjustments
    checkOverflow();

    // Add a tiny delay if the parent state triggers an animation/transition (like a sidebar sliding out)
    const timeoutId = setTimeout(checkOverflow, 100);

    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
      clearTimeout(timeoutId);
    };
  }, [title, isSidebarOpen]);

  return (
    <div
      ref={containerRef}
      className="p-2 sticky top-0 mb-auto w-full bg-[var(--surface-secondary)] shadow dark:shadow-blue-300 dark:shadow-xs text-[var(--text-primary)] overflow-hidden whitespace-nowrap"
    >
      <div
        className={`inline-block ${
          isOverflowing
            ? "animate-marquee hover:[animation-play-state:paused]"
            : ""
        }`}
      >
        <span ref={textRef} className="text-xs font-semibold px-4 inline-block">
          {title}
        </span>

        {isOverflowing && (
          <span className="text-xs font-semibold px-4 inline-block">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
