import { memo } from "react";

interface Props {
  currentColor?: string;
}
const AskIcon = ({ currentColor = "#B3B3B3" }: Props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.4">
        <path
          d="M7 11C8.10457 11 9 11.8954 9 13V18C9 19.1046 8.10457 20 7 20H2C0.895431 20 8.05332e-09 19.1046 0 18V13C0 11.8954 0.895431 11 2 11H7ZM2 13V18H7V13H2Z"
          fill="#29E9A9"
        />
        <path
          d="M7 0C8.10457 0 9 0.895431 9 2V7C9 8.10457 8.10457 9 7 9H2C0.895431 9 8.05332e-09 8.10457 0 7V2C0 0.895431 0.895431 8.05319e-09 2 0H7ZM2 2V7H7V2H2Z"
          fill="#29E9A9"
        />
        <path
          d="M18 0C19.1046 0 20 0.895431 20 2V18C20 19.1046 19.1046 20 18 20H13C11.8954 20 11 19.1046 11 18V2C11 0.895431 11.8954 8.0532e-09 13 0H18ZM13 2V18H18V2H13Z"
          fill={currentColor}
        />
      </g>
    </svg>
  );
};

export default memo(AskIcon);
