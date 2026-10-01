import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            bg-slate-950/50
            p-0
            backdrop-blur-sm
            sm:items-center
            sm:p-6
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-t-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-800
              dark:bg-slate-900
              sm:rounded-3xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                py-4
                dark:border-slate-800
              "
            >
              <h2
                id="modal-title"
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {title}
              </h2>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-slate-200
                "
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}