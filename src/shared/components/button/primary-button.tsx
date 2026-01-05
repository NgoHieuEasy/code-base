import React from "react";
import { Loading } from "../loading";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
interface Props {
  className?: string;
  text: string;
  onClick?: () => void;
  sufixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  isLoading?: boolean;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
}

const PrimaryButton = ({
  sufixIcon,
  prefixIcon,
  className,
  text,
  onClick,
  isLoading,
  type = "submit",
  disabled,
}: Props) => {
  return (
    <button
      type={type}
      name={text}
      onClick={onClick}
      className={twMerge(
        clsx(` flex flex-row justify-center items-center gap-3 px-6 py-4 rounded-[4px] cursor-pointer h-[50px]
          text-mdSemiBold w-full bg-brand-500 ${
            !disabled ? " text-white" : "opacity-50 "
          }`),
        className
      )}
      disabled={disabled}
    >
      {prefixIcon}
      {isLoading ? (
        <Loading />
      ) : text ? (
        <span className="text-center">{text}</span>
      ) : null}
      {sufixIcon}
    </button>
  );
};

export default PrimaryButton;
