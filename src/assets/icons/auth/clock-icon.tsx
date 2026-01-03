import { memo } from "react";

interface Props {
  currentColor?: string;
}
const ClockIcon = ({ currentColor = "#2EBDB1" }: Props) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.33333 4.33333V9.33333L12.6667 11M17.6667 9.33333C17.6667 13.9357 13.9357 17.6667 9.33333 17.6667C4.73096 17.6667 1 13.9357 1 9.33333C1 4.73096 4.73096 1 9.33333 1C13.9357 1 17.6667 4.73096 17.6667 9.33333Z"
        stroke={currentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(ClockIcon);
