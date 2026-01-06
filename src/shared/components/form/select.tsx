import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/utils/utilts";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  label?: string;
  helperText?: string;
  options: Option[];
  value: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disable?: boolean;
  className?: string;
};

export default function Select({
  label,
  helperText,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disable,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            color: "white",
            fontSize: 14,
            opacity: disable ? 0.5 : 1,
          }}
        >
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(`
   
    bg-[#151d27]
    px-4 py-2
    rounded-lg
    border border-[#2c333c]
     flex items-center justify-between gap-2
    ${disable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    select-none
    text-white
    ${className}`)}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>

            {/* Chevron icon */}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </PopoverTrigger>

        {!disable && (
          <PopoverPortal>
            <PopoverContent
              align="start"
              style={{
                border: "none !important",
                background: "#151d27",
                borderRadius: 8,
                padding: "6px 0",
                width: "auto",
                minWidth: "max-content",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.4)",
                zIndex: 99999,
              }}
            >
              {options.map((opt) => (
                <div
                  key={opt.value}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#2c333c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#151d27")
                  }
                  onClick={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </PopoverContent>
          </PopoverPortal>
        )}
      </Popover>

      {helperText && (
        <p style={{ color: "#9ca3af", fontSize: 12 }}>{helperText}</p>
      )}
    </div>
  );
}
