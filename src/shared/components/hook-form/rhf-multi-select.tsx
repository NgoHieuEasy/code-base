import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
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
  options: Option[];
  placeholder?: string;
};

export function RHFMultiSelect({
  name,
  label,
  options,
  placeholder = "Select...",
}: Props) {
  const { control, clearErrors } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const { errors } = useFormState({ name });
  const error = errors[name];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto clear error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => clearErrors(name), 3000);
      return () => clearTimeout(t);
    }
  }, [error, name, clearErrors]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: (string | number)[] = field.value || [];

        const filteredOptions = options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        );

        const toggleValue = (val: string | number) => {
          if (selectedValues.includes(val)) {
            field.onChange(selectedValues.filter((v) => v !== val));
          } else {
            field.onChange([...selectedValues, val]);
          }
        };

        return (
          <div className="flex flex-col gap-1 w-full" ref={ref}>
            {/* LABEL */}
            {label && (
              <div className="flex gap-1 text-mdMedium text-gray-50 mb-2">
                <span>{label.text}</span>
                <span className="text-red-400">{label.icon}</span>
              </div>
            )}

            {/* INPUT BOX */}
            <div
              onClick={() => setOpen(!open)}
              className={twMerge(
                "flex items-center flex-wrap gap-2 text-white px-4 py-2 min-h-[48px] rounded-[10px] bg-[#404040]/40 cursor-pointer border",
                error ? "border-red-500" : "border-[#404040]"
              )}
            >
              {/* SELECTED TAGS */}
              {selectedValues.length === 0 ? (
                <span className="text-[#b7b9c0]">{placeholder}</span>
              ) : (
                selectedValues.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <div
                      key={val}
                      className="flex items-center gap-1 bg-[#303030] border border-gray-600 rounded-md px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{opt?.label}</span>
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => toggleValue(val)}
                      />
                    </div>
                  );
                })
              )}

              <ChevronDown
                className={twMerge(
                  "ml-auto transition",
                  open && "rotate-180"
                )}
              />
            </div>

            {/* DROPDOWN */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute  left-8 right-8 z-10 mt-20  bg-[#404040] border border-gray-600 rounded-xl shadow-xl max-h-60 overflow-auto"
                >
                  {/* SEARCH BOX */}
                  <div className="sticky top-0 bg-[#404040] p-2 border-b border-gray-600">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-3 py-2 rounded-md bg-[#2c2c2c] text-white outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* OPTIONS */}
                  {filteredOptions.map((opt) => {
                    const active = selectedValues.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValue(opt.value);
                        }}
                        className={twMerge(
                          "px-4 py-2 cursor-pointer",
                          active
                            ? "bg-[#2ebdb1]/30 text-white"
                            : "hover:bg-gray-600 hover:text-white"
                        )}
                      >
                        {opt.label}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ERROR */}
            {error && (
              <div className="text-red-500 text-xs mt-1">{error.message}</div>
            )}
          </div>
        );
      }}
    />
  );
}
