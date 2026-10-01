import { motion } from "motion/react";
import { Check } from "lucide-react";
import ItemActionMenu from "./ItemActionMenu";

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function ItemCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}) {
  const priority =
    PRIORITY_LABELS[item.priority] ||
    "Medium";

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start gap-3">

        {/* Checkbox */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.85,
          }}
          onClick={() =>
            onToggle(item.id)
          }
          aria-label={
            item.completed
              ? `Mark ${item.name} incomplete`
              : `Mark ${item.name} complete`
          }
          className={`
            mt-0.5
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            border-2
            transition-all
            ${
              item.completed
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                : "border-slate-300 text-transparent hover:border-slate-500 dark:border-slate-600"
            }
          `}
        >
          <motion.span
            initial={false}
            animate={{
              scale: item.completed
                ? 1
                : 0,
              opacity:
                item.completed
                  ? 1
                  : 0,
            }}
          >
            <Check
              size={14}
              strokeWidth={3}
            />
          </motion.span>
        </motion.button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <p
                className={`
                  text-sm
                  font-medium
                  transition
                  ${
                    item.completed
                      ? "text-slate-400 line-through dark:text-slate-500"
                      : "text-slate-800 dark:text-slate-100"
                  }
                `}
              >
                {item.name}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {item.category && (
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {item.category}
                  </span>
                )}

                {item.quantity > 1 && (
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    ×{item.quantity}
                  </span>
                )}

                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {priority}
                </span>
              </div>

              {item.notes && (
                <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  {item.notes}
                </p>
              )}
            </div>

{/* Actions */}
<ItemActionMenu
  onEdit={() => onEdit(item)}
  onDelete={() => onDelete(item)}
/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}