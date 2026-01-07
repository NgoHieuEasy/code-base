import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Popup } from "./popup";
import { twMerge } from "tailwind-merge";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "../breadcrums";

interface Props {
  open: boolean;
  onClose?: () => void;
  onBack?: () => void;
  hideBack?: boolean;
  children: React.ReactNode;
  subChildren?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}
const PanelPopup = ({
  open,
  onClose,
  onBack,
  hideBack,
  children,
  subChildren,
  title,
  description,
  className,
}: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // chặn cuộn body
    } else {
      document.body.style.overflow = "auto"; // khôi phục
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <div>
      {isMobile ? (
        <div className=" bg-gray-900  text-white">
          {/* Overlay + Panel */}
          <AnimatePresence>
            {open && (
              <>
                {/* Overlay mờ nền */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10"
                  onClick={onClose}
                />

                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100) {
                      if (!onClose) return;
                      onClose();
                    }
                  }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 dark:bg-[#1E2329] bg-light-bg-white-light rounded-t-3xl z-20  overflow-hidden"
                >
                  <div className="p-5 flex flex-col w-full justify-center items-center min-h-[60vh] max-h-[95vh]">
                    <div className="w-[64px] h-[4px] mb-2 rounded-[100px] bg-white" />

                    <div className=" w-full flex gap-2 text-left pb-2">
                      {onBack && !hideBack && (
                        <ChevronLeft
                          className="cursor-pointer"
                          onClick={onBack}
                        />
                      )}

                      <Breadcrumb
                        title={title ?? ""}
                        description={description ?? ""}
                      />
                    </div>

                    <div
                      className={twMerge(
                        " w-full pt-1 h-auto  overflow-y-scroll"
                      )}
                    >
                      {children}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Popup
          title={title}
          open={open}
          onClose={onClose}
          subChildren={subChildren}
          className={className}
          onBack={onBack}
          hideBack={hideBack}
        >
          <div className="overflow-auto  scrollbar-hide">{children}</div>
        </Popup>
      )}
    </div>
  );
};

export default PanelPopup;
