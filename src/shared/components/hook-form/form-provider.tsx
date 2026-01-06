import type { UseFormReturn } from "react-hook-form";

import { FormProvider as RHFForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  className?: string;
};

export function Form({
  children,
  onSubmit,
  methods,
  className,
}: Readonly<FormProps>) {
  return (
    <RHFForm {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!onSubmit) return;
          onSubmit();
        }}
        noValidate
        autoComplete="off"
        encType="multipart/form-data"
        className={twMerge("", className)}
      >
        {children}
      </form>
    </RHFForm>
  );
}
