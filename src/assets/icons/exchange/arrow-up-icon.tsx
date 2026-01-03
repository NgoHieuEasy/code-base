import { memo } from "react";

interface Props {
  currentColor?: string;
}
const ArrowUpIcon = ({ currentColor = "#808080" }: Props) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 4 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 0L4 3H0L2 0Z" fill={currentColor} />
    </svg>
  );
};

export default memo(ArrowUpIcon);
