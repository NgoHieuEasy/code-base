import { useFormContext, Controller } from "react-hook-form";
import { Check } from "lucide-react";

type Props = {
  name: string;
  label?: string;
  disabled?: boolean;
};

export function RHFCheckField({ name, disabled, ...other }: Props) {
  const { control, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col">
          <label className="relative">
            <input
              type="checkbox"
              {...field}
              {...other}
              checked={field.value || false}
              onChange={(e) => {
                const checked = e.target.checked;

                if (checked) {
                  clearErrors(name); // bỏ lỗi nếu đã check
                }

                field.onChange(e.target.checked);
              }}
              disabled={disabled}
              className="sr-only"
            />

            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition
    ${disabled ? "bg-transparent" : ""}
    ${error ? "border-red-500" : "border-gray-300"}
  `}
            >
              {field.value && <Check size={13} />}
            </div>
          </label>
        </div>
      )}
    />
  );
}
