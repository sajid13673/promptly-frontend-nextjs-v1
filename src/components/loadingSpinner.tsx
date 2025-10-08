import React from "react";

const LoadingSpinner = ({
  size = 5,
  color = "blue-500",
  border = 4
}: {
  size: number;
  color: string;
  border: number
}) => {
  const style = { width: `${size}rem`, height: `${size}rem` };
  const spinnerColor = `border-${color}`;
  const borderThickness = `border-${border}`

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${spinnerColor} ${borderThickness}`}
      style={style}
    />
  );
};

export default LoadingSpinner;
