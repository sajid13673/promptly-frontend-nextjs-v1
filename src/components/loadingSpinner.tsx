import React from "react";

type SpinnerColor = "blue" | "purple" | "red";
  const COLOR_MAP: Record<SpinnerColor, string> = {blue : '#1B82F7', purple: '#701094', red: '#E82030'}

const LoadingSpinner = ({
  size = 5,
  color = "blue",
  border = 4,
}: {
  size?: number;
  color?: SpinnerColor;
  border?: number;
}) => {
  const borderColor = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div
      className={`animate-spin rounded-full border-t-transparent`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        borderWidth: `${border}px`,
        borderStyle: "solid",
        borderTopColor: "transparent",
        color: borderColor,
      }}
    />
  );
};

export default LoadingSpinner;
