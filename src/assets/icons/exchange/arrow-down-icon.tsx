import { memo } from "react";

interface Props {
  currentColor?: string;
}
const ArrowDownIcon = ({ currentColor = "#808080" }: Props) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 4 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 3L0 0H4L2 3Z" fill={currentColor} />
    </svg>
  );
};

export default memo(ArrowDownIcon);
