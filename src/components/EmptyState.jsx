import { motion } from "motion/react";
import { Plus } from "lucide-react";

export default function EmptyState({
  onCreate,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        flex
        min-h-[420px]
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-slate-300
        bg-white/60
        px-6
        text-center
        dark:border-slate-700
        dark:bg-slate-900/50
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          text-3xl
          dark:bg-slate-800
        "
      >
        ✨
      </div>

      <h2
        className="
          mt-6
          text-xl
          font-semibold
          text-slate-900
          dark:text-white
        "
      >
        No events yet
      </h2>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        Create your first event and start
        organizing everything you need.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-2xl
          bg-slate-900
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-slate-900/10
          transition
          hover:-translate-y-0.5
          hover:bg-slate-800
          active:translate-y-0
          dark:bg-white
          dark:text-slate-900
          dark:hover:bg-slate-100
        "
      >
        <Plus size={17} />
        Create Event
      </button>
    </motion.div>
  );
}