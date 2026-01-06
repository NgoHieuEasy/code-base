import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleX } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useFormContext, Controller, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  helperText?: string;
  options: Option[];
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  placeholder?: string;
};

export function RHFSelect({
  name,
  label,
  options,
  InputProps,

  placeholder = "-- Chọn --",
}: Props) {
  const { control, clearErrors } = useFormContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <div className="flex flex-col gap-1 w-ful" ref={ref}>

            <div className="relative w-full focus:border-red-500">
              {label && (
                <div className="flex gap-1 text-mdMedium text-gray-50 mb-2">
                  <span>{label.text}</span>
                  <span className="text-red-400">{label.icon}</span>
                </div>
              )}
              <div
                className={`flex items-center text-white justify-between px-4 py-3  h-[48px] rounded-[10px] bg-[#404040]/40 cursor-pointer
              border
                ${error ? "border-red-500" : "border-[#404040] "}
              `}
                onClick={() => setOpen(!open)}
              >
                <div className="flex items-center gap-2">
                  {InputProps?.startAdornment && (
                    <div className="flex items-center">
                      {InputProps.startAdornment}
                    </div>
                  )}
                  <span className="text-base">
                    {selectedOption?.label || (
                      <span className="text-[#b7b9c0]">{placeholder}</span>
                    )}
                  </span>
                </div>

                <ChevronDown className={twMerge("", open && 'rotate-180')} />
              </div>

              {open && (
                <div className="absolute top-full left-0 w-full mt-1 z-10 bg-white dark:bg-[#404040] border-gray-600 border rounded-xl shadow-lg max-h-60 overflow-auto">
                  {options.map((opt) => (
                    <div
                      key={opt.value}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 hover:text-white"
                      onClick={() => {
                        field.onChange(opt.value);
                        setOpen(false);
                      }}
                    >
                      <p className="text-white">{opt.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
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
        );
      }}
    />
  );
}
