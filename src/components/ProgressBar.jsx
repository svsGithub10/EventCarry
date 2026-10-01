import { motion } from "motion/react";

export default function ProgressBar({
  completed,
  total,
}) {
  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {completed} of {total} completed
        </span>

        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {progress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-slate-900 dark:bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}