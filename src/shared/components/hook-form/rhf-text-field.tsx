import { useFormContext, Controller, useFormState } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./style.css";
import { CircleX } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type Props = InputProps & {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  helperText?: string;
  disabled?: boolean;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  InputLabelProps?: {
    shrink?: boolean;
  };
  // onChange?:(value:string) => void;
  className?: string;
  isErrorMessage?: boolean;
  align?: "left" | "right";
};

export function RHFTextField({
  name,
  label,
  helperText,
  InputProps,
  InputLabelProps,
  disabled,
  className,
  isErrorMessage = true,
  align = "left",
  ...other
}: Props) {
  const { control, clearErrors } = useFormContext();
  const { errors } = useFormState({ name });

  const error = errors[name];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearErrors(name);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearErrors, name]);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <div className="flex gap-1 text-mdMedium text-gray-50 mb-2">
              <span>{label.text}</span>
              <span className="text-red-400">{label.icon}</span>
            </div>
          )}
          <div
            className={` relative bg-[#404040]/40 text-white pl-3  w-full h-[48px] flex items-center  rounded-[10px]  transition-all duration-200 
  ${isFocused && !error && "border-focus-input"} ${error ? "border border-red-500" : "  "} `}
          >
            {InputProps?.startAdornment && (
              <div className="flex items-center">
                {InputProps.startAdornment}
              </div>
            )}

            <input
              {...field}
              {...other}
              disabled={disabled}
              onFocus={(e) => {
                setIsFocused(true);
                if (other.onFocus) other.onFocus(e);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              className={twMerge(
                clsx(
                  `w-full relative z-0 bg-transparent will-change-transform isolation-auto transform-gpu rounded-[10px] flex pr-4 py-4 items-center gap-[10px] self-stretch placeholder:text-gray-600 focus:outline-none text-white `
                ),
                className
              )}
            />

            {InputProps?.endAdornment && (
              <div className="pe-3 flex items-center">
                {InputProps.endAdornment}
              </div>
            )}
          </div>
          {error && isErrorMessage && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                  <CircleX size={20} />
                  {error.message}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    />
  );
}
