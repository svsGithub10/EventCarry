import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";

export default function Toast({
  message,
  onClose,
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.96,
          }}
          className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Check size={15} />
          </span>

          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {message}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}