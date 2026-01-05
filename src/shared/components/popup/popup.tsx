import { ChevronLeft, X } from "lucide-react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
interface PopupProps {
  onClose?: () => void;
  onBack?: () => void;
  hideBack?: boolean;
  children: React.ReactNode;
  subChildren?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  className?: string;
}
export const Popup = ({
  onClose,
  onBack,
  hideBack,
  children,
  subChildren,
  title,
  description,
  open,
  className = "w-[600px]",
}: PopupProps) => {
  // useEffect(() => {
  //   if (open) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }

  //   return () => {
  //     document.body.classList.remove("overflow-hidden");
  //   };
  // }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40  z-[100]">
          <div
            className={twMerge(
              clsx(
                `left-1/2  -translate-y-1/2 top-1/2 -translate-x-1/2 z-9999   relative`,
                className
              )
            )}
          >
            <div className="h-full bg-light-bg-white-light bg-[#000A14] dark:bg-primary-background p-4 md:p-8 sm:mx-0 mx-3 rounded-xl">
              <div className="flex justify-between items-center ">
                <div className="flex items-center gap-2">
                  {onBack && !hideBack && (
                    <ChevronLeft className="cursor-pointer" onClick={onBack} />
                  )}

                  <span className="sm:text-xlMedium text-lgMedium text-brand-500">
                    {title}
                  </span>
                </div>
                {onClose && (
                  <button
                    onClick={() => onClose()}
                    className="relative z-1 rounded-full border  w-[20px]  h-[20px] flex justify-center items-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="x text-smRegular text-gray-300">
                {description}
              </span>
              <div className={twMerge("mt-5", !onClose && "mt-0")}>
                {children}
              </div>
            </div>

            {subChildren && (
              <div className="absolute -right-[330px] hidden lg:block space-y-1 w-[320px] bottom-0 bg-gray-900 rounded-xl p-4">
                {subChildren}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
